import React from 'react'
import { BookUser, Users, ContactRound, Search } from "lucide-react";

const SlidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full border-r border-base-300 flex flex-col transition-all duration-300">
      {/* Search + Filters */}
      <div className="border-b border-base-300 w-full p-5">
        {/* Search bar */}
        <div className="flex items-center gap-2">
          <Search className="size-5 text-base-content/60" />
          <div className="w-full">
            <div className="input-group w-full lg:w-64">
              <div className="skeleton h-10 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mt-4">
          <button className="flex items-center gap-2 bg-base-200 border border-base-300 rounded-lg px-3 py-2 opacity-60 cursor-not-allowed">
            <BookUser className="size-5 text-zinc-400" />
          </button>
          <button className="flex items-center gap-2 bg-base-200 border border-base-300 rounded-lg px-3 py-2 opacity-60 cursor-not-allowed">
            <div className="relative">
              <span className="absolute -bottom-0.5 -right-0.5 size-2 bg-green-500 rounded-full ring-1" />
              <Users className="size-5 text-zinc-400" />
            </div>
            <span className="text-xs text-zinc-400">(0)</span>
          </button>
          <button className="flex items-center gap-2 bg-base-200 border border-base-300 rounded-lg px-3 py-2 opacity-60 cursor-not-allowed">
            <ContactRound className="size-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* User list skeleton */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-3 flex items-center gap-3 animate-pulse"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* Name + status */}
            <div className="flex-1 text-left hidden lg:block">
              <div className="skeleton h-4 w-32 mb-2 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>

            {/* Unread badge */}
            <div className="hidden lg:block">
              <div className="skeleton h-6 w-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SlidebarSkeleton;
