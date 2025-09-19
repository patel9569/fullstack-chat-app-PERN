import React from 'react';
import { X } from "lucide-react";
import useChatStore from '../store/useChatStore';
import { UserAuthStore } from '../store/UserAuthStore';

const ChatHeader = () => {
  const { selectedUsers, setSelectedUser, fetchUnreadCount ,subscribeToMessages} = useChatStore();
  const { onlineUsers } = UserAuthStore();

  if (!selectedUsers) return null;
  


  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUsers.profile_pic || "/avatar.png"} alt={selectedUsers.fullname} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUsers.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUsers.id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={()=>setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
