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

export async function getOutputs(userId: string) {
  try {
    const outputs = await prisma.output.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return outputs;
  } catch (error) {
    console.error("Error fetching outputs:", error);
    throw error;
  }
}

export async function getOutputById(id: string) {
  try {
    const output = await prisma.output.findUnique({
      where: {
        id,
      },
    });
    return output;
  } catch (error) {
    console.error("Error fetching output:", error);
    throw error;
  }
}
