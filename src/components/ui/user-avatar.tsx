"use client";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  email?: string;
  className?: string;
}

// Hash string to get stable index
function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Get initials from name or email
function getInitials(name: string, email?: string): string {
  const source = name || email || "用户";
  // Remove spaces and get first character
  const cleaned = source.replace(/\s+/g, "").slice(0, 1);
  return cleaned.toUpperCase();
}

// Stable color palette - muted tones that work well
const colors = [
  "bg-slate-500",
  "bg-emerald-600",
  "bg-sky-600",
  "bg-violet-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-indigo-600",
];

export function UserAvatar({ name, email, className }: UserAvatarProps) {
  const id = (name || email || "user").toLowerCase();
  const hash = getHash(id);
  const initials = getInitials(name, email);
  const colorClass = colors[hash % colors.length];

  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm",
        colorClass,
        className
      )}
    >
      {initials}
    </div>
  );
}