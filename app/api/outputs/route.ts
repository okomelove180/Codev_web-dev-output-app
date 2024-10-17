import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { saveOutput } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  console.log("Session:", session);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Not authenticated or user ID not found" }, { status: 401 });
  }

  const userId = session.user.id;

  console.log("User ID:", userId);  // デバッグ用

  try {
    const {
      title,
      originalContent,
      correctedContent,
      analysis,
      relatedLinks,
      language,
    } = await request.json();

    console.log("Received data:", {
      title,
      originalContent,
      correctedContent,
      analysis,
      relatedLinks,
      language,
    });

    const output = await saveOutput(
      title,
      originalContent,
      correctedContent,
      analysis,
      relatedLinks,
      session.user.id,
      language
    );

    return NextResponse.json(output);
  } catch (error) {
    console.error("Error saving output:", error);
    return NextResponse.json(
      { error: "Failed to save output" },
      { status: 500 }
    );
  }
}
