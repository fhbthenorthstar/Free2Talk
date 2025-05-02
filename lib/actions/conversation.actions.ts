"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { conversationId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an English language tutor analyzing a practice conversation. Evaluate the learner's performance with a focus on language skills. Be constructive but encouraging.

        Transcript:
        ${formattedTranscript}

        Score the learner from 0 to 100 in these areas:
        - **Vocabulary**: Range and appropriate word choice
        - **Grammar**: Sentence structure and verb tense accuracy
        - **Pronunciation**: Clarity and correct sounds
        - **Fluency**: Smoothness and pace of speech
        - **Confidence**: Willingness to communicate

        Special considerations:
        1. Account for the learner's self-reported level (beginner/intermediate)
        2. Focus on communication over perfection
        3. Highlight 1-2 immediate improvements
        `,
      system: "You are a patient English tutor providing constructive feedback",
    });

    const feedback = {
      conversationId,
      userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    const feedbackRef = feedbackId
      ? db.collection("feedback").doc(feedbackId)
      : db.collection("feedback").doc();

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getConversationById(
  id: string
): Promise<Conversation | null> {
  const conversation = await db.collection("conversations").doc(id).get();

  return conversation.data() as Conversation | null;
}

export async function getFeedbackByConversationId(
  params: GetFeedbackByConversationIdParams
): Promise<Feedback | null> {
  const { conversationId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("conversationId", "==", conversationId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestConversations(
  params: GetLatestConversationsParams
): Promise<Conversation[] | null> {
  const { userId, limit = 20 } = params;

  const conversations = await db
    .collection("conversations")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return conversations.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Conversation[];
}

export async function getConversationsByUserId(
  userId: string
): Promise<Conversation[] | null> {
  const conversations = await db
    .collection("conversations")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return conversations.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Conversation[];
}
