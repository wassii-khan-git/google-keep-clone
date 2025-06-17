"use client";
import {
  BellOutlined,
  BulbOutlined,
  CopyOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarProps {
  isMenuClicked: boolean;
}

export default function Sidebar({ isMenuClicked }: SidebarProps) {
  // pathname
  const pathname = usePathname();
  // sidebar items
  const sidebarItems = [
    {
      title: "Notes",
      icon: <BulbOutlined className="text-xl" />,
      link: "/dashboard",
    },
    {
      title: "Reminders",
      icon: <BellOutlined className="text-xl" />,
      link: "/reminders",
    },
    {
      title: "Archive",
      icon: <CopyOutlined className="text-xl" />,
      link: "/archives",
    },
    {
      title: "Bin",
      icon: <DeleteOutlined className="text-xl" />,
      link: "/bin",
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
            }   rounded-r-full cursor-pointer`}
          >
            <label className="cursor-pointer">{item.icon}</label>
            <label
              className={`${
                isMenuClicked ? "md:hidden" : "md:block"
              } cursor-pointer`}
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
