"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { BellOutlined, BulbOutlined } from "@ant-design/icons";
import Image from "next/image";
import { Separator } from "./ui/separator";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Notes",
      url: "/dashboard",
      icon: <BulbOutlined className="text-xl" />,
      isActive: true,
      items: [],
    },
    {
      title: "Reminder",
      url: "/reminder",
      icon: <BellOutlined className="text-xl" />,
      isActive: false,
      items: [],
    },
  ],
};

function SidebarLogo() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="ml-2 h-full flex items-center ">
      {isCollapsed ? (
        <Image
          src="/logo.png"
          width={30}
          height={30}
          alt="Google Keep logo"
          className="shrink-0"
        />
      ) : (
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            width={30}
            height={30}
            alt="Google Keep logo"
            className="shrink-0"
          />
          <div className="flex items-center gap-0.5 text-xl font-medium">
            <span className="text-gray-800">Google</span>
            <span className="text-yellow-500 font-semibold">Keep</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-15 border-b border-gray-200">
        {/* Logo */}
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
