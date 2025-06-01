import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import React from "react";
import { Button } from "../button";

const Navbar = () => {
  return (
    <header className="px-4 py-2 flex items-center shadow-md">
      {/* Hamburger Menu */}
      {/* <Button variant="outline">
        <MenuOutlined />
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
        {/* Notifications Icon */}
        <Button variant="outline">
          <BellOutlined />
        </Button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image
            src="https://avatars.githubusercontent.com/u/1?v=4"
            alt="User Avatar"
            width={100}
            height={100}
            className=" object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
