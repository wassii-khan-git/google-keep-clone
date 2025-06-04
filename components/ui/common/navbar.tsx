"use client";
import {
  LogoutOutlined,
  ProfileOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react";
import { handleSignOut } from "@/lib/actions/auth.action";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const session = useSession();

  return (
    <header className="px-4 py-2 flex items-center shadow-md">
      {/* Hamburger Menu */}
      {/* <Button variant="outline">
        <NotificationOutlined />
      </Button> */}

      {/* Logo */}
      <div className="ml-4 flex items-center">
        <span className="text-xl font-medium text-gray-800 hidden sm:inline">
          Google
        </span>
        <span className="ml-1 text-xl font-semibold text-yellow-500">Keep</span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchOutlined />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full  md:w-96 pl-10 pr-4 py-2 rounded bg-gray-100 text-gray-800 placeholder-gray-600 focus:outline-none focus:bg-white focus:shadow"
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        <h1 className="font-semibold">{session?.data?.user?.name}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
              <Image
                src={
                  session?.data?.user?.image ??
                  "https://avatars.githubusercontent.com/u/1?v=4"
                }
                alt="User Avatar"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>
                  <ProfileOutlined />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>
                  <SettingOutlined />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleSignOut}
            >
              Log out
              <DropdownMenuShortcut>
                <LogoutOutlined />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
