"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export default function LoanRequestHistoryPage() {
  const [loanRequests, setLoanRequests] = useState([]);

  useEffect(() => {
    async function fetchLoanRequests(email) {
      const querySnapshot = await getDocs(collection(db, "loan_requests"));
      const fetchedLoanRequests = [];
      querySnapshot.forEach((doc) => {
        const key = doc.id;
        const keyParts = key.split("-");
        if (keyParts[1] === email) {
          const timestamp = keyParts[2];
          const loanRequest = { timestamp: timestamp, ...doc.data() };
          fetchedLoanRequests.push(loanRequest);
        }
      });
      setLoanRequests(fetchedLoanRequests);
    }

    auth.onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        fetchLoanRequests(email);
      } else {
        console.log("Sign in to see history");
      }
    });
  }, []);

  return (
    <>
      <div className="relative flex min-h-screen flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}>
        <div className="flex h-full grow flex-col w-full">
          <div className="flex flex-1 justify-center py-5 w-full">
            <div className="flex flex-col w-full px-4">
              <h2 className="text-white tracking-light text-[28px] font-bold leading-tight text-center pb-3 pt-5">Loan Request History</h2>
              <div className="p-4">
                {loanRequests.length > 0 ? (
                  loanRequests.map((loanRequest) => (
                    <div key={loanRequest.timestamp} className="flex items-stretch justify-between gap-4 rounded-xl p-4 mb-4 bg-[#1c2126]">
                      <div className="flex flex-col gap-1 w-full">
                        <p className="text-white text-base font-bold leading-tight">Timestamp: {loanRequest.timestamp}</p>
                        <p className="text-[#93adc8] text-sm font-normal leading-normal">Loan Amount: ${loanRequest["loan_amount"]}</p>
                        <p className="text-[#93adc8] text-sm font-normal leading-normal">Number of Dependents: {loanRequest["no_of_dependents"]}</p>
                        <p className="text-[#93adc8] text-sm font-normal leading-normal">Education: {loanRequest["education"]}</p>
                        <p className="text-[#93adc8] text-sm font-normal leading-normal">Self Employed: {loanRequest["self_employed"]}</p>
                        <p className="text-[#93adc8] text-sm font-normal leading-normal">Annual Income: ${loanRequest["income_annum"]}</p>
                        <p className="text-[#93adc8] text-sm font-normal leading-normal">Loan Term: {loanRequest["loan_term"]} years</p>
                        <p className="text-[#93adc8] text-sm font-normal leading-normal">Cibil Score: {loanRequest["cibil_score"]}</p>
                        <p className="text-[#93adc8] text-sm font-normal leading-normal">Residential Assets Value: ${loanRequest["residential_assets_value"]}</p>
                        <p className="text-[#93adc8] text-sm font-normal leading-normal">Commercial Assets Value: ${loanRequest["commercial_assets_value"]}</p>
                        <p className="text-[#93adc8] text-sm font-normal leading-normal">Luxury Assets Value: ${loanRequest["luxury_assets_value"]}</p>
                        <p className="text-[#93adc8] text-sm font-normal leading-normal">Bank Assets Value: ${loanRequest["bank_asset_value"]}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#93adc8] text-center">No loan requests found</p>
                )}
              </div>
              <Link href="/" legacyBehavior>
                <a className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1466b8] text-white text-sm font-medium leading-normal w-fit mx-auto mt-4">
                  <span className="truncate">Go Back to Dashboard</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
