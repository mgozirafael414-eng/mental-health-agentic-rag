const {
  retrieveRelevantChunks
} = require("../services/retrievalService");

const {
  buildRAGContext,
  buildRAGPrompt
} = require("../services/contextBuilder");

const prisma = require("../../config/database");

// ========================================
// TEST RAG CONTEXT BUILDER
// ========================================

const run = async () => {
  try {
    console.log("");
    console.log("========================================");
    console.log("MINDCARE RAG CONTEXT BUILDER TEST");
    console.log("========================================");
    console.log("");

    const userQuestion =
      "What is stress and how can I manage it?";

    // ========================================
    // RETRIEVE RELEVANT CHUNKS
    // ========================================

    const results =
      await retrieveRelevantChunks(
        userQuestion,
        3
      );

    // ========================================
    // BUILD CONTEXT
    // ========================================

    console.log("");
    console.log("========================================");
    console.log("BUILDING RAG CONTEXT");
    console.log("========================================");
    console.log("");

    const context =
      buildRAGContext(
        results
      );

    console.log(
      "Context created successfully."
    );

    console.log("");
    console.log("----------------------------------------");
    console.log("RAG CONTEXT");
    console.log("----------------------------------------");
    console.log("");

    console.log(
      context
    );

    // ========================================
    // BUILD FULL RAG PROMPT
    // ========================================

    console.log("");
    console.log("========================================");
    console.log("BUILDING RAG PROMPT");
    console.log("========================================");
    console.log("");

    const prompt =
      buildRAGPrompt(
        userQuestion,
        results
      );

    console.log(
      "RAG prompt created successfully."
    );

    console.log("");
    console.log("----------------------------------------");
    console.log("RAG PROMPT");
    console.log("----------------------------------------");
    console.log("");

    console.log(
      prompt
    );

    // ========================================
    // SUCCESS
    // ========================================

    console.log("");
    console.log("========================================");
    console.log("CONTEXT BUILDER TEST PASSED");
    console.log("========================================");
    console.log("");

  } catch (error) {
    console.error("");
    console.error("========================================");
    console.error("CONTEXT BUILDER TEST FAILED");
    console.error("========================================");
    console.error("");

    console.error(
      error.message
    );

    process.exitCode = 1;

  } finally {
    await prisma.$disconnect();
  }
};

run();