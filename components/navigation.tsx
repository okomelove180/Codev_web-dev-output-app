"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";

function NavigationSkeleton() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="w-1/3 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
    </header>
  );
}

function UserDropdown({ session, handleSignOut }: { session: any, handleSignOut: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar>
          <AvatarImage src="/avatar.png" alt={session?.user?.name || "User"} />
          <AvatarFallback>
            {session?.user?.name ? session.user.name[0].toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href="/profile" className="w-full">
            プロフィール
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navigation({ serverSession }: { serverSession: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("Session status changed:", status, "Session:", session || serverSession);
  }, [status, session, serverSession]);

  if (!mounted) {
    return <NavigationSkeleton />;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const currentSession = session || serverSession;

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" passHref legacyBehavior>
                <NavigationMenuLink active={pathname === "/"}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/outputs/new" passHref legacyBehavior>
                <NavigationMenuLink active={pathname.startsWith("/outputs/new")}>
                  New Output
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/outputs" passHref legacyBehavior>
                <NavigationMenuLink active={pathname.startsWith("/outputs")}>
                  Outputs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center">
          {currentSession?.user?.name ? (
            <>
              <span className="mr-2 text-sm font-medium hidden sm:inline-block">
                {currentSession.user.name} さんがログイン中
              </span>
              <UserDropdown session={currentSession} handleSignOut={handleSignOut} />
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium">
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
