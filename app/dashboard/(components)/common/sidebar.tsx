"use client";

import { Bell, Copy, Lightbulb, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarProps {
  isMenuClicked?: boolean;
}

export default function Sidebar({ isMenuClicked }: SidebarProps) {
  // pathname
  const pathname = usePathname();
  // sidebar items
  const sidebarItems = [
    {
      title: "Notes",
      icon: <Lightbulb size={18} />,
      link: "/dashboard/notes",
    },
    {
      title: "Reminders",
      icon: <Bell size={18} />,
      link: "/reminders",
    },
    {
      title: "Archive",
      icon: <Copy size={18} />,
      link: "/dashboard/archives",
    },
    {
      title: "Bin",
      icon: <Trash size={18} />,
      link: "/dashboard/bin",
    },
  ];

  return (
    <div
      className={`h-screen mt-2 ${
        !isMenuClicked && "md:w-64"
      } transition-all ease-in-out duration-300 flex flex-col justify-between`}
    >
      <div className="flex-grow">
        {sidebarItems.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className={`flex pl-7 gap-7 p-3 mt-1 ${
              item.link === pathname ? "bg-amber-100" : "hover:bg-gray-200"
            }   rounded-r-full cursor-pointer text-sm`}
          >
            <label className="cursor-pointer">{item.icon}</label>
            <label
              className={`${
                isMenuClicked ? "md:hidden" : "md:block"
              } text-sm cursor-pointer`}
            >
              {item.title}
            </label>
          </Link>
        ))}
      </div>
      {!isMenuClicked && (
        <footer className="h-[100px] flex flex-col justify-end items-center">
          <span className="text-left mb-[5.5rem] text-gray-800 capitalize text-[12px] font-semibold">
            open source licences
          </span>
        </footer>
      )}
    </div>
  );
}
