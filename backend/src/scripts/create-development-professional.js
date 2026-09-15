require("dotenv").config({ quiet: true });
const bcrypt = require("bcryptjs");
const prisma = require("../config/database");

const email = process.argv[2]?.trim().toLowerCase();
const password = process.argv[3];
const name = process.argv[4]?.trim() || "MindCare Professional Test";
const protectedOwnerEmail = "rafael@example.com";

if (!email || !password) {
  console.error("Usage: node src/scripts/create-development-professional.js professional@example.com password [name]");
  process.exitCode = 1;
} else if (email === protectedOwnerEmail) {
  console.error("Refusing to modify the protected Owner account.");
  process.exitCode = 1;
} else if (password.length < 6) {
  console.error("Development password must be at least 6 characters.");
  process.exitCode = 1;
} else {
  prisma.user.findUnique({ where: { email }, select: { id: true } })
    .then(async (existing) => {
      const passwordHash = await bcrypt.hash(password, 12);
      const data = { name, password: passwordHash, role: "PROFESSIONAL", isActive: true };
      if (existing) return prisma.user.update({ where: { id: existing.id }, data, select: { id: true, email: true, role: true, isActive: true } });
      return prisma.user.create({ data: { email, ...data }, select: { id: true, email: true, role: true, isActive: true } });
    })
    .then((user) => console.log(JSON.stringify(user)))
    .catch((error) => { console.error("Professional setup failed:", error.message); process.exitCode = 1; })
    .finally(() => prisma.$disconnect());
}
