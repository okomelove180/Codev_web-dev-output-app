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
import { Session } from "next-auth";
import { ThemeToggle } from "./theme-toggle";
import { CodevLogo } from "@/components/logo";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// ナビゲーションのスケルトンコンポーネント（変更なし）
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

// ユーザードロップダウンコンポーネント
function UserDropdown({ session, handleSignOut }: { session: Session; handleSignOut: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar>
          <AvatarImage src="/avatar.png" alt={session?.user?.name || "ユーザー"} />
          <AvatarFallback>
            {session?.user?.name ? session.user.name[0].toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild onSelect={() => setIsOpen(false)}>
          <Link href={`/users/${session.user.id}`} className="w-full">
            プロフィール
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {
          setIsOpen(false);
          handleSignOut();
        }}>
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// メインのナビゲーションコンポーネント
export default function Navigation({ serverSession }: { serverSession: Session | undefined }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("セッションステータスが変更されました:", status, "セッション:", session || serverSession);
  }, [status, session, serverSession]);

  if (!mounted) {
    return <NavigationSkeleton />;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const currentSession = session || serverSession;

  // ナビゲーションメニュー項目
  const navItems = [
    { href: "/outputs/new", label: "新規アウトプット", requireAuth: true },
    { href: "/outputs", label: "アウトプット一覧", requireAuth: true }
  ];

  return (
    <header className="border-b">
      <div className="container mx-auto px-2 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <CodevLogo />
          {/* デスクトップ用ナビゲーション */}
          <NavigationMenu className="hidden md:flex ml-4">
            <NavigationMenuList>
              {navItems.map((item) => (
                (currentSession) && (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href} passHref legacyBehavior>
                      <NavigationMenuLink active={pathname.startsWith(item.href)}>
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {currentSession?.user?.name ? (
            <>
              <span className="mr-2 text-sm font-medium hidden lg:inline-block">
                {currentSession.user.name} さんがログイン中
              </span>
              <UserDropdown session={currentSession} handleSignOut={handleSignOut} />
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium">
              ログイン
            </Link>
          )}

          {/* モバイル用メニュー */}
          {currentSession && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">メニュー</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  (!item.requireAuth || currentSession) && (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-lg ${pathname.startsWith(item.href) ? "font-bold" : ""}`}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}