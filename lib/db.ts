import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveOutput(content: string, userId: string) {
  try {
    const output = await prisma.output.create({
      data: {
        content,
        userId,
      },
    });
    return output;
  } catch (error) {
    console.error("Error saving output:", error);
    throw error;
  }
}
