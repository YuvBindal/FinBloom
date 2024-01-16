"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const loanProviders = [
  {
    name: "Provider 1",
    description: "Description of Provider 1",
    id: "provider1",
  },
  {
    name: "Provider 2",
    description: "Description of Provider 2",
    id: "provider2",
  },
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
const Card = ({ title, description, link }) => {
  return (
    <article
      className="w-full flex flex-col items-center justify-between rounded-2xl rounded-br-2xl
    border border-solid border-dark bg-light shadow-2xl p-8 relative
    "
    >
      <div className="w-full flex flex-col items-start justify-between mt-0">
        <Link href={link} legacyBehavior>
          <a className="hover:underline underline-offset-5">
            <h2 className="my-6 w-full text-left text-3xl font-bold dark:text-light">
              {title}
            </h2>
          </a>
        </Link>
        <p className="mt-0 mb-12 text-m text-dark dark:text-light">
          {description}
        </p>
        <div className="mt-8 flex items-center">
          <Link href={link} legacyBehavior>
            <a
              className="absolute bottom-5 right-5 left-5  rounded-lg p-2 px-6 text-lg font-semibold bg-dark 
              text-light border-[2px] dark:text-dark dark:bg-light hover:dark:bg-dark
               hover:dark:text-cyan-500 hover:dark:border-cyan-500 hover:border-[3px]
            "
            >
              Go to {title}
            </a>
          </Link>
        </div>
      </div>
    </article>
  );
};

const LoanProvider = ({ provider }) => {
  return (
    <div
      key={provider.id}
      className="border-2 border-gray-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col items-center justify-center"
    >
      <img
        src="/path-to-logo.jpg"
        alt="Logo"
        className="provider-logo mb-4 w-20 h-8 object-cover rounded-full mx-auto shadow"
      />
      <h3 className="text-2xl font-bold text-gray-400 mb-2 text-center">
        {provider.name}
      </h3>
      <p className="text-gray-400 text-center">{provider.description}</p>
      <Link href={`/loan-request?provider=${provider.id}`} legacyBehavior>
        <a
          className="mt-4 inline-block border-[2px] text-white
           py-2 px-4 rounded hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors duration-200"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Select
        </a>
      </Link>
    </div>
  );
};

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
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Our Financial Services Dashboard
      </h1>

      <div>
        {userData.map((user) => (
          <div key={user.id}>
            <h2>{user.userInfo.name}</h2>
            <p>{user.userInfo.email}</p>
          </div>
        ))}
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">
          Our Loan Service Providers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loanProviders.map((provider) => (
            <LoanProvider key={provider.id} provider={provider} />
          ))}
        </div>
      </div>

      {/* Flex Grid */}
      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">
          Explore Our Financial Solutions
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Card
            title="Loan Issuance Request"
            description="Apply for a loan quickly and easily."
            link="/loan-request"
          />
          <Card
            title="Credit Score Evaluation"
            description="Check your credit score."
            link="/credit-score"
          />
          <Card
            title="Repayment Schedule"
            description="View your repayment schedule and track your loan status."
            link="/repayment-schedule"
          />
        </div>
      </div>
    </div>
  );
}
