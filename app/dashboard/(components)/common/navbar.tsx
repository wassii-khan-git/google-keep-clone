"use client";

import {
  LogoutOutlined,
  MenuOutlined,
  PauseOutlined,
  ProfileOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { handleSignOut } from "@/lib/actions/auth.action";
import TooltipButton from "@/components/ui/custom-tooltip";
import CustomDropdown, {
  MenuChildsProps,
} from "@/components/ui/custom-dropdown";

// Types
export interface NavbarProps {
  setIsMenuClicked: Dispatch<SetStateAction<boolean>>;
  isMenuClicked?: boolean;
}

const Navbar = ({ setIsMenuClicked }: NavbarProps) => {
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Memoized handlers
  const handleMenuClick = useCallback(() => {
    localStorage.setItem("menu", JSON.stringify({ active: true }));
    setIsMenuClicked((prev) => !prev);
  }, [setIsMenuClicked]);

  const handleSignOutClick = useCallback(async () => {
    try {
      await handleSignOut();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, [setIsSearchFocused]);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, [setIsSearchFocused]);

  // Define menu items for the dropdown
  const menuItems: MenuChildsProps[] = [
    {
      title: "Profile",
      icon: <ProfileOutlined />,
      isClickable: false,
      handleClick: function () {},
    },
    {
      title: "Settings",
      icon: <SettingOutlined />,
      isClickable: false,
      handleClick: function () {},
    },
    {
      title: "Log out",
      icon: <LogoutOutlined />,
      isClickable: true,
      handleClick: handleSignOutClick,
    },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center h-16 px-3 sm:px-4 lg:px-4">
        {/* Left Section: Menu + Logo */}
        <div
          className="flex items-center gap-2 sm:gap-3 min-w-0"
          onClick={handleMenuClick}
        >
          {/* Hamburger Menu */}
          <TooltipButton
            icon={
              <MenuOutlined
                className={`text-lg text-gray-600 hover:text-gray-800`}
              />
            }
            tooltipText="Main Menu"
            isClickable={true}
          />

          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="flex-shrink-0">
              <Image
                src="/icon.png"
                width={40}
                height={40}
                alt="Keep Logo"
                className="w-8 h-8 sm:w-10 sm:h-10"
                priority
              />
            </div>
            <span className="hidden sm:block text-xl font-normal text-gray-600 truncate">
              Keep
            </span>
          </Link>
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex-1 max-w-3xl mx-4 sm:mx-6 lg:mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <SearchOutlined
                className={`text-base transition-colors duration-200 ${
                  isSearchFocused ? "text-blue-500" : "text-gray-400"
                }`}
              />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholder="Search"
              className={`
                w-full h-12 pl-12 pr-4 
                bg-gray-50 hover:bg-gray-100
                border border-transparent
                rounded-lg
                text-gray-800 placeholder-gray-500
                transition-all duration-200 ease-in-out
                focus:outline-none focus:bg-white focus:border-blue-300 focus:shadow-md focus:shadow-blue-100
                ${
                  isSearchFocused
                    ? "bg-white border-blue-300 shadow-md shadow-blue-100"
                    : ""
                }
              `}
              aria-label="Search notes"
            />
          </div>
        </div>

        {/* Right Section: Action Icons + Profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Action Icons */}
          <div className="hidden sm:flex items-center gap-1">
            <TooltipButton
              icon={
                <ReloadOutlined className="text-lg text-gray-600 hover:text-gray-800" />
              }
              tooltipText="Refresh"
              handleClick={() => toast.error("Working on this feature")}
              isClickable={true}
            />
            <TooltipButton
              icon={
                <PauseOutlined className="rotate-90 text-lg text-gray-600 hover:text-gray-800" />
              }
              tooltipText="List View"
              handleClick={() => toast.error("Working on this feature")}
              isClickable={false}
            />
            <TooltipButton
              icon={
                <SettingOutlined className="text-lg text-gray-600 hover:text-gray-800" />
              }
              tooltipText="Settings"
              handleClick={() => toast.error("Working on this feature")}
              isClickable={false}
            />
          </div>

          {/* Profile Dropdown */}
          <CustomDropdown menuitems={menuItems} direction="end">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-gray-300 transition-all duration-200 flex-shrink-0">
              <Image
                src={
                  session?.user?.image ??
                  "https://avatars.githubusercontent.com/u/1?v=4"
                }
                alt="User Avatar"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </CustomDropdown>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
