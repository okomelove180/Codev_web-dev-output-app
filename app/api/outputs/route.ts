import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { saveOutput } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  console.log("Session:", session);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  console.log("user ID:", session.user.id);

  try {
    const {
      originalContent,
      correctedContent,
      analysis,
      relatedLinks,
      language,
    } = await request.json();

    console.log("Received data:", {
      originalContent,
      correctedContent,
      analysis,
      relatedLinks,
      language,
    });

    const output = await saveOutput(
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
