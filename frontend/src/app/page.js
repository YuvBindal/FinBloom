"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const loanProviders = [
  { name: 'Provider 1', description: 'Description of Provider 1', id: 'provider1' },
  { name: 'Provider 2', description: 'Description of Provider 2', id: 'provider2' },
  // ... more providers
];

/*
async function fetchDataFromFirestore() {
  const querySnapShot = await getDocs(collection(db, 'users'));

  const data = [];
  querySnapShot.forEach((doc) => {
    data.push({id: doc.id, ...doc.data()});
  });
  return data;
}
*/


export default function HomePage() {
  const [userData, setUserData] = useState([]);

  /*
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetchDataFromFirestore();
      setUserData(data);
    };
    fetchUserData();
  }, []);
  */

  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Financial Services Dashboard</h1>

      <div>
        {userData.map((user) => (
          <div key={user.id}>
            <h2>{user.userInfo.name}</h2>
            <p>{user.userInfo.email}</p>
          </div>
        ))}
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Our Loan Service Providers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loanProviders.map(provider => (
            <div key={provider.id} className="border p-4 rounded shadow-lg">
              <img src="/path-to-logo.jpg" alt="Logo" className="provider-logo mb-2" />
              <h3 className="text-xl font-semibold">{provider.name}</h3>
              <p className="mb-3">{provider.description}</p>
              <Link href={`/loan-request?provider=${provider.id}`} legacyBehavior>
                <a className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300">Select</a>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Our Key Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Loan Issuance Request */}
          <div className="border p-4 rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Loan Issuance Request</h3>
            <p className="mb-3">Apply for a loan quickly and easily.</p>
            <Link href="/loan-request" legacyBehavior>
              <a className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300">Go to Loan Request</a>
            </Link>
          </div>

          {/* Credit Score Evaluation */}
          <div className="border p-4 rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Credit Score Evaluation</h3>
            <p className="mb-3">Check your credit score with a single click.</p>
            <Link href="/credit-score" legacyBehavior>
              <a className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300">Evaluate Credit Score</a>
            </Link>
          </div>

          {/* Repayment Schedule */}
          <div className="border p-4 rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Repayment Schedule</h3>
            <p className="mb-3">View your repayment schedule and track your loan status.</p>
            <Link href="/repayment-schedule" legacyBehavior>
              <a className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300">View Repayment Schedule</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
