
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCompanyLogo(logo: string | null | undefined): string {
  if (logo && logo.trim() !== '') {
    return logo;
  }
  
  // Return a default company logo
  return "https://placehold.co/400x400/5271ff/ffffff?text=Company";
}
