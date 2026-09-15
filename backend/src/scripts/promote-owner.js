require("dotenv").config();
const prisma = require("../config/database");

const email = process.argv[2];
if (!email) {
  console.error("Usage: node src/scripts/promote-owner.js owner@example.com");
  process.exitCode = 1;
} else {
  prisma.user.update({ where: { email: email.toLowerCase() }, data: { role: "OWNER", isActive: true }, select: { id: true, email: true, role: true } })
    .then((user) => console.log(`Promoted ${user.email} to ${user.role}.`))
    .catch((error) => { console.error("Owner promotion failed:", error.message); process.exitCode = 1; })
    .finally(() => prisma.$disconnect());
}
