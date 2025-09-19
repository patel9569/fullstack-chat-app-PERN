import React, { useEffect, useRef, useState } from "react";
import useChatStore from "../store/useChatStore";
import ChatHeader from "./ChatHeader.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import MessageInput from "./MessageInput.jsx";
import { formatMessageTime, formatMessageDate } from "../lib/Utlis.jsx";
import { UserAuthStore } from "../store/UserAuthStore.jsx";
import { SmilePlus, SquarePen, Check, X, GripVertical, CheckCheck } from "lucide-react";

const ChatContent = () => {
  const {
    message,
    isMessageLoading,
    selectedUsers,
    getMessage,
    unsubscribeMessages,
    subscribeToMessages,
    sendEmojiMessage,
    updateMessage,
    deleteMessage,


  } = useChatStore();

  const { authUser } = UserAuthStore();
  const messageEndRef = useRef(null);
  const inputEditMessage = useRef(null);

  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState(null);
  const [handelEditmessageId, setHandelEditMessageId] = useState(null);
  const [editText, setEditText] = useState("");


  const reactionEmojis = ["1f44d", "1f602", "1f622", "1f60d", "1f621"];

  useEffect(() => {
    if (selectedUsers?.id) {
      getMessage(selectedUsers.id);
      subscribeToMessages();
      return unsubscribeMessages;
    }
  }, [selectedUsers?.id, getMessage, subscribeToMessages, unsubscribeMessages]);


  useEffect(() => {
    if (handelEditmessageId && inputEditMessage.current) {
      inputEditMessage.current.focus();
    }
  }, [handelEditmessageId]);


  useEffect(() => {
    if (messageEndRef.current && message) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  if (isMessageLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );


  const handleReaction = (emoji, id) => {
    sendEmojiMessage({ emoji, id });
    setShowEmojiPickerFor(null);
  };

  const handleSaveEdit = (id) => {
    if (editText.trim() !== "") {
      updateMessage({ id, texts: editText });
    }
    setHandelEditMessageId(null);
    setEditText("");
  };

  const handleDeletedMesssage = (id) => {
    deleteMessage({ id })

  }

  let lastDate = null;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {message.map((msg) => {

          const msgDate = formatMessageDate(msg.created_at);
          const showDate = msgDate !== lastDate
          if (showDate) lastDate = msgDate


          return (
            <React.Fragment key={msg.id}>
              {showDate && (
                <div className="flex justify-center my-2">
                  <span className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                    {msgDate}
                  </span>
                </div>
              )}


              <div
                key={msg.id}
                className={`chat ${msg.sender_id === authUser.id ? "chat-end" : "chat-start"}`}
              >
                {/* Avatar */}
                {/* <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    msg.sender_id === authUser.id
                      ? authUser.profile_pic || "/avatar.png"
                      : selectedUsers?.profile_pic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div> */}

                {/* Message Content */}
                <div className="relative group max-w-xs">
                  <div
                    className={`chat-header mb-1 ${msg.sender_id === authUser.id ? "flex-row-reverse" : "flex-row"
                      }`}
                  >
                   
                  </div>

                  <div
                    className={`flex items-center gap-2 ${msg.sender_id === authUser.id ? "flex-row-reverse" : "flex-row"
                      }`}
                  >
                    {/* Message bubble */}
                    <div className="chat-bubble ">
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Attachment"
                          className="sm:max-w-[200px] rounded-md mb-2"
                        />
                      )}

                      {msg.id === handelEditmessageId ? (
                        <textarea
                          className="w-full resize-none outline-none  rounded-md "
                          value={editText}
                          ref={inputEditMessage}
                          onChange={(e) => {
                            setEditText(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height = `${e.target.scrollHeight}px`;
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSaveEdit(msg.id);
                            }
                          }}
                        />
                      ) : (
                        msg.texts &&
                        <>
                          {msg.texts === "User have deleted the message" ? (
                            <p className="italic text-gray-400 text-sm">
                              {msg.texts}
                            </p>
                          ) : (

                            <>


                              <p className="text-sm break-all whitespace-pre-wrap [overflow-wrap:anywhere]">
                                {msg.texts}
                              </p>
                              <div
                                className={`flex items-center gap-1 text-[10px] mt-2 ${msg.sender_id === authUser.id
                                  ? "justify-start"
                                  : "justify-end"
                                  }`}
                              >

                                {msg.sender_id === authUser.id && (msg.read === true ? (
                                  <CheckCheck className="size-3 text-blue-500 opacity-80" />
                                ) : (

                                  <Check className="size-3 text-gray-500 opacity-80" />
                                ))}

                                <span className="opacity-60">
                                  {formatMessageTime(msg.created_at)}
                                </span>

                              </div>
                              {msg.edited_text === true && (
                                <em className="text-[10px] opacity-60 ">(edited)</em>
                              )}
                            </>



                          )}

                        </>

                      )}

                    </div>

                    {/* Emoji button */}
                    <button
                      onClick={() =>
                        setShowEmojiPickerFor(showEmojiPickerFor === msg.id ? null : msg.id)
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-sm hover:underline"
                    >
                      <SmilePlus className="size-4 cursor-pointer hover:opacity-60" />
                    </button>

                    {/* Edit button */}
                    {msg.sender_id === authUser.id && msg.texts !== "User have deleted the message" && (
                      <div className="dropdown dropdown-top opacity-0 group-hover:opacity-100 transition-opacity">
                        <div tabIndex={0} role="button" className="cursor-pointer hover:opacity-60 ">
                          <GripVertical className="size-4 " />
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box z-1  p-2 shadow-sm"
                        >


                          <li>
                            <button
                              onClick={() => {
                                setHandelEditMessageId(msg.id);
                                setEditText(msg.texts || "");
                              }}
                            >
                              <SquarePen className="size-4 mr-2" />
                              Edit
                            </button>
                          </li>

                          <li>
                            <button
                              onClick={() => {

                                handleDeletedMesssage(msg.id)

                              }}
                            >
                              <X className="size-4 mr-2" />
                              Delete
                            </button>
                          </li>

                        </ul>
                      </div>

                    )}

                  </div>




                  {/* Reaction bubble */}
                  {msg.emoji && (
                    <div
                      className={`flex  ${msg.sender_id === authUser.id ? "justify-end" : "justify-start"
                        }`}
                    >
                      <span>{String.fromCodePoint(parseInt(msg.emoji, 16))}</span>


                    </div>
                  )}

                  {/* Emoji picker */}
                  {showEmojiPickerFor === msg.id && (
                    <div
                      className={`absolute -top-10 ${msg.sender_id === authUser.id ? "right-0" : "left-0"
                        } backdrop-blur-sm shadow-lg rounded-xl p-2 z-50 flex`}
                    >
                      {reactionEmojis.map((emoji) => (
                        <span
                          key={emoji}
                          className="cursor-pointer text-xl hover:scale-125 transition-transform"
                          onClick={() => handleReaction(emoji, msg.id)}
                        >
                          {String.fromCodePoint(parseInt(emoji, 16))}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save / Cancel buttons for editing */}
                {msg.id === handelEditmessageId && (
                  <div
                    className={`flex gap-2 mt-1 ml-12 ${msg.sender_id === authUser.id ? "justify-end mr-2" : "justify-start"
                      }`}
                  >
                    <button
                      onClick={() => handleSaveEdit(msg.id)}
                      className="px-1 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      <Check className="size-3" />
                    </button>
                    <button
                      onClick={() => {
                        setHandelEditMessageId(null);
                        setEditText("");
                      }}
                      className="px-1 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <X className="size-3" />
                    </button>

                  </div>

                )}


              </div>
            </React.Fragment>

          )
        })}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContent;
