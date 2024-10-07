import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveOutput(
  originalContent: string,
  correctedContent: string,
  analysis: string,
  relatedLinks: Array<{
    siteName: string;
    url: string;
    summary: string;
    isOfficial: boolean;
  }>,
  userId: string
) {
  try {
    console.log("Saving output with data:", {
      originalContent,
      correctedContent,
      analysis,
      relatedLinks,
      userId,
    });

    const output = await prisma.output.create({
      data: {
        originalContent,
        correctedContent,
        analysis,
        user: {
          connect: { id: userId },
        },
        relatedLinks: { create: relatedLinks },
      },
      include: { relatedLinks: true },
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
      include: { relatedLinks: true },
    });
  } catch (error) {
    console.error("Error fetching output:", error);
    throw error;
  }
}
