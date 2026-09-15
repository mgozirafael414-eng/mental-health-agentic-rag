const fs = require("fs");
const path = require("path");

const prisma = require("../../config/database");

const {
chunkText
} = require("../utils/chunker");

const {
createEmbeddings
} = require("../embeddings/embeddingService");

// ========================================
// DOCUMENT INGESTION SERVICE
// ========================================

// ========================================
// CONVERT EMBEDDING ARRAY TO VECTOR STRING
// ========================================

const embeddingToVectorString = (
embedding
) => {
if (
!Array.isArray(embedding) ||
embedding.length === 0
) {
throw new Error(
"Invalid embedding."
);
}

return "[" + embedding.join(",") + "]";
};

// ========================================
// INGEST DOCUMENT
// ========================================

const ingestDocument = async ({
filePath,
title,
source = null,
description = null
}) => {
try {
// ========================================
// VALIDATE FILE
// ========================================

if (!filePath) {
  throw new Error(
    "Document file path is required."
  );
}

const absolutePath =
  path.resolve(filePath);

if (!fs.existsSync(absolutePath)) {
  throw new Error(
    "Document not found: " +
    absolutePath
  );
}

// ========================================
// READ DOCUMENT
// ========================================

console.log(
  "Reading document: " +
  absolutePath
);

const text =
  fs.readFileSync(
    absolutePath,
    "utf8"
  );

if (!text.trim()) {
  throw new Error(
    "Document is empty."
  );
}

// ========================================
// CREATE CHUNKS
// ========================================

console.log(
  "Creating document chunks..."
);

const chunks =
  chunkText(
    text,
    500,
    100
  );

if (
  !Array.isArray(chunks) ||
  chunks.length === 0
) {
  throw new Error(
    "No chunks were created from the document."
  );
}

console.log(
  "Created " +
  chunks.length +
  " chunks."
);

// ========================================
// CREATE EMBEDDINGS
// ========================================

console.log(
  "Creating embeddings..."
);

const embeddings =
  await createEmbeddings(
    chunks
  );

if (
  !Array.isArray(embeddings) ||
  embeddings.length !== chunks.length
) {
  throw new Error(
    "Number of embeddings does not match number of chunks."
  );
}

// ========================================
// CREATE DOCUMENT
// ========================================

console.log(
  "Creating document database record..."
);

const document =
  await prisma.document.create({
    data: {
      title:
        title ||
        path.basename(
          absolutePath
        ),

      source,

      description
    }
  });

// ========================================
// SAVE CHUNKS AND EMBEDDINGS
// ========================================

console.log(
  "Saving chunks and embeddings..."
);

for (
  let i = 0;
  i < chunks.length;
  i++
) {
  const chunk =
    chunks[i];

  const embedding =
    embeddings[i];

  // ========================================
  // CREATE CHUNK
  // ========================================

  const documentChunk =
    await prisma.documentChunk.create({
      data: {
        documentId:
          document.id,

        content:
          chunk,

        chunkIndex:
          i
      }
    });

  // ========================================
  // CONVERT EMBEDDING
  // ========================================

  const vectorString =
    embeddingToVectorString(
      embedding
    );

  // ========================================
  // STORE VECTOR
  // ========================================

  await prisma.$executeRawUnsafe(
  'UPDATE "DocumentChunk" SET "embedding" = $1::vector WHERE "id" = $2',
  vectorString,
  documentChunk.id
);

  console.log(
    "Saved chunk " +
    (i + 1) +
    "/" +
    chunks.length
  );
}

// ========================================
// SUCCESS
// ========================================

console.log(
  "Document \"" +
  document.title +
  "\" ingested successfully."
);

return {
  success: true,

  document: {
    id: document.id,
    title: document.title,
    source: document.source,
    description:
      document.description
  },

  chunksCreated:
    chunks.length
};

} catch (error) {
console.error(
"Document ingestion error:",
error
);

return {
  success: false,
  error: error.message
};

}
};

// ========================================
// INGEST MULTIPLE DOCUMENTS
// ========================================

const ingestDocuments = async (
documents
) => {
try {
if (
!Array.isArray(documents) ||
documents.length === 0
) {
throw new Error(
"Documents array is required."
);
}

const results = [];

for (
  let i = 0;
  i < documents.length;
  i++
) {
  console.log("");
  console.log(
    "========================================"
  );

  console.log(
    "Processing document " +
    (i + 1) +
    "/" +
    documents.length
  );

  console.log(
    "========================================"
  );
  console.log("");

  const result =
    await ingestDocument(
      documents[i]
    );

  results.push(
    result
  );
}

return {
  success: true,
  results
};

} catch (error) {
console.error(
"Multiple document ingestion error:",
error
);

return {
  success: false,
  error: error.message
};

}
};

// ========================================
// EXPORT
// ========================================

module.exports = {
ingestDocument,
ingestDocuments
};
