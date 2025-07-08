"use client";

import * as React from "react";
import {
  Bot,
  LayoutDashboard,
  LucideNotepadText,
  NotepadTextIcon,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { LogoHeader } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoHeader teams={data.logoInfo} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>All rights reserved</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
