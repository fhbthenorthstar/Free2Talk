import ConversationAgent from "@/components/ConversationAgent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3 className="text-center">Create Your Conversation Session</h3>

      <ConversationAgent
        userName={user?.name!}
        userId={user?.id}
        type="generate"
      />
    </>
  );
};

export default Page;
