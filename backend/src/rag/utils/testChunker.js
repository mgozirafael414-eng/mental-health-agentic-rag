const path = require("path");

const {
  chunkText,
  loadDocument
} = require("./chunker");

const documentPath = path.join(
  __dirname,
  "..",
  "documents",
  "mental_health_basics.txt"
);

const documentText = loadDocument(documentPath);

const chunks = chunkText(
  documentText,
  100,
  20
);

console.log("========================================");
console.log("RAG TEXT CHUNKING TEST");
console.log("========================================");

console.log("Total characters:", documentText.length);
console.log("Total chunks:", chunks.length);

chunks.forEach((chunk, index) => {
  console.log("\n----------------------------------------");
  console.log(`CHUNK ${index + 1}`);
  console.log("----------------------------------------");
  console.log(chunk);
});