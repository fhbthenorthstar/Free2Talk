import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import LogOut from "@/components/LogOut";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  const user = await getCurrentUser();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between py-2 shadow">
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
        {/* @ts-ignore */}
        <LogOut userName={user?.name} />
      </nav>

      {children}
    </div>
  );
};

export default Layout;
