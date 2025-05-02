import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
  const { topic, difficulty, context, focus, amount, userid } =
    await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Generate very simple English practice questions for beginners from developing countries.
        Topic: ${topic}.
        Difficulty: ${difficulty} (keep vocabulary extremely basic).
        Context: ${context}.
        Focus area: ${focus}.
        Number of questions: ${amount}.

        Important Rules:
        1. Use only simplest English words (A1/A2 level)
        2. Make sentences short (max 5-6 words)
        3. Focus on daily life topics
        4. Avoid any complex cultural references
        5. Use present simple tense mostly
        6. No idioms or phrasal verbs
        7. Format exactly like this example: 
           ["What is your name?", "Do you like tea?", "Where do you live?"]
        8. Absolutely no special characters (/, *, etc.)

        Example outputs for 'food' topic:
        ["What food do you like?", "Do you cook at home?", "What is your favorite fruit?"]
      `,
    });

    const conversation = {
      topic: topic,
      difficulty: difficulty,
      context: context,
      focus: focus,
      starters: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage:
        "https://static-00.iconduck.com/assets.00 conversation-icon-2048x1665-nluydh4b.png",
      createdAt: new Date().toISOString(),
    };

    // const interview = {
    //       role: role,
    //       type: type,
    //       level: level,
    //       techstack: techstack.split(","),
    //       questions: JSON.parse(questions),
    //       userId: userid,
    //       finalized: true,
    //       coverImage: getRandomInterviewCover(),
    //       createdAt: new Date().toISOString(),
    //     };

    await db.collection("conversations").add(conversation);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
