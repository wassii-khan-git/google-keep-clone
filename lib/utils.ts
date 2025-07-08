import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";

import { twMerge } from "tailwind-merge";

interface Notify {
  message: string;
  flag?: boolean;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const notify = ({ message, flag }: Notify) =>
  flag ? toast.success(message) : toast.error(message);

// function to display only 5 words from a string
export const limitWords = (notes: string, limit: number) => {
  if (!notes) return "";

  const words = notes.split(" ");

  if (words.length > limit) {
    return words.slice(0, limit).join(" ") + "...";
  }

  return notes.split("\n").join(" ");
};
