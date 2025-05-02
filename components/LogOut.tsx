"use client";
import { signOut } from "@/lib/actions/auth.action";

const LogOut = ({ userName }: { userName: string }) => {
  return (
    <div className="flex items-center gap-4">
      <strong>Hi, {userName}</strong>{" "}
      <button
        className="text-red-800 hover:underline"
        onClick={async () => {
          await signOut();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default LogOut;
