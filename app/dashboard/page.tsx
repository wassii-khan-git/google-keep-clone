"use client";
import { useState } from "react";
import Navbar from "./(components)/navbar";
import Note from "./(components)/note";
import Sidebar from "./(components)/sidebar";

// Home Page
export default function Home() {
  const [isMenuClicked, setIsMenuClicked] = useState<boolean>(false);

  return (
    <>
      {/* Navbar */}
      <header>
        <Navbar
          setIsMenuClicked={setIsMenuClicked}
          isMenuClicked={isMenuClicked}
        />
      </header>
      <div className="flex ">
        <aside
          className={`${
            isMenuClicked ? "w-20" : ""
          }  transition-all ease-in-out duration-300`}
        >
          <Sidebar isMenuClicked={isMenuClicked} />
        </aside>
        <main className=" container mx-auto p-4 mt-10">
          {/* add note */}
          <Note />
        </main>
      </div>
    </>
  );
}
