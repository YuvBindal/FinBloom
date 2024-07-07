"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";

const backendURL = "http://0.0.0.0:8000";

export default function WalletPage() {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [hasWallet, setHasWallet] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState(0);
  const [gasLimit, setGasLimit] = useState(21000);
  const [latestTransaction, setLatestTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        checkWallet(user.uid);
        fetchTransactions(user.uid);
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

    if (amountToSend <= 0) {
      alert("Invalid amount to send");
      return;
    }

    const transactionData = {
      from_account: walletAddress,
      to_account: recipientAddress,
      amount: parseFloat(amountToSend),
      gas_limit: parseInt(gasLimit, 10),
      from_account_private_key: privateKey
    };

    setIsLoading(true);

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
      if (result.transaction_receipt) {
        alert("Transaction successful");
        getAccountBalance(walletAddress);
        setLatestTransaction(result.transaction_receipt);
        // Save transaction data to user's collection
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        let previous_transactions = [];

        if (userDocSnap.exists() && userDocSnap.data().transactions) {
          previous_transactions = userDocSnap.data().transactions;
        }

        previous_transactions.push(result.transaction_receipt);
        
        await updateDoc(userDocRef, {
          transactions: previous_transactions
        });
        fetchTransactions(user.uid);
      } else {
        alert("Transaction failed: " + result.transaction_receipt);
      }
    } catch (error) {
      console.error('Error sending transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="spinner"></div>
      <div className="text-white ml-4">Processing your transaction...</div>
    </div>
  );

  const fetchTransactions = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().transactions) {
      setTransactions(docSnap.data().transactions);
      console.log(docSnap.data().transactions);
    } else {
      setTransactions([]);
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
                      {isLoading && <LoadingSpinner />}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-white text-base">You do not have a wallet yet.</p>
                </div>
              )}
            </div>

            {latestTransaction && (
              <div className="mt-8 w-full flex flex-col items-center">
                <h3 className="text-white text-lg font-bold leading-tight">Latest Successful Transaction</h3>
                <div className="bg-gray-800 p-4 rounded-md w-full max-w-md mt-4">
                  <p className="text-white text-sm"><strong>Transaction Amount in ETH:</strong> {latestTransaction.amount}</p>
                  <p className="text-white text-sm"><strong>Block Hash:</strong> {latestTransaction.blockHash}</p>
                  <p className="text-white text-sm"><strong>Block Number:</strong> {latestTransaction.blockNumber}</p>
                  <p className="text-white text-sm"><strong>From:</strong> {latestTransaction.from}</p>
                  <p className="text-white text-sm"><strong>To:</strong> {latestTransaction.to}</p>
                  <p className="text-white text-sm"><strong>Transaction Hash:</strong> {latestTransaction.transactionHash}</p>
                  <p className="text-white text-sm"><strong>Gas Used:</strong> {latestTransaction.gasUsed}</p>
                  <p className="text-white text-sm"><strong>Effective Gas Price:</strong> {latestTransaction.effectiveGasPrice}</p>
                  <p className="text-white text-sm"><strong>Status:</strong> {latestTransaction.status}</p>
                </div>
              </div>
            )}

            {transactions.length > 0 && (
              <div className="mt-8 w-full flex flex-col items-center">
                <h3 className="text-white text-lg font-bold leading-tight">My Transactions</h3>
                {transactions.map((transaction, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-md w-full max-w-2xl mt-6">
                    <p className="text-white text-sm"><strong>Transaction Amount in ETH:</strong> {transaction.amount}</p>
                    <p className="text-white text-sm"><strong>Sent To:</strong> {transaction.to}</p>
                    <p className="text-white text-sm"><strong>Transaction Hash:</strong> {transaction.transactionHash}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
