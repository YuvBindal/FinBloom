"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const loanProviders = [
  {
    name: "Provider 1",
    description: "Provider 1 is a global financial services firm and a market leader in investment banking, securities, investment management and consumer banking.",
    id: "provider1",
    imgUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Provider 2",
    description: "Provider 2 is a leading global financial services firm with assets of $2.8 trillion and operations worldwide. The firm is a leader in investment banking, financial services for consumers and small businesses, commercial banking, financial transaction processing, and asset management.",
    id: "provider2",
    imgUrl: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // ... more providers
];

const Card = ({ title, description, link, imgUrl, buttonLabel }) => {
  return (
    <div className="p-4">
      <div className="flex items-stretch justify-between gap-4 rounded-xl">
        <div className="flex flex-[2_2_0px] flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-white text-base font-bold leading-tight">{title}</p>
            <p className="text-[#93adc8] text-sm font-normal leading-normal">{description}</p>
          </div>
          <Link href={link}>
            <div className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#243647] text-white text-sm font-medium leading-normal w-fit">
              <span className="truncate">{buttonLabel}</span>
            </div>
          </Link>
        </div>
        <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1" style={{ backgroundImage: `url(${imgUrl})` }}></div>
      </div>
    </div>
  );
};

const LoanProvider = ({ provider }) => {
  return (
    <div className="p-4">
      <div className="flex flex-row items-start justify-start rounded-xl">
        <div className="w-full max-w-xs bg-center bg-no-repeat aspect-video bg-cover rounded-xl" style={{ backgroundImage: `url(${provider.imgUrl})` }}></div>
        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 px-4">
          <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">{provider.name}</p>
          <div className="flex items-end gap-3 justify-between">
            <p className="text-[#93adc8] text-base font-normal leading-normal">{provider.description}</p>
            <Link href={`/loan-request?provider=${provider.id}`}>
              <div className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#1466b8] text-white text-sm font-medium leading-normal">
                <span className="truncate">Select</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
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
    <>
      <div className="relative flex min-h-screen flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}>
        <div className="flex h-full grow flex-col w-full">
          <div className="flex flex-1 justify-center py-5 w-full">
            <div className="flex flex-col w-full px-4">
              <h2 className="text-white tracking-light text-[28px] font-bold leading-tight text-center pb-3 pt-5">Welcome to Our Financial Services Dashboard</h2>
              <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">Our Loan Service Providers</h3>
              {loanProviders.map((provider) => (
                <LoanProvider key={provider.id} provider={provider} />
              ))}
              <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">Our Key Services</h3>
              <Card
                title="Loan Issuance Request"
                description="Get started on your loan application"
                link="/loan-request"
                imgUrl="https://plus.unsplash.com/premium_photo-1680396766429-ccfb5626a40d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                buttonLabel="Start"
              />
              <Card
                title="Loan Request History"
                description="Check your loan request history"
                link="/loan-request-history"
                imgUrl="https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                buttonLabel="Check"
              />
              <Card
                title="Repayment Schedule"
                description="View your loan repayment schedule"
                link="/repayment-schedule"
                imgUrl="https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                buttonLabel="View"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
