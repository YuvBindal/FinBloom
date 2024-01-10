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
    <div className="h-20 w-full border-b-2 flex items-center justify-between p-2">
      <ul className="flex">
        <li className="p-2 cursor-pointer">
          <Link href="/">Home</Link>
        </li>
        <li className="p-2 cursor-pointer">
          <Link href="/credit-score">Credit Score</Link>
        </li>
        <li className="p-2 cursor-pointer">
          <Link href="/loan-request">Loan Request</Link>
        </li>
        <li className="p-2 cursor-pointer">
          <Link href="/repayment-schedule">Repayment Schedule</Link>
        </li>
      </ul>

      {loading ? null : !user ? (
        <ul className="flex">
          <li onClick={handleSignIn} className="p-2 cursor-pointer">
            Login
          </li>
          <li onClick={handleSignIn} className="p-2 cursor-pointer">
            Sign up
          </li>
        </ul>
      ) : (
        <div className="flex items-center">
            <p>Welcome, {user.displayName}</p>
            <p className="cursor-pointer ml-4" onClick={handleSignOut}>
                Sign out
            </p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
