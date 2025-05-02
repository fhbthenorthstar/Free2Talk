import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
  const { topic, difficulty, context, focus, amount, userid, username } =
    await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemma-3-27b-it"),
      prompt: `
      Prepare questions for an English conversation session.
      The topic is: ${topic}.
      The user's English level is: ${difficulty}.
      The context for this session is: ${context}.
      The focus area is: ${focus}.
      The number of questions required is: ${amount}.
      The user's name is: ${username}.

      Please return only the questions, without any additional text.
      The questions are going to be read by a voice assistant, so do not use "/", "*" or any other special characters which might break the voice assistant.
      Keep the language clear, simple, and friendly — but not overly basic. Use natural vocabulary between A2 and B2 level.
      Make the questions open-ended to encourage thoughtful speaking, and occasionally use the user's name (${username}) in 1 or 2 questions.

      Return the questions formatted like this:
      ["Question 1", "Question 2", "Question 3"]

      Thank you! <3
      
      `,
    });

    console.log(questions);

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

    console.log(conversation);

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
