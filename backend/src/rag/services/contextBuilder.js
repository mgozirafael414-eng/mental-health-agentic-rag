// ========================================
// RAG CONTEXT BUILDER
// ========================================

// ========================================
// BUILD CONTEXT FROM RETRIEVED CHUNKS
// ========================================

const buildRAGContext = (
  chunks = []
) => {
  if (
    !Array.isArray(chunks) ||
    chunks.length === 0
  ) {
    return "";
  }

  const contextParts = [];

  for (
    let i = 0;
    i < chunks.length;
    i++
  ) {
    const chunk = chunks[i];

    const title =
      chunk.title ||
      "Unknown Source";

    const source =
      chunk.source ||
      "MindCare Knowledge Base";

    const content =
      chunk.content ||
      "";

    if (!content.trim()) {
      continue;
    }

    contextParts.push(
      "[Source " +
        (i + 1) +
        "]\n" +
        "Document: " +
        title +
        "\n" +
        "Source: " +
        source +
        "\n" +
        "Similarity: " +
        Number(
          chunk.similarity || 0
        ).toFixed(4) +
        "\n\n" +
        content.trim()
    );
  }

  return contextParts.join(
    "\n\n----------------------------------------\n\n"
  );
};

// ========================================
// BUILD RAG PROMPT CONTEXT
// ========================================

const buildRAGPrompt = (
  userQuestion,
  chunks = []
) => {
  const context =
    buildRAGContext(chunks);

  if (!context) {
    return (
      "No relevant information was found " +
      "in the MindCare knowledge base."
    );
  }

  return (
    "Use the following information from the " +
    "MindCare knowledge base to help answer " +
    "the user's question.\n\n" +

    "IMPORTANT:\n" +
    "- Use the retrieved information when relevant.\n" +
    "- Do not invent facts that are not supported by the context.\n" +
    "- Do not claim that the retrieved information proves a diagnosis.\n" +
    "- If the information is insufficient, say so clearly.\n" +
    "- Provide general health information, not a diagnosis or prescription.\n\n" +

    "USER QUESTION:\n" +
    userQuestion.trim() +
    "\n\n" +

    "RETRIEVED KNOWLEDGE:\n" +
    context
  );
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  buildRAGContext,
  buildRAGPrompt
};