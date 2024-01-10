"use client";
import React, { useState, useEffect } from 'react';

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

  const statusStyles = {
    Due: { color: 'red', textAlign: 'center' },
    Paid: { color: 'green', textAlign: 'center' },
  };
  const centerAlign = { textAlign: 'center' };
  const tableStyle = { marginTop: '20px', marginBottom: '20px' }; 
  
  const loans = {
    loan1: {
      totalAmount: 10000,
      startDate: '2023-01-01',
      payments: [
        { dueDate: '2023-02-01', amountDue: 1000, remaining: 9000, status: 'Paid' },
        { dueDate: '2023-03-01', amountDue: 1000, remaining: 8000, status: 'Paid' },
        { dueDate: '2023-04-01', amountDue: 1000, remaining: 7000, status: 'Paid' },
        { dueDate: '2023-05-01', amountDue: 1000, remaining: 6000, status: 'Paid' },
      ],
    },
    loan2: {
      totalAmount: 5000,
      startDate: '2023-06-01',
      payments: [
        { dueDate: '2023-07-01', amountDue: 500, remaining: 4500, status: 'Paid' },
        { dueDate: '2023-08-01', amountDue: 500, remaining: 4000, status: 'Paid' },
        { dueDate: '2023-09-01', amountDue: 500, remaining: 3500, status: 'Due' },
        { dueDate: '2023-10-01', amountDue: 500, remaining: 3000, status: 'Due' },
      ],
    },
  };

  const renderLoanTable = (loanData) => (
    <div style={tableStyle}>
      <h2>Loan Start Date: {loanData.startDate}, Total Amount: ${loanData.totalAmount}</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th style={centerAlign}>Due Date</th>
            <th style={centerAlign}>Paid Amount</th>
            <th style={centerAlign}>Loan Remaining</th>
            <th style={centerAlign}>Status</th>
          </tr>
        </thead>
        <tbody>
          {loanData.payments.map((payment, index) => (
            <tr key={index}>
              <td style={centerAlign}>{payment.dueDate}</td>
              <td style={centerAlign}>${payment.amountDue}</td>
              <td style={centerAlign}>${payment.remaining}</td>
              <td style={statusStyles[payment.status]}>{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container p-4">
      <h1>Repayment Schedules</h1>
      {renderLoanTable(loans.loan1)}
      {renderLoanTable(loans.loan2)}
    </div>
  );
}