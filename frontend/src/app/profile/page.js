"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";

const backendURL = "http://localhost:8000";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [hasWallet, setHasWallet] = useState(false);
  const [showPairWallet, setShowPairWallet] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newPrivateKey, setNewPrivateKey] = useState("");

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
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.data().current_active_address) {
      setWalletAddress(docSnap.data().current_active_address);
      setPrivateKey(docSnap.data().current_active_private_key);
      setHasWallet(true);
    } else {
      setHasWallet(false);
    }
  };

  const isValidEthereumAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const isValidPrivateKey = (key) => {
    return /^0x[a-fA-F0-9]{64}$/.test(key);
  };

  const createWallet = async () => {
    if (!user) {
      alert("You need to be logged in to create a wallet.");
      return;
    }

    try {
        const response = await fetch(backendURL + '/setup-wallet');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const { address, private_key } = data;

        if (address && private_key) {
            setWalletAddress(address);
            setPrivateKey(private_key);
            setHasWallet(true);

            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
              current_active_address: address.toString(),
              current_active_private_key: private_key.toString()
            }); 

        } else {
            console.error("Error: Wallet not created. Please Try Again!");
        }
    } catch (error) {
        console.error('Error creating wallet:', error);
    }
  };

  const pairWallet = async () => {
    if (!user) {
      alert("You need to be logged in to pair a wallet.");
      return;
    }

    if (!newWalletAddress || !newPrivateKey) {
      alert("Please enter both the wallet address and private key.");
      return;
    }

    if (!isValidEthereumAddress(newWalletAddress)) {
      alert("Invalid Ethereum wallet address. Please try again.");
      return;
    }

    if (!isValidPrivateKey(newPrivateKey)) {
      alert("Invalid private key. Please try again.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        current_active_address: newWalletAddress.toString(),
        current_active_private_key: newPrivateKey.toString()
      });

      setWalletAddress(newWalletAddress);
      setPrivateKey(newPrivateKey);
      setHasWallet(true);
      setShowPairWallet(false);
    } catch (error) {
      console.error('Error pairing wallet:', error);
    }
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
                  <p className="text-white text-base">Your private key:</p>
                  <p className="text-[#93adc8] text-sm font-normal">{privateKey}</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-white text-base">You do not have a wallet yet.</p>
          
                </div>
              )}

                  <button
                    onClick={createWallet}
                    className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
                  >
                    Create Wallet
                  </button>
              <button
                onClick={() => setShowPairWallet(true)}
                className="mt-4 p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-150 ease-in-out"
              >
                Pair Existing Wallet
              </button>
            </div>

            {showPairWallet && (
              <div className="flex flex-col w-full items-center justify-center mt-4">
                <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">Pair Existing Wallet</h3>
                <input
                  type="text"
                  placeholder="Wallet Address"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  className="mt-2 p-2 rounded-md text-black"
                />
                <input
                  type="text"
                  placeholder="Private Key"
                  value={newPrivateKey}
                  onChange={(e) => setNewPrivateKey(e.target.value)}
                  className="mt-2 p-2 rounded-md text-black"
                />
                <button
                  onClick={pairWallet}
                  className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
                >
                  Pair Wallet
                </button>
                <button
                  onClick={() => setShowPairWallet(false)}
                  className="mt-4 p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            )}

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
