import React from "react";
import useChatStore from "../store/useChatStore.jsx";
import Slidebar from "../component/Slidebar.jsx";
import ChatContent from "../component/ChatContent.jsx";
import NoChatSelected from "../component/NoChatSelected.jsx";

const Home = () => {
  const { selectedUsers } = useChatStore();
  const isChatSelected = !!selectedUsers; // Convert to boolean

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <div className={`w-full lg:w-1/3 ${isChatSelected ? "hidden lg:block" : "block"}`}>
              <Slidebar />
            </div>
            <div className="flex-1 hidden lg:flex">
              {isChatSelected ? <ChatContent /> : <NoChatSelected />}
            </div>
            <div className={`w-full block lg:hidden ${isChatSelected ? "flex" : "hidden"}`}>
              <ChatContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;