import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { content } = await request.json();

    const output = await prisma.output.create({
      data: {
        content,
        userId: session.user.id,
      },
    });

    return NextResponse.json(output);
  } catch (error) {
    console.error("Error saving output:", error);
    return NextResponse.json(
      { error: "Failed to save output" },
      { status: 500 }
    );
  }
}
