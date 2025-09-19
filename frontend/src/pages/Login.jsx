import { useState } from "react";

import { Eye, EyeOff, Loader2, Lock, Mail, MessagesSquare, User } from "lucide-react";
import { UserAuthStore } from "../store/UserAuthStore";
import { Link } from "react-router-dom";
import AuthImagePattern from "../lib/AuthImagePattern";
import toast from 'react-hot-toast'
import { useGoogleLogin } from "@react-oauth/google";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIng,googleAuth,isAuthGoogle } = UserAuthStore();

  const googleAuths = useGoogleLogin({

    onSuccess:googleAuth,
    onError:(error)=>{
      console.log("error while login ",error)
      toast.error("Google login failed")
    },
    flow:'auth-code'
    
  })



  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessagesSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="w-full border rounded-md py-2 pl-10 pr-4 "
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e)=>setFormData({...formData,email:e.target.value})}
                />
              </div>

            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>

              </label>
              <div className="relative">
                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border rounded-md py-2 pl-10 pr-4 "
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e)=>setFormData({...formData,password:e.target.value})}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}

                </button>

              </div>

            </div>


            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIng}>
              {isLoggingIng ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Log in"
              )}
            </button>
            <button  type ="button"className="btn bg-white text-black border-[#e5e5e5] w-full" name="googleSubmit"  disabled={isAuthGoogle} onClick={googleAuths} >
              {isAuthGoogle?(
                <>
              <Loader2 className="size-5 animate-spin " />
                 Loading...
                </>

              ):(
                <>
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Login with Google
                </>

              )}

            </button>

          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>

          </div>


        </div>
      </div>

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />




    </div>
  );
};
export default SignUpPage;