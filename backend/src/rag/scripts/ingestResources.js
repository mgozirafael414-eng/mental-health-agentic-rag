require("dotenv").config();

const prisma = require("../../config/database");

const {
  chunkText,
} = require("../utils/chunker");

const {
  createEmbeddings,
} = require("../embeddings/embeddingService");

// ========================================
// INGEST RESOURCES INTO RAG PIPELINE
// Converts Resource records into Document +
// DocumentChunk + vector embeddings so the
// AI assistant can retrieve resource content.
// ========================================

// ========================================
// CONVERT EMBEDDING TO VECTOR STRING
// ========================================

const embeddingToVectorString = (embedding) => {
  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error("Invalid embedding.");
  }
  return "[" + embedding.join(",") + "]";
};

// ========================================
// BUILD PLAIN TEXT DOCUMENT FROM RESOURCE
// ========================================

const resourceToText = (resource) => {
  const lines = [];

  lines.push(`TITLE: ${resource.title}`);
  lines.push(`CATEGORY: ${resource.category}`);
  lines.push(`DESCRIPTION: ${resource.shortDescription}`);
  lines.push("");
  lines.push(resource.content);
  lines.push("");

  if (resource.keyPoints?.length > 0) {
    lines.push("KEY POINTS:");
    resource.keyPoints.forEach((p) => lines.push(`- ${p}`));
    lines.push("");
  }

  if (resource.practicalTips?.length > 0) {
    lines.push("PRACTICAL TIPS:");
    resource.practicalTips.forEach((t) => lines.push(`- ${t}`));
    lines.push("");
  }

  if (resource.warningSigns?.length > 0) {
    lines.push("WARNING SIGNS:");
    resource.warningSigns.forEach((s) => lines.push(`- ${s}`));
    lines.push("");
  }

  if (resource.whenToSeekHelp) {
    lines.push(`WHEN TO SEEK HELP: ${resource.whenToSeekHelp}`);
    lines.push("");
  }

  return lines.join("\n");
};

// ========================================
// INGEST SINGLE RESOURCE
// ========================================

const ingestResource = async (resource) => {
  const text = resourceToText(resource);
  const docTitle = `[Resource] ${resource.title}`;

  // ======================================
  // CHECK FOR EXISTING DOCUMENT
  // ======================================

  const existingDoc = await prisma.document.findFirst({
    where: { title: docTitle },
    select: { id: true },
  });

  if (existingDoc) {
    // Remove old chunks to re-ingest fresh content
    await prisma.documentChunk.deleteMany({
      where: { documentId: existingDoc.id },
    });
    await prisma.document.delete({
      where: { id: existingDoc.id },
    });
    console.log(`  Re-ingesting: "${docTitle}"`);
  }

  // ======================================
  // CHUNK TEXT
  // ======================================

  const chunks = chunkText(text, 500, 100);

  if (!chunks || chunks.length === 0) {
    throw new Error("No chunks produced.");
  }

  // ======================================
  // CREATE EMBEDDINGS
  // ======================================

  const embeddings = await createEmbeddings(chunks);

  if (embeddings.length !== chunks.length) {
    throw new Error("Embedding count mismatch.");
  }

  // ======================================
  // CREATE DOCUMENT
  // ======================================

  const document = await prisma.document.create({
    data: {
      title: docTitle,
      source: resource.source || null,
      description: resource.shortDescription,
    },
  });

  // ======================================
  // SAVE CHUNKS + VECTORS
  // ======================================

  for (let i = 0; i < chunks.length; i++) {
    const chunk = await prisma.documentChunk.create({
      data: {
        documentId: document.id,
        content: chunks[i],
        chunkIndex: i,
      },
    });

    const vectorString = embeddingToVectorString(embeddings[i]);

    await prisma.$executeRawUnsafe(
      'UPDATE "DocumentChunk" SET "embedding" = $1::vector WHERE "id" = $2',
      vectorString,
      chunk.id
    );
  }

  return {
    documentId: document.id,
    chunksCreated: chunks.length,
  };
};

// ========================================
// MAIN
// ========================================

const ingestAllResources = async () => {
  try {
    console.log("");
    console.log("========================================");
    console.log("INGESTING RESOURCES INTO RAG PIPELINE");
    console.log("========================================");
    console.log("");

    const resources = await prisma.resource.findMany({
      orderBy: { id: "asc" },
    });

    if (resources.length === 0) {
      console.log("No resources found. Run seedResources.js first.");
      return;
    }

    console.log(`Found ${resources.length} resources to ingest.`);
    console.log("");

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];

      console.log("----------------------------------------");
      console.log(
        `[${i + 1}/${resources.length}] ${resource.title}`
      );
      console.log(`  Category: ${resource.category}`);

      try {
        const result = await ingestResource(resource);
        console.log(
          `  Chunks: ${result.chunksCreated} | Document ID: ${result.documentId}`
        );
        successCount++;
      } catch (err) {
        console.error(`  ERROR: ${err.message}`);
        errorCount++;
      }

      console.log("");
    }

    console.log("========================================");
    console.log(
      `COMPLETE: ${successCount} ingested, ${errorCount} failed.`
    );
    console.log("========================================");
    console.log("");

  } catch (error) {
    console.error("Ingestion error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

ingestAllResources();
