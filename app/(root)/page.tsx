import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getConversationsByUserId,
  getLatestConversations,
} from "@/lib/actions/conversation.actions";
import ConversationCard from "@/components/ConversationCard";

async function Home() {
  const user = await getCurrentUser();

  const [userConversations, allConversation] = await Promise.all([
    getConversationsByUserId(user?.id!),
    getLatestConversations({ userId: user?.id! }),
  ]);

  const hasPastConversations = userConversations?.length! > 0;
  const hasUpcomingConversation = allConversation?.length! > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>
            Speak English Better <br />
            Free Practice & Feedback Sessions With AI Without Any Judgement.
          </h2>
          <p className="text-lg">Talk about your everyday topics</p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/conversation">Create Practise Sessions</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Practice Sessions</h2>
        <div className="interviews-section">
          {hasPastConversations ? (
            userConversations?.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                userId={user?.id}
                conversationId={conversation.id}
                topic={conversation.topic}
                difficulty={conversation.difficulty}
                context={conversation.context}
                starters={conversation.starters}
                createdAt={conversation.createdAt}
              />
            ))
          ) : (
            <p>Get started now. You haven't generated any practice session.</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h3>Others Sessions You Can Take</h3>

        <div className="interviews-section">
          {hasUpcomingConversation ? (
            allConversation?.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                userId={user?.id}
                conversationId={conversation.id}
                topic={conversation.topic}
                difficulty={conversation.difficulty}
                context={conversation.context}
                starters={conversation.starters}
                createdAt={conversation.createdAt}
              />
            ))
          ) : (
            <p>There are no practice session available at this moment</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
