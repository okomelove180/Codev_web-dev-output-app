"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

function UserDropdown({ session, handleSignOut }) {
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

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  // ログイン状態を確認するためのフラグ
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (!mounted) {
    return <NavigationSkeleton />;
  }

  if (status === "loading") {
    return <NavigationSkeleton />;
  }

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
          {session?.user?.name ? (
            <>
              <span className="mr-2 text-sm font-medium hidden sm:inline-block">
                {session.user.name} さんがログイン中
              </span>
              <UserDropdown session={session} handleSignOut={handleSignOut} />
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
