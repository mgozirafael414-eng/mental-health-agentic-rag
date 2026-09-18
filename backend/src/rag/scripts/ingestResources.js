require("dotenv").config();

const prisma = require("../../config/database");

const { ingestResource } = require("../services/resourceIngestionService");

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
