/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { useState } from "react";

const NavLinks = ({ className }: { className?: string }) => (
  <ul className={`flex ${className}`}>
    <li>
      <Link
        href="/dashboard"
        className="text-foreground hover:text-foreground/80"
      >
        Dashboard
      </Link>
    </li>
    <li>
      <Link
        href="/assessments"
        className="text-foreground hover:text-foreground/80"
      >
        Assessments
      </Link>
    </li>
    <li>
      <Link
        href="/profile"
        className="text-foreground hover:text-foreground/80"
      >
        Profile
      </Link>
    </li>
  </ul>
);

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-4">Logo</div>
            <nav className="hidden md:block">
              <NavLinks className="space-x-4" />
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src="/avatars/01.png" alt="@username" /> */}
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              className="ml-2 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <NavLinks className="flex-col space-y-2" />
          </nav>
        )}
      </div>
    </header>
  );
}
