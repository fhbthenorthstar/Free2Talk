import ConversationAgent from "@/components/ConversationAgent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { type } from "os";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3 className="text-center">Generate Your Conversation Topic</h3>

      <ConversationAgent
        userName={user?.name!}
        userId={user?.id}
        profileImage={user?.profileURL}
        type="generate"
      />
    </>
  );
};

export default Page;
