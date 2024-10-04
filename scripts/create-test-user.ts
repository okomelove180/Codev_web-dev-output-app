//test用のユーザーを作成するスクリプト

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "test@example.com";
  const password = "testpassword123";
  const name = "Test User";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email,
      name: name,
      password: hashedPassword,
    },
  });

  console.log(`User created/updated: ${user.email}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
