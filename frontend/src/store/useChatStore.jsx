import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/Axios";
import { UserAuthStore } from "./UserAuthStore";

const useChatStore = create((set, get) => ({
    message: [],
    users: [],
    unreadMessage: {},
    contact: [],
    selectedUsers: null,
    isUserLoading: false,
    isMessageLoading: false,



    getUser: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessage: async (userId) => {
        set({ isMessageLoading: true });
        try {

            await axiosInstance.put(`/message/mark-as-read/${userId}`);

            const res = await axiosInstance.get(`/message/${userId}`);
            set((state) => ({
                message: res.data.rows,
                unreadMessage: { ...state.unreadMessage, [userId]: 0 },
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    getContact: async () => {
        try {
            const myId = UserAuthStore.getState().authUser?.id

            const res = await axiosInstance.get(`/message/contacts/${myId}`)
            set({
                contact: res.data

            })

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);

        }

    },

    sendMessage: async (messageData) => {
        const { selectedUsers, message } = get();
        if (!selectedUsers) return;

        try {
            const res = await axiosInstance.post(
                `/message/send/${selectedUsers.id}`,
                messageData
            );
            set({ message: [...message, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    },

    sendEmojiMessage: async ({ id, emoji }) => {
        try {
            const res = await axiosInstance.put(`/message/send/emoji`, { id, emoji });
            const updatedMsg = res.data;
            set({
                message: get().message.map((msg) =>
                    msg.id === updatedMsg.id ? updatedMsg : msg
                ),
            });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    },

    updateMessage: async ({ id, texts }) => {
        try {
            const res = await axiosInstance.put(`/message/send/updatemessage`, {
                id,
                texts,
            });
            const updatedMsg = res.data;
            set({
                message: get().message.map((msg) =>
                    msg.id === updatedMsg.id ? updatedMsg : msg
                ),
            });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    },

    deleteMessage: async ({ id }) => {
        try {
            const res = await axiosInstance.put(`/message/send/deletemessage`, { id });
            const deletedMsg = res.data
            set({
                message: get().message.map((msg) => msg.id === deletedMsg.id ? deletedMsg : msg)
            });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    },
    setUnreadMessage: (data) => {
        // const counts = {};
        // data.forEach((item) => {
        //     counts[item.user_id] = item.unread_count;
        // });
        // set({ unreadMessage: counts });

        set((state) => {
            const count = { ...state.unreadMessage }
            data.forEach((item) => {
                count[item.user_id] = item.unread_count
            })
            return { unreadMessage: count }
        })

    },
    fetchUnreadCount: async () => {
        try {
            const res = await axiosInstance.get("/message/send/unreadcount");

            get().setUnreadMessage(res.data)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    },

    subscribeToMessages: () => {
        const socket = UserAuthStore.getState().socket;
        const myId = UserAuthStore.getState().authUser?.id;
        if (!socket || !myId) return;

        get().unsubscribeMessages()

        socket.on("messageUpdated", async (updatedMessage) => {
            const { message, selectedUsers } = get();

            const isCurrentChat =
                selectedUsers &&
                (updatedMessage.sender_id === selectedUsers.id ||
                    updatedMessage.reciver_id === selectedUsers.id);

            if (isCurrentChat) {
                const exists = message.find((msg) => msg.id === updatedMessage.id);
                if (exists) {
                    set({
                        message: message.map((msg) =>
                            msg.id === updatedMessage.id ? updatedMessage : msg
                        ),
                    });
                } else {
                    set({ message: [...message, updatedMessage] });
                }

                if (updatedMessage.reciver_id === myId && updatedMessage.read === false) {
                    try {
                        await axiosInstance.put(`/message/mark-as-read/${updatedMessage.sender_id}`);
                        set((state) => ({
                            unreadMessage: { ...state.unreadMessage, [updatedMessage.sender_id]: 0 }
                        }));
                        set({
                            message: get().message.map((msg) =>
                                msg.id === updatedMessage.id ? { ...msg, read: true } : msg
                            ),
                        });
                    } catch (error) {
                        console.log("Failed to mark as read", error.message);
                    }
                }
            }
        });

        socket.on("deleteMessage", (deleteMessage) => {
            set({
                message: get().message.map((msg) => msg.id === deleteMessage.id ? deleteMessage : msg),
            });
        });

        socket.on("unreadMeassage", (data) => {
            get().setUnreadMessage(data);
        });
    },



    unsubscribeMessages: () => {
        const socket = UserAuthStore.getState().socket;
        if (!socket) return;
        socket.off("messageUpdated");
        socket.off("deleteMessage");
        socket.off("unreadMeassage");
    },

    setSelectedUser: (selectedUser) => {

        set({ selectedUsers: selectedUser })



    },


}));

export default useChatStore;
