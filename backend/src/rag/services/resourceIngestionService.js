const prisma = require("../../config/database");
const { chunkText } = require("../utils/chunker");
const { createEmbeddings } = require("../embeddings/embeddingService");

const embeddingToVectorString = (embedding) => {
  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error("Invalid embedding.");
  }
  return `[${embedding.join(",")}]`;
};

const resourceToText = (resource) => {
  const lines = [
    `TITLE: ${resource.title}`,
    `CATEGORY: ${resource.category}`,
    `DESCRIPTION: ${resource.shortDescription}`,
    "",
    resource.content,
    "",
  ];

  if (resource.keyPoints?.length) lines.push("KEY POINTS:", ...resource.keyPoints.map((point) => `- ${point}`), "");
  if (resource.practicalTips?.length) lines.push("PRACTICAL TIPS:", ...resource.practicalTips.map((tip) => `- ${tip}`), "");
  if (resource.warningSigns?.length) lines.push("WARNING SIGNS:", ...resource.warningSigns.map((sign) => `- ${sign}`), "");
  if (resource.whenToSeekHelp) lines.push(`WHEN TO SEEK HELP: ${resource.whenToSeekHelp}`, "");

  return lines.join("\n");
};

const ingestResource = async (resource) => {
  const chunks = chunkText(resourceToText(resource), 500, 100);
  if (!chunks.length) throw new Error("No chunks produced.");

  const embeddings = await createEmbeddings(chunks);
  if (embeddings.length !== chunks.length) throw new Error("Embedding count mismatch.");

  const docTitle = `[Resource] ${resource.title}`;
  const existingDoc = await prisma.document.findFirst({ where: { title: docTitle }, select: { id: true } });
  if (existingDoc) {
    await prisma.documentChunk.deleteMany({ where: { documentId: existingDoc.id } });
    await prisma.document.delete({ where: { id: existingDoc.id } });
  }

  const document = await prisma.document.create({
    data: {
      title: docTitle,
      source: resource.source || null,
      description: resource.shortDescription,
    },
  });

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = await prisma.documentChunk.create({
      data: { documentId: document.id, content: chunks[index], chunkIndex: index },
    });
    await prisma.$executeRawUnsafe(
      'UPDATE "DocumentChunk" SET "embedding" = $1::vector WHERE "id" = $2',
      embeddingToVectorString(embeddings[index]),
      chunk.id,
    );
  }

  return { documentId: document.id, chunksCreated: chunks.length };
};

module.exports = { ingestResource };
