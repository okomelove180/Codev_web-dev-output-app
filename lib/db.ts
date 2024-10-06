import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveOutput(
  originalContent: string,
  correctedContent: string,
  analysis: string,
  officialDocs: Array<{ siteName: string; url: string; summary: string }>,
  userId: string
) {
  try {
    console.log("Saving output with data:", {
      originalContent,
      correctedContent,
      analysis,
      officialDocs,
      userId,
    });
    const output = await prisma.output.create({
      data: {
        originalContent,
        correctedContent,
        analysis,
        officialDocs:{create: officialDocs},
        user: {
        connect: {id: userId}
        },
      },
      include: {officialDocs: true}
    });
    console.log("Output saved successfully:", output);
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
    return prisma.output.findUnique({
      where: { id },
      include: { officialDocs: true }
    });
  } catch (error) {
    console.error("Error fetching output:", error);
    throw error;
  }
}
