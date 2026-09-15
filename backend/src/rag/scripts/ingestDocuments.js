const path = require("path");

const {
ingestDocuments
} = require("../services/documentIngestionService");

// ========================================
// DOCUMENT PATH
// ========================================

const documentsPath = path.join(
__dirname,
"..",
"documents"
);

// ========================================
// DOCUMENTS
// ========================================

const documents = [
{
filePath: path.join(
documentsPath,
"mental_health_basics.txt"
),
title: "Mental Health Basics",
source: "MindCare Knowledge Base",
description:
"Basic information about mental health, stress, anxiety, depression, self-care, professional support, and crisis situations."
},
{
filePath: path.join(
documentsPath,
"general_health_basics.txt"
),
title: "General Health Basics",
source: "MindCare Knowledge Base",
description:
"General health information covering symptoms, prevention, infectious diseases, malaria, schistosomiasis, diabetes, hypertension, UTI, tuberculosis, medication safety, medical tests, and healthy lifestyle."
}
];

// ========================================
// RUN
// ========================================

async function run() {
try {
console.log("");
console.log("========================================");
console.log("MINDCARE DOCUMENT INGESTION");
console.log("========================================");
console.log("");

console.log(
  "Documents found: " + documents.length
);

console.log("");

const result = await ingestDocuments(
  documents
);

if (!result.success) {
  console.error(
    "Document ingestion failed:"
  );

  console.error(
    result.error
  );

  return;
}

console.log("");
console.log("========================================");
console.log("INGESTION COMPLETED");
console.log("========================================");
console.log("");

for (
  let i = 0;
  i < result.results.length;
  i++
) {
  const item =
    result.results[i];

  console.log(
    "Document " + (i + 1)
  );

  if (item.success) {
    console.log(
      "Status: SUCCESS"
    );

    console.log(
      "ID: " + item.document.id
    );

    console.log(
      "Title: " + item.document.title
    );

    console.log(
      "Chunks: " + item.chunksCreated
    );
  } else {
    console.log(
      "Status: FAILED"
    );

    console.log(
      "Error: " + item.error
    );
  }

  console.log("");
}

console.log(
  "All ingestion tasks finished."
);

} catch (error) {
console.error("");
console.error(
"Unexpected ingestion error:"
);

console.error(
  error
);

}
}

// ========================================
// START
// ========================================

run();
