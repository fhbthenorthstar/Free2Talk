import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { getFeedbackByConversationId } from "@/lib/actions/conversation.actions";

const ConversationCard = async ({
  conversationId,
  userId,
  topic,
  difficulty,
  context,
  starters,
  createdAt,
}: ConversationCardProps) => {
  const feedback =
    userId && conversationId
      ? await getFeedbackByConversationId({
          conversationId,
          userId,
        })
      : null;

  const badgeColor =
    {
      beginner: "bg-green-100",
      intermediate: "bg-blue-100",
    }[difficulty] || "bg-gray-100";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-70 mb-4">
      <div className="card-interview">
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg",
              badgeColor
            )}
          >
            <p className="badge-text text-black">{difficulty}</p>
          </div>

          {/* Interview Role */}
          <h3 className="mt-5 capitalize">{topic} Practice</h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" width={22} height={22} alt="star" />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't started this conversation yet. Improve your communication skills now."}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <Button className="btn-primary">
            <Link
              href={
                feedback
                  ? `/conversation/${conversationId}/feedback`
                  : `/conversation/${conversationId}`
              }
            >
              {feedback ? "Check Feedback" : "Start Conversation"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
