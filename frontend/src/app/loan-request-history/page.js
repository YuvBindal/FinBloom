"use client";
import React, { useState, useEffect } from 'react';
import { auth, db } from "../firebase-config";
import { UserAuth } from "../utils/auth-helper";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc, getDoc, getDocs  } from "firebase/firestore"; 

export default function LoanRequestHistoryPage() {
  const [loanRequests, setLoanRequests] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var email = user.email;
        console.log(email);
        // Call the function to fetch loan requests
        fetchLoanRequests(email);
      } else {
        // No user is signed in.
        console.log("Sign in to see history");
      }
    });
  }, []);

  async function fetchLoanRequests(email)  {
    const querySnapshot = await getDocs(collection(db, "loan-requests"));
    querySnapshot.forEach((doc) => {
      const key = doc.id;
      const keyParts = key.split("-");
      if (keyParts[1] === email) {
        const timestamp = keyParts[2]
        // Create a new object with the timestamp and the loan request data
        const loanRequest = { timestamp: timestamp, ...doc.data() };
        // Add the loan request to the list
        setLoanRequests(loanRequests => [...loanRequests, loanRequest]);
      }
    });
  }

  return (
    <div>
      <h1>Loan Request History</h1>
      {
        // Display the timestamp and the loan request amount which is stored in the loanRequests array
        loanRequests.map((loanRequest) => <p key={loanRequest.timestamp}>{loanRequest.timestamp} - {loanRequest.amount}</p>)
      }
      {loanRequests.length === 0 && <p>No loan requests found</p>}
    </div>
  );
}