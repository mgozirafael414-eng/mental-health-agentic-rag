const path = require("path");

const {
  loadDocument,
  chunkText
} = require("../utils/chunker");

const {
  createEmbeddings
} = require("./embeddingService");


// ========================================
// LOAD DOCUMENT
// ========================================

const documentPath = path.join(
  __dirname,
  "..",
  "documents",
  "mental_health_basics.txt"
);

const documentText = loadDocument(documentPath);


// ========================================
// CREATE CHUNKS
// ========================================

const chunks = chunkText(
  documentText,
  100,
  20
);


// ========================================
// TEST EMBEDDINGS
// ========================================

const runTest = async () => {
  try {
    console.log("========================================");
    console.log("EMBEDDING TEST");
    console.log("========================================");

    console.log("Total chunks:", chunks.length);

    const embeddings = await createEmbeddings(chunks);

    console.log("\n========================================");
    console.log("EMBEDDING RESULTS");
    console.log("========================================");

    console.log(
      "Total embeddings:",
      embeddings.length
    );

    console.log(
      "Vector dimensions:",
      embeddings[0].length
    );

    console.log(
      "First 10 values of first vector:",
      embeddings[0].slice(0, 10)
    );

    console.log("\nEmbedding test completed successfully.");

  } catch (error) {
    console.error("\nEmbedding test failed:");
    console.error(error);
  }
};


runTest();