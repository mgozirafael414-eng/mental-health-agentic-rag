const {
  retrieveRelevantChunks
} = require("../services/retrievalService");

// ========================================
// TEST RAG RETRIEVAL
// ========================================

const run = async () => {
  try {
    console.log("");
    console.log("========================================");
    console.log("MINDCARE RAG RETRIEVAL TEST");
    console.log("========================================");
    console.log("");

    const query =
      "What is stress and how can I manage it?";

    const results =
      await retrieveRelevantChunks(
        query,
        3
      );

    console.log("");
    console.log("========================================");
    console.log("RETRIEVED KNOWLEDGE");
    console.log("========================================");
    console.log("");

    if (
      !results ||
      results.length === 0
    ) {
      console.log(
        "No relevant information found."
      );

      return;
    }

    for (
      let i = 0;
      i < results.length;
      i++
    ) {
      console.log(
        "----------------------------------------"
      );

      console.log(
        "Result " + (i + 1)
      );

      console.log(
        "Document: " +
        results[i].title
      );

      console.log(
        "Similarity: " +
        Number(
          results[i].similarity
        ).toFixed(4)
      );

      console.log("");

      console.log(
        results[i].content
      );

      console.log("");
    }

    console.log(
      "========================================"
    );

    console.log(
      "RAG RETRIEVAL TEST COMPLETED"
    );

    console.log(
      "========================================"
    );

  } catch (error) {
    console.error("");
    console.error(
      "RAG retrieval test failed:"
    );

    console.error(
      error.message
    );

    process.exitCode = 1;
  }
};

run();