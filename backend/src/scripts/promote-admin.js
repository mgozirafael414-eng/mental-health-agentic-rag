require("dotenv").config({ quiet: true });
const prisma = require("../config/database");

const email = process.argv[2]?.trim().toLowerCase();
const protectedOwnerEmail = "rafael@example.com";

if (!email) {
  console.error("Usage: node src/scripts/promote-admin.js existing-user@example.com");
  process.exitCode = 1;
} else if (email === protectedOwnerEmail) {
  console.error("Refusing to modify the protected Owner account.");
  process.exitCode = 1;
} else {
  prisma.user.findUnique({ where: { email }, select: { id: true, email: true, role: true } })
    .then((user) => {
      if (!user) throw new Error("No existing user was found for that email.");
      return prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN", isActive: true },
        select: { id: true, email: true, role: true, isActive: true },
      });
    })
    .then((user) => console.log(JSON.stringify(user)))
    .catch((error) => {
      console.error("Admin promotion failed:", error.message);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
