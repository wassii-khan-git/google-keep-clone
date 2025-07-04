"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

import Link from "next/link";

export function LogoHeader({}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Logo */}
              <Link
                href="/dashboard/notes"
                className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity duration-200"
              >
                <div className="flex-shrink-0">
                  <Image
                    src="/icon.png"
                    width={100}
                    height={100}
                    alt="Keep Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10"
                    priority
                  />
                </div>
                <span className=" sm:block text-xl font-normal text-gray-600 truncate">
                  Keep
                </span>
              </Link>
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
