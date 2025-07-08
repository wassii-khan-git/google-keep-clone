"use client";

import * as React from "react";
import { Bot, GitFork, LayoutDashboard, LucideNotepadText } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { LogoHeader } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import TooltipButton from "./ui/custom-tooltip";

// This is sample data.
const data = {
  logoInfo: [
    {
      name: "Notes",
      logo: LucideNotepadText,
      plan: "keep notes",
    },
  ],
  navMain: [
    {
      title: "Notes",
      url: "/dashboard/notes",
      icon: LayoutDashboard,
      isActive: true,
      isDropdown: false,
    },
    {
      title: "Archives",
      url: "/dashboard/archives",
      icon: Bot,
      isDropdown: false,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-gray-200 pb-4">
        <LogoHeader teams={data.logoInfo} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="text-center">
        {state === "collapsed" ? (
          <TooltipButton
            icon={<GitFork className="text-gray-500" />}
            tooltipText="All Rights Reserved"
            isClickable={false}
          />
        ) : (
          "All Rights Reserved"
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
