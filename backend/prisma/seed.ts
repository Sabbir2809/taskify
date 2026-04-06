import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Define users to seed
const usersToSeed = [
  {
    name: "Admin User",
    email: "admin@taskify.com",
    password: "admin123",
    role: Role.ADMIN,
  },
  {
    name: "Regular User",
    email: "user@taskify.com",
    password: "user123",
    role: Role.USER,
  },
  {
    name: "Test User",
    email: "test@taskify.com",
    password: "test123",
    role: Role.USER,
  },
];

async function seedInitialUsers() {
  try {
    for (const userData of usersToSeed) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Upsert user
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role,
        },
      });

      console.log(`Seeded user: ${user.name} (${user.email})`);
    }

    console.log("✅ All users seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedInitialUsers();
