"use client";
import React, { useState, useEffect } from "react";

export default function RepaymentSchedulePage() {
  /** CHANGE LATER IMPLEMENT WITH BACKEND 
  const [repaymentSchedule, setRepaymentSchedule] = useState([]);

  useEffect(() => {
    // Fetch repayment schedule from the backend
    const fetchRepaymentSchedule = async () => {
      try {
        // TODO: Replace '/api/repayment-schedule' with actual API endpoint
        const response = await fetch('/api/repayment-schedule');
        if (response.ok) {
          const data = await response.json();
          setRepaymentSchedule(data.schedule); // Adjust based on API response
        } else {
          console.error('Failed to fetch repayment schedule');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchRepaymentSchedule();
  }, []);
  */

  const loans = {
    loan1: {
      totalAmount: 10000,
      startDate: "2023-01-01",
      payments: [
        { dueDate: "2023-02-01", amountDue: 1000, remaining: 9000, status: "Paid" },
        { dueDate: "2023-03-01", amountDue: 1000, remaining: 8000, status: "Paid" },
        { dueDate: "2023-04-01", amountDue: 1000, remaining: 7000, status: "Paid" },
        { dueDate: "2023-05-01", amountDue: 1000, remaining: 6000, status: "Paid" },
      ],
    },
    loan2: {
      totalAmount: 5000,
      startDate: "2023-06-01",
      payments: [
        { dueDate: "2023-07-01", amountDue: 500, remaining: 4500, status: "Paid" },
        { dueDate: "2023-08-01", amountDue: 500, remaining: 4000, status: "Paid" },
        { dueDate: "2023-09-01", amountDue: 500, remaining: 3500, status: "Due" },
        { dueDate: "2023-10-01", amountDue: 500, remaining: 3000, status: "Due" },
      ],
    },
  };

  const renderLoanTable = (loanData, loanId) => (
    <div key={loanId} className="px-4 py-3 @container">
      <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Loan {loanId.charAt(loanId.length - 1)}
      </h3>
      <div className="p-4 grid grid-cols-2">
        <div className="flex flex-col gap-1 border-t border-solid border-t-[#3c4753] py-4 pr-2">
          <p className="text-[#9dabb8] text-sm font-normal leading-normal">Start date</p>
          <p className="text-white text-sm font-normal leading-normal">{loanData.startDate}</p>
        </div>
        <div className="flex flex-col gap-1 border-t border-solid border-t-[#3c4753] py-4 pl-2">
          <p className="text-[#9dabb8] text-sm font-normal leading-normal">Total amount</p>
          <p className="text-white text-sm font-normal leading-normal">${loanData.totalAmount}</p>
        </div>
      </div>
      <div className="flex overflow-hidden rounded-xl border border-[#3c4753] bg-[#111418]">
        <table className="flex-1">
          <thead>
            <tr className="bg-[#1c2126]">
              <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                Due Date
              </th>
              <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                Paid Amount
              </th>
              <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                Loan Remaining
              </th>
              <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loanData.payments.map((payment, index) => (
              <tr key={index} className="border-t border-t-[#3c4753]">
                <td className="px-4 py-2 text-[#9dabb8] text-sm font-normal leading-normal">
                  {payment.dueDate}
                </td>
                <td className="px-4 py-2 text-[#9dabb8] text-sm font-normal leading-normal">
                  ${payment.amountDue}
                </td>
                <td className="px-4 py-2 text-[#9dabb8] text-sm font-normal leading-normal">
                  ${payment.remaining}
                </td>
                <td className="px-4 py-2 text-sm font-normal leading-normal">
                  <button
                    className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#293038] text-white text-sm font-medium leading-normal w-full ${payment.status === "Paid" ? "text-green-500" : "text-red-500"}`}
                  >
                    <span className="truncate">{payment.status}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                Repayment Schedule
              </p>
            </div>
            {Object.keys(loans).map((loanId) => renderLoanTable(loans[loanId], loanId))}
          </div>
        </div>
      </div>
    </div>
  );
}
