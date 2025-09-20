import { create } from "zustand"
import { axiosInstance } from "../lib/Axios.jsx"
import toast from "react-hot-toast"
import { io } from "socket.io-client";



 const base_url = import.meta.env.MODE=== "development" ? "http://localhost:5001" : "/"
export  const UserAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isAuthGoogle:false,

    isCheckAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth: async()=>{
        try {
            const res= await axiosInstance("/auth/check")
            set({authUser:res.data})
            get().connectSocket()
        } catch (error) {
            console.log("error in checkAuth",error)
           set({authUser:null})
        }finally{
            set({isCheckAuth:false})
        }
    },
    signup: async(data)=>{
        set({isSigningUp:true})

        try {
            console.log(data)
            const res = await axiosInstance.post("/auth/signup",data)
            console.log(res.data)
            set({authUser:res.data})
            get().connectSocket()
            toast.success("successfull login")
        } catch (error) {
            toast.error(error.response.data.message)
            
        }finally{
            set({isSigningUp:false})
        }
        
    },

    login: async(data)=>{
        set({isLoggingIng:true})
        
        try {
            const res = await axiosInstance.post("/auth/login",data)
            console.log(res.data)
            set({authUser:res.data})
            get().connectSocket()
            toast.success("Login successfull")
            
        } catch (error) {
            toast.error(error.response.data.message)

            
        } finally{
            set({isLoggingIng:false})

        }
        

    },

    logout: async()=>{
        try {

            const res = await axiosInstance.post("/auth/logout")
            set({authUser:null})
            get().disconnectSocket()
            toast.success("logout successfull")
            
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp:false})
            set({isLoggingIng:false})

        }

    },

    updateProfile: async(data)=>{
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put('/auth/update-profile',data)
            set({authUser:res.data})
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error(error.response.data.message)

        }finally{

            set({isUpdatingProfile:false})
        }
        
    },

    connectSocket: ()=>{
        const {authUser}= get()
        if (!authUser || get().socket?.connected) return; 
        const socket = io(base_url,{
            query:{
                user_id:authUser.id
        }})
        socket.connect()
        set({socket:socket})
        socket.on("getOnlineUsers",(user_id)=>{
            set({onlineUsers:user_id})
        })

    },
    disconnectSocket: ()=>{

          if (get().socket?.connected) get().socket.disconnect();
    },
 
    googleAuth:async(res)=>{
        set({isAuthGoogle:true})
        try {
        
           const result= await axiosInstance.get(`/auth/google?code=${res.code}`)
            set({authUser:result.data})
            get().connectSocket()
            toast.success("Google login success")
            
        } catch (error) {
            console.log("google login errpr",error)
            toast.error("google login faield please try again")
            
        }finally{
            set({isAuthGoogle:false})
        }

    }




}))

