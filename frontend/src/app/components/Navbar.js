"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserAuth } from "../utils/auth-helper";

const Navbar = () => {
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#243647] px-10 py-3 bg-[#111a22]">
      <div className="flex items-center gap-4 text-white">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_6_319)">
              <path
                d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                fill="currentColor"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_6_319"><rect width="48" height="48" fill="white"></rect></clipPath>
            </defs>
          </svg>
        </div>
        <Link href="/">
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Finspire</h2>
        </Link>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link href="/loan-request-history" className="text-white text-sm font-medium leading-normal">
            Loan Request History
          </Link>
          <Link href="/loan-request" className="text-white text-sm font-medium leading-normal">
            Loan Request
          </Link>
          <Link href="/repayment-schedule" className="text-white text-sm font-medium leading-normal">
            Repayment Schedule
          </Link>
          {user && (
            <Link href="/profile" className="text-white text-sm font-medium leading-normal">
              My Profile
            </Link>
          )}
        </div>
        <div className="flex gap-2">
          {loading ? null : !user ? (
            <>
              <button
                onClick={handleSignIn}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1466b8] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Login</span>
              </button>
              <button
                onClick={handleSignIn}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#243647] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Sign up</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <p className="cursor-pointer text-white" onClick={handleSignOut}>
                Sign out
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
