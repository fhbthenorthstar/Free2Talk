import Image from "next/image";
import { redirect } from "next/navigation";

import ConversationAgent from "@/components/ConversationAgent";

import {
  getFeedbackByConversationId,
  getConversationById,
} from "@/lib/actions/conversation.actions";
import { getCurrentUser } from "@/lib/actions/auth.action";

const ConversationDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const conversation = await getConversationById(id);
  if (!conversation) redirect("/");

  const feedback = await getFeedbackByConversationId({
    conversationId: id,
    userId: user?.id!,
  });

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src="/conversation-logo.png"
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{conversation.topic} Session</h3>
          </div>
          <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
            {conversation.focus}
          </p>
        </div>

        <p className="bg-indigo-500 px-4 py-2 rounded-lg h-fit capitalize">
          <strong>{conversation.difficulty}</strong>
        </p>
      </div>

      <ConversationAgent
        userName={user?.name!}
        userId={user?.id}
        conversationId={id}
        type="conversation"
        starters={conversation.starters}
        topic={conversation.topic}
        difficulty={conversation.difficulty}
        context={conversation.context}
        focus={conversation.focus}
        feedbackId={feedback?.id}
      />
    </>
  );
};

export default ConversationDetails;
