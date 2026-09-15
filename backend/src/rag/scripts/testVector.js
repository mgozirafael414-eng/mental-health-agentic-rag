const prisma = require("../../config/database");

// ========================================
// TEST PGVECTOR
// ========================================

const testVector = async () => {
try {
console.log(
"\n========================================"
);

```
console.log(
  "MINCARE PGVECTOR TEST"
);

console.log(
  "========================================\n"
);

// ========================================
// CHECK VECTOR EXTENSION
// ========================================

const extension =
  await prisma.$queryRaw`
    SELECT
      extname,
      extversion
    FROM pg_extension
    WHERE extname = 'vector';
  `;

console.log(
  "Vector extension:"
);

console.log(
  extension
);

if (
  !extension ||
  extension.length === 0
) {
  throw new Error(
    "PostgreSQL vector extension was not found."
  );
}

// ========================================
// CHECK DOCUMENT TABLE
// ========================================

const documentCount =
  await prisma.document.count();

console.log(
  `\nExisting documents: ${documentCount}`
);

// ========================================
// CHECK DOCUMENT CHUNK TABLE
// ========================================

const chunkCount =
  await prisma.documentChunk.count();

console.log(
  `Existing chunks: ${chunkCount}`
);

// ========================================
// CHECK VECTOR COLUMN
// ========================================

const vectorColumn =
  await prisma.$queryRaw`
    SELECT
      column_name,
      data_type,
      udt_name
    FROM information_schema.columns
    WHERE table_name = 'DocumentChunk'
      AND column_name = 'embedding';
  `;

console.log(
  "\nEmbedding column:"
);

console.log(
  vectorColumn
);

if (
  !vectorColumn ||
  vectorColumn.length === 0
) {
  throw new Error(
    "DocumentChunk.embedding column was not found."
  );
}

// ========================================
// SUCCESS
// ========================================

console.log(
  "\n========================================"
);

console.log(
  "PGVECTOR TEST PASSED"
);

console.log(
  "========================================\n"
);
```

} catch (error) {

```
console.error(
  "\n========================================"
);

console.error(
  "PGVECTOR TEST FAILED"
);

console.error(
  "========================================"
);

console.error(
  error.message
);

process.exitCode = 1;
```

} finally {

```
await prisma.$disconnect();
```

}
};

// ========================================
// START TEST
// ========================================

testVector();
