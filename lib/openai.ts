import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeOutput(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in web development. Analyze the given text and provide a detailed description of the relevant techniques and concepts in japanese. Please instruct students to also actively use official documents to learn.",
        },
        {
          role: "user",
          content: `Analyze the following web development outputs and provide a detailed description of key concepts and techniques in japanese. Also output reference page links to relevant official documents.：\n\n${content}`,
        },
      ],
      max_tokens: 500,
    });

    return (
      response.choices[0].message.content || "分析結果を生成できませんでした。"
    );
  } catch (error) {
    console.error("Error analyzing output with OpenAI:", error);
    throw new Error("Failed to analyze output");
  }
}
