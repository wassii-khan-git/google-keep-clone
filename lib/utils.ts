import { clsx, type ClassValue } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

interface Notify {
  message: string;
  flag?: boolean;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const notify = ({ message, flag }: Notify) => {
  toast(message, { type: flag ? "success" : "error" });
};
