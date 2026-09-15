require("dotenv").config({ quiet: true });
const bcrypt = require("bcryptjs");
const prisma = require("../config/database");

const email = process.argv[2]?.trim().toLowerCase();
const password = process.argv[3];
const protectedOwnerEmail = "rafael@example.com";

if (!email || !password) {
  console.error("Usage: node src/scripts/reset-development-password.js existing-user@example.com password");
  process.exitCode = 1;
} else if (email === protectedOwnerEmail) {
  console.error("Refusing to modify the protected Owner account.");
  process.exitCode = 1;
} else if (password.length < 6) {
  console.error("Development password must be at least 6 characters.");
  process.exitCode = 1;
} else {
  prisma.user.findUnique({ where: { email }, select: { id: true, role: true } })
    .then(async (user) => {
      if (!user) throw new Error("No existing user was found for that email.");
      const passwordHash = await bcrypt.hash(password, 12);
      return prisma.user.update({
        where: { id: user.id },
        data: { password: passwordHash, role: "ADMIN", isActive: true },
        select: { id: true, email: true, role: true, isActive: true },
      });
    })
    .then((user) => console.log(JSON.stringify(user)))
    .catch((error) => {
      console.error("Development password reset failed:", error.message);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
