import React, { useEffect, useState } from 'react'
import useChatStore from '../store/useChatStore'
import SlidebarSkeleton from './skeletons/SlidebarSkeleton';
import { BookUser, Users, ContactRound, Search } from "lucide-react";
import { UserAuthStore } from '../store/UserAuthStore';

const Slidebar = () => {
  const { 
    getUser, 
    users, 
    isUserLoading, 
    setSelectedUser, 
    selectedUsers, 
    unreadMessage, 
    fetchUnreadCount, 
    unsubscribeMessages, 
    subscribeToMessages ,
    getContact,
    contact
  } = useChatStore();

  const { onlineUsers } = UserAuthStore()



  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all") 
  

  useEffect(() => {
    getUser();
    getContact();
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    
    subscribeToMessages();
    return () => unsubscribeMessages();
  }, [selectedUsers]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  
  const filteredUsers = users
    .filter(user => {
      if (filterType === "online") {
        return onlineUsers.includes(user.id);
      }
      if (filterType === "contacts") {
       
        return contact.some(c => c.id ===user.id)
      }
      return true; 
    })
    .filter(user => user.fullname.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isUserLoading) return <SlidebarSkeleton />

  return (
    <aside className="h-full border-r border-base-300 flex flex-col transition-all duration-300">
     
      <div className="border-b border-base-300 w-full p-5">
  
        <div className="flex items-center gap-2">
          <Search className="size-5 text-base-content/60" />
          <div className="w-full">
            <div className="input-group w-full lg:w-64">
              <input
                type="search"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            className={`flex items-center gap-2 bg-base-800 border border-base-300 rounded-lg px-3 py-2  cursor-pointer ${filterType === "all" ? "  hover:opacity-100" : "bg-base-100 opacity-30 hover:opacity-80"}`}
            onClick={() => setFilterType("all")}
          >
            <BookUser className='size-5' /> 
          </button>

          <button
            className={`flex items-center gap-2 bg-base-800 border border-base-300 rounded-lg px-3 py-2 cursor-pointer${filterType === "online" ?"  hover:opacity-100" : "bg-base-100 opacity-30 hover:opacity-80"}`}
            onClick={() => setFilterType("online")}
          >
            <div className='relative'>
             <span className="absolute -bottom-0.5 -right-0.5 size-2 bg-green-500 rounded-full ring-1 " />
            <Users className='size-5'/> 
            </div>
            <span className="text-xs ">({onlineUsers.length - 1})</span>
            
          </button>

          <button
            className={`flex items-center gap-2 bg-base-800 border border-base-300 rounded-lg px-3 py-2 cursor-pointer${filterType === "contacts" ? "  hover:opacity-100" : "bg-base-100 opacity-30 hover:opacity-80"}`}
            onClick={() => {
              setFilterType("contacts")
            }}
          >
            <ContactRound className='size-5'/>
          </button>
        </div>
      </div>

      {/* User list */}
      <div className="overflow-y-auto w-full py-3 ">
        {filteredUsers.map((user) => {
          const unreadCount = unreadMessage?.[user.id] || 0;
          const isSelected = selectedUsers?.id === user.id;

          return (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${isSelected ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              {/* Avatar + online dot */}
              <div className="relative">
                <img
                  src={user.profile_pic || "/avatar.png"}
                  alt={user.fullname}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user.id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* Name + status */}
              <div className="flex-1 text-left">
                <div className="font-medium truncate">{user.fullname}</div>
                <div className="text-xs text-zinc-400">
                 <p><i> {onlineUsers.includes(user.id) ? "Online" : "Offline"}</i></p>
                </div>
              </div>

              {/* Unread badge */}
              {unreadCount > 0 && !isSelected && (
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-auto flex items-center justify-center min-w-[20px] h-6">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  )
}

export default Slidebar
