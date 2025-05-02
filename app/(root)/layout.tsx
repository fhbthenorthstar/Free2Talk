import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between px-4 py-2 shadow">
        {/* Left side: Logo and name */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-main.png"
            alt="MockMate Logo"
            width={48}
            height={42}
          />
          <h3 className="text-primary">Free2Talk</h3>
        </Link>

        {/* Right side: User name and Logout */}
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Hi, John</span>{" "}
          {/* Replace "John" dynamically */}
          <button className="text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
