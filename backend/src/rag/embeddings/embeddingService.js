// ========================================
// EMBEDDING SERVICE
// ========================================

let extractor = null;

// ========================================
// LOAD EMBEDDING MODEL
// ========================================

const getExtractor = async () => {
  if (!extractor) {
    const { pipeline } = await import("@huggingface/transformers");

    console.log("Loading embedding model...");

    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    console.log("Embedding model loaded successfully.");
  }

  return extractor;
};


// ========================================
// CREATE EMBEDDING
// ========================================

const createEmbedding = async (text) => {
  try {
    if (!text || !text.trim()) {
      throw new Error("Text is required for embedding.");
    }

    const model = await getExtractor();

    const output = await model(
      text,
      {
        pooling: "mean",
        normalize: true
      }
    );

    return Array.from(output.data);

  } catch (error) {
    console.error("Embedding creation error:", error);

    throw error;
  }
};


// ========================================
// CREATE EMBEDDINGS FOR MULTIPLE CHUNKS
// ========================================

const createEmbeddings = async (chunks) => {
  try {
    if (!Array.isArray(chunks) || chunks.length === 0) {
      throw new Error("Chunks array is required.");
    }

    const embeddings = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(
        `Creating embedding ${i + 1}/${chunks.length}...`
      );

      const embedding = await createEmbedding(chunks[i]);

      embeddings.push(embedding);
    }

    console.log(
      `Successfully created ${embeddings.length} embeddings.`
    );

    return embeddings;

  } catch (error) {
    console.error("Multiple embeddings error:", error);

    throw error;
  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
  createEmbedding,
  createEmbeddings
};