import React from 'react'
import { Link } from "react-router-dom";
import { UserAuthStore } from '../store/UserAuthStore'
import { LogOut, MessagesSquare, Settings, User, EllipsisVertical  } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = UserAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">

          {/* Logo / Brand */}
          <Link to="/home" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessagesSquare className="w-5 h-5 text-primary" aria-label="Chat Logo" />
            </div>
            <h1 className="text-lg font-bold">Chatty</h1>
          </Link>

          {/* Desktop Navigation (visible on lg and above) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/settings"
              className="btn btn-sm gap-2 rounded-xl shadow-sm border border-base-300 
                         bg-base-200 hover:bg-primary hover:text-white 
                         transition-all duration-200 hover:scale-105"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="btn btn-sm gap-2 rounded-xl shadow-sm border border-base-300 
                             bg-base-200 hover:bg-primary hover:text-white 
                             transition-all duration-200 hover:scale-105"
                  aria-label="Profile"
                >
                  <User className="size-5" />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="btn btn-sm gap-2 rounded-xl shadow-sm border border-red-200 
                             bg-red-50 text-red-600 hover:bg-red-500 hover:text-white 
                             transition-all duration-200 hover:scale-105"
                  aria-label="Logout"
                >
                  <LogOut className="size-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Dropdown (visible below lg) */}
          <div className="dropdown dropdown-end lg:hidden ">
            <label tabIndex={0} className="p-2 cursor-pointer">
              <EllipsisVertical  className='size-5' />
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-1  p-2 shadow-sm"
            >
              <li>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 rounded-xl shadow-sm border border-base-300 
                             bg-base-200 hover:bg-primary hover:text-white 
                             transition-all duration-200 hover:scale-105 px-3 py-2"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </li>

              {authUser && (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 rounded-xl shadow-sm border border-base-300 
                                 bg-base-200 hover:bg-primary hover:text-white 
                                 transition-all duration-200 hover:scale-105 px-3 py-2"
                      aria-label="Profile"
                    >
                      <User className="size-5" />
                      <span>Profile</span>
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 rounded-xl shadow-sm border border-red-200 
                                 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white 
                                 transition-all duration-200 hover:scale-105 px-3 py-2 w-full text-left"
                      aria-label="Logout"
                    >
                      <LogOut className="size-5" />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
