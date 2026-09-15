const fs = require("fs");
const path = require("path");

// ========================================
// TEXT CHUNKER
// ========================================

const chunkText = (text, chunkSize = 500, overlap = 100) => {
  if (!text || !text.trim()) {
    return [];
  }

  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const words = cleanedText.split(/\s+/);

  const chunks = [];

  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);

    const chunk = words
      .slice(start, end)
      .join(" ")
      .trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end === words.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
};


// ========================================
// LOAD DOCUMENT
// ========================================

const loadDocument = (filePath) => {
  try {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Document not found: ${absolutePath}`);
    }

    return fs.readFileSync(absolutePath, "utf8");

  } catch (error) {
    console.error("Document loading error:", error);
    throw error;
  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
  chunkText,
  loadDocument
};