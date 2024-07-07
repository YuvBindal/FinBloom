"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";

const backendURL = "http://localhost:8000";

export default function WalletPage() {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [hasWallet, setHasWallet] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [gasLimit, setGasLimit] = useState(21000);

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
      getAccountBalance(docSnap.data().current_active_address);

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

  const getAccountBalance = async (address) => {
    try {
      console.log(address);
      const response = await fetch(`${backendURL}/get-balance?address=${address}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const { address_balance } = data;

      if (address_balance) {
        setAccountBalance(address_balance);
      } else {
        console.error("Error: Could not retrieve balance. Please try again!");
      }
    } catch (error) {
      console.error('Error getting wallet balance:', error);
    }
  };

  const handleTransaction = async () => {
    if (!isValidEthereumAddress(recipientAddress)) {
      alert("Invalid recipient address");
      return;
    }

    const transactionData = {
      from: walletAddress,
      to: recipientAddress,
      value: amountToSend,
      gas: gasLimit,
      privateKey: privateKey
    };

    try {
      const response = await fetch(`${backendURL}/send-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.success) {
        alert("Transaction successful");
      } else {
        alert("Transaction failed: " + result.message);
      }
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}>
      <div className="flex h-full grow flex-col w-full">
        <div className="flex flex-1 justify-center py-5 w-full">
          <div className="flex flex-col w-full px-4">
            <h2 className="text-white tracking-light text-[28px] font-bold leading-tight text-center pb-3 pt-5">Wallet Information</h2>
            
            <div className="flex flex-col w-full items-center justify-center">
              {hasWallet ? (
                <div className="text-center">
                  <p className="text-white text-base">Your wallet address:</p>
                  <p className="text-[#93adc8] text-sm font-normal">{walletAddress}</p>
                  <p className="text-white text-base">Your private key:</p>
                  <p className="text-[#93adc8] text-sm font-normal">{privateKey}</p>
                  <p className="text-white text-base">Account Balance in ETH:</p>
                  <p className="text-[#93adc8] text-sm font-normal">{accountBalance}</p>

                  <button
                    onClick={() => setShowTransactionForm(!showTransactionForm)}
                    className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
                  >
                    Launch Transaction
                  </button>

                  {showTransactionForm && (
                    <div className="mt-4 w-full flex flex-col items-center">
                      <input
                        type="text"
                        placeholder="Recipient Address"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className="mt-2 p-2 rounded-md text-black w-full max-w-md"
                      />
                      <input
                        type="number"
                        placeholder="Amount to Send (ETH)"
                        value={amountToSend}
                        onChange={(e) => setAmountToSend(e.target.value)}
                        className="mt-2 p-2 rounded-md text-black w-full max-w-md"
                      />
                      <input
                        type="number"
                        placeholder="Gas Limit"
                        value={gasLimit}
                        onChange={(e) => setGasLimit(e.target.value)}
                        className="mt-2 p-2 rounded-md text-black w-full max-w-md"
                      />
                      <button
                        onClick={handleTransaction}
                        className="mt-4 p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-150 ease-in-out"
                      >
                        Send Transaction
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-white text-base">You do not have a wallet yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
