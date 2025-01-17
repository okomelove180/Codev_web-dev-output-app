import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


const prisma = new PrismaClient();

export async function saveOutput(
  title: string,
  originalContent: string,
  correctedContent: string,
  analysis: string,
  relatedLinks: Array<{
    siteName: string;
    url: string;
    summary: string;
    likes_count: number;
    isOfficial: boolean;
  }>,
  userId: string,
  language: string
) {
  try {
    const output = await prisma.output.create({
      data: {
        title,
        originalContent,
        correctedContent,
        analysis,
        relatedLinks: {
          create: relatedLinks.map((link) => ({
            siteName: link.siteName,
            url: link.url,
            summary: link.summary,
            likes_count: link.likes_count, // undefined の場合は Prisma が null として扱います
            isOfficial: link.isOfficial,
          })),
        },
        userId: userId,
        language: language,
      },
      include: {
        relatedLinks: true,
      },
    });
    return output;
  } catch (error) {
    console.error("Error saving output:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new Error(`User with ID ${userId} not found`);
      }
    }
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
