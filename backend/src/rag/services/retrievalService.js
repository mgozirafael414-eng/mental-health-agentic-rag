const prisma = require("../../config/database");

const {
  createEmbedding
} = require("../embeddings/embeddingService");

// ========================================
// RAG RETRIEVAL SERVICE
// ========================================

// ========================================
// CONVERT ARRAY TO VECTOR STRING
// ========================================

const embeddingToVectorString = (embedding) => {
  if (
    !Array.isArray(embedding) ||
    embedding.length === 0
  ) {
    throw new Error("Invalid embedding.");
  }

  return "[" + embedding.join(",") + "]";
};

// ========================================
// SEARCH RELEVANT DOCUMENT CHUNKS
// ========================================

const retrieveRelevantChunks = async (
  query,
  limit = 5
) => {
  try {
    if (!query || !query.trim()) {
      throw new Error(
        "Search query is required."
      );
    }

    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      "RAG RETRIEVAL"
    );
    console.log(
      "========================================"
    );

    console.log(
      "Query: " + query
    );

    // ========================================
    // CREATE QUERY EMBEDDING
    // ========================================

    console.log(
      "Creating query embedding..."
    );

    const embedding =
      await createEmbedding(
        query.trim()
      );

    console.log(
      "Query embedding created."
    );

    // ========================================
    // CONVERT EMBEDDING TO VECTOR
    // ========================================

    const vectorString =
      embeddingToVectorString(
        embedding
      );

    // ========================================
    // VECTOR SIMILARITY SEARCH
    // ========================================

    console.log(
      "Searching knowledge base..."
    );

    const chunks =
      await prisma.$queryRawUnsafe(
        `
        SELECT
          dc.id,
          dc."documentId",
          dc.content,
          dc."chunkIndex",
          d.title,
          d.source,
          1 - (dc.embedding <=> $1::vector) AS similarity
        FROM "DocumentChunk" dc
        INNER JOIN "Document" d
          ON d.id = dc."documentId"
        WHERE dc.embedding IS NOT NULL
        ORDER BY dc.embedding <=> $1::vector
        LIMIT $2
        `,
        vectorString,
        limit
      );

    console.log(
      "Relevant chunks found: " +
      chunks.length
    );

    // ========================================
    // DISPLAY RESULTS
    // ========================================

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {
      console.log("");

      console.log(
        "Result " + (i + 1)
      );

      console.log(
        "Document: " +
        chunks[i].title
      );

      console.log(
        "Similarity: " +
        Number(
          chunks[i].similarity
        ).toFixed(4)
      );
    }

    console.log("");

    return chunks;

  } catch (error) {
    console.error(
      "RAG retrieval error:",
      error
    );

    throw error;
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  retrieveRelevantChunks
};