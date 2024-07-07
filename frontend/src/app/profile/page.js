"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase-config";
import { UserAuth } from "../utils/auth-helper";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [hasWallet, setHasWallet] = useState(false);

  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        checkWallet(user.uid);
      } else {
        console.log("User not found");
        setUser(null);
      }
    });
  }, []);

  const checkWallet = async (uid) => {
    const docRef = doc(db, "wallets", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setWalletAddress(docSnap.data().address);
      setHasWallet(true);
    } else {
      setHasWallet(false);
    }
  };

  const createWallet = async () => {
    // WALLET CREATION LOGIC
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}>
      <div className="flex h-full grow flex-col w-full">
        <div className="flex flex-1 justify-center py-5 w-full">
          <div className="flex flex-col w-full px-4">
            <h2 className="text-white tracking-light text-[28px] font-bold leading-tight text-center pb-3 pt-5">Profile Settings</h2>
            
            <div className="flex flex-col w-full items-center justify-center">
              <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">Wallet Settings</h3>
              {hasWallet ? (
                <div className="text-center">
                  <p className="text-white text-base">Your wallet address:</p>
                  <p className="text-[#93adc8] text-sm font-normal">{walletAddress}</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-white text-base">You do not have a wallet yet.</p>
                  <button
                    onClick={createWallet}
                    className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
                  >
                    Create Wallet
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col w-full items-center justify-center mt-8">
              <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">Profile Information</h3>
              <div className="text-center">
                <p className="text-white text-base">Name: {user?.displayName}</p>
                <p className="text-white text-base">Email: {user?.email}</p>
              </div>
            </div>

            <div className="flex flex-col w-full items-center justify-center mt-8">
              <Link href="/" className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
