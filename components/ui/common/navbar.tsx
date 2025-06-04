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

import CustomDropdown from "./custom-dropdown";

const Navbar = () => {
  // session
  const session = useSession();
  // Define menu items for the dropdown
  const menuItems = [
    {
      title: "Profile",
      icon: <ProfileOutlined className="mr-2 h-4 w-4" />,
      isClickable: false,
    },
    {
      title: "Settings",
      icon: <SettingOutlined className="mr-2 h-4 w-4" />,
      isClickable: false,
    },
    {
      title: "Log out",
      icon: <LogoutOutlined className="mr-2 h-4 w-4" />,
      isClickable: true,
      handleClick: async () => await handleSignOut(),
    },
  ];

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
        <CustomDropdown menuitems={menuItems || []} direction="end">
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
        </CustomDropdown>
      </div>
    </header>
  );
};

export default Navbar;
