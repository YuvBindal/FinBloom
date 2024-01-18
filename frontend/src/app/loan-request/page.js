"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  query,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { UserAuth } from "../utils/auth-helper";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getLedgerIndex } from "xrpl/dist/npm/sugar";

const backendURL = "https://bloomfinbackend.onrender.com";
// const backendURL = "http://127.0.0.1:8000";

export default function LoanRequestPage() {
  const [user, setUser] = useState(null);
  const [loanDependents, setLoanDependents] = useState("");
  const [loanEducation, setLoanEducation] = useState("");
  const [loanEmployment, setLoanEmployment] = useState("");
  const [loanAnnualIncome, setLoanAnnualIncome] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanYears, setLoanYears] = useState("");
  const [cibilScore, setCibilScore] = useState("");
  const [cAssetValues, setCAssetValues] = useState("");
  const [rAssetValues, setRAssetValues] = useState("");
  const [lAssetValues, setLAssetValues] = useState("");
  const [bAssetValues, setBAssetValuess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loanRequest, setLoanRequest] = useState({});
  const [userEligibility, setUserEligiblity] = useState(false);
  const [llmResponse, setLLMResponse] = useState(
    "Loading the calculated financing amount and repayment schedule based on your details!"
  );
  const [llmResponseSuccess, setLLMResponseSuccess] = useState(false);
  const [walletID, setWalletID] = useState("");
  const [destinationWalletID, setDestinationWalletID] = useState("");
  const [showFundsConfirmation, setFundsConfirmation] = useState(false);
  const [xrpRate, setXrpRate] = useState(1);
  const [loanDate, setLoanDate] = useState("");
  const [repaymentDate, setRepaymentDate] = useState("");
  const [previousLoans, setPreviousLoans] = useState([]);
  const [walletBalance, setWalletBalance] = useState(6616860000);
  const [walletObjs, setWalletObjs] = useState([]);
  const [loader, setLoader] = useState(false);

  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      setUser(user);
      // ...
    } else {
      // User is signed out
      // ...
      console.log("user not found");
      setUser(null);
    }
  });

  useEffect(() => {
    if (!router.isReady || !user) {
      return;
    }

    // Fetch previous loan requests from Firestore
    const fetchPreviousLoans = async () => {
      const q = query(collection(db, "users", user.uid, "loans"));
      try {
        const querySnapshot = await getDocs(q);
        const loans = querySnapshot.docs.map((doc) => doc.data());
        setPreviousLoans(loans);
      } catch (error) {
        console.error("Error fetching loans from Firestore:", error);
      }
    };

    fetchPreviousLoans();
  }, [router.isReady, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    //if (!user) return; // Ensure user is logged in

    try {
      const userEmail = user.email;
      const loanId = `loan${Math.random().toString(16).slice(2)}`;
      const currentDate = new Date();

      const combinedId = loanId + "-" + userEmail + "-" + currentDate;
      const loanData = {
        loanId: loanId,
        isEligible: true,
        takenAmount: parseFloat(loanAmount),
        repaymentAmount: parseFloat(loanAmount) * 1.1,
        dateDue: repaymentDate,
        dateTaken: loanDate,
        repayed: false,
      };
      console.log(user.email);

      setLoanRequest({
        loan_id: Math.floor(Math.random() * 1000).toString(),
        no_of_dependents: loanDependents,
        education: loanEducation,
        self_employed: loanEmployment,
        income_annum: loanAnnualIncome,
        loan_amount: loanAmount,
        loan_term: loanYears,
        cibil_score: cibilScore,
        residential_assets_value: rAssetValues,
        commercial_assets_value: cAssetValues,
        luxury_assets_value: lAssetValues,
        bank_asset_value: bAssetValues,
      });
      const loanRequestWithDefaults = Object.fromEntries(
        Object.entries(loanRequest).map(([key, value]) => {
          // Check if the value is empty (i.e., an empty string or undefined)
          // and set it to 0 if it's empty
          return [key, value === "" || value === undefined ? 0 : value];
        })
      );

      await setDoc(
        doc(db, "loan_requests", combinedId),
        loanRequestWithDefaults
      );
      setShowForm(true);
      //await addDoc(collection(db, "users", user.uid, "loans"), loanData);
    } catch (error) {
      console.error("Error submitting loan to Firestore:", error);
    }
  };

  const handleEligibleSubmission = async (e) => {
    e.preventDefault();
    try {
      //1. run the ml model for eligib
      // Make a POST request to the /eligible endpoint
      const response = await fetch(backendURL + "/eligible", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loanRequest),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Eligibility result:", result);
        console.log(result.is_eligible);
        setUserEligiblity(result.is_eligible);
        // Handle the result as needed
      } else {
        console.error("Error:", response.statusText);
        // Handle error response
      }
    } catch (error) {
      console.error("Error submitting eligiblity request: ", error);
    }
  };

  //Migrated xrpl-py code to xrpl-js onto the frontend as FastAPI is incompatible with xrpl-py due to asynchronous errors.
  async function generate_wallets_and_transaction() {
    setLoader(true);
    if (!showFundsConfirmation) {
      const xrpl = require("xrpl"); // Dependency xrpl required
      const api = new xrpl.Client("wss://s.altnet.rippletest.net:51233"); // Testnet connection

      try {
        await api.connect();

        // Calculate the amount that needs to be sent first
        const LoanAmountInDrops = Math.floor(+loanAmount * xrpRate * 1_000_000);

        // Wallet generation
        const userWalletObj = await api.fundWallet();
        const destinationWalletObj = await api.fundWallet();

        const userWallet = userWalletObj.wallet;
        const destinationWallet = destinationWalletObj.wallet;

        setWalletID(userWallet.classicAddress); // Setting wallet addresses on UI interface
        setDestinationWalletID(destinationWallet.classicAddress);

        // Preparing transaction
        const preparedTransaction = await api.autofill({
          TransactionType: "Payment",
          Account: userWallet.classicAddress,
          Amount: xrpl.xrpToDrops(LoanAmountInDrops.toString()),
          Destination: destinationWallet.classicAddress,
        });

        console.log(preparedTransaction);

        // Sign the transaction
        const signedTransaction = userWallet.sign(preparedTransaction);
        console.log(signedTransaction);

        // Submit the transaction
        const results = await api.submitAndWait(signedTransaction.tx_blob);
        console.log(results);
        setWalletBalance(LoanAmountInDrops);
        setFundsConfirmation(true);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoader(false);
      }
    } else {
      console.log("your transaction has already been sent!");
      setLoader(false);
    }
  }

  const handleWallets = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(backendURL + "/wallets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // Handle the result as needed
      } else {
        console.error("Error:", response.statusText);
        // Handle error response
      }
    } catch (error) {
      console.error("Error submitting wallets request: ", error);
    }
  };

  const handleLLMResponse = async (e) => {
    e.preventDefault();
    try {
      //1. run the ml model for eligib
      // Make a POST request to the /eligible endpoint

      const userProfile = {
        no_of_dependents: loanDependents,
        education: loanEducation,
        self_employed: loanEmployment,
        income_annum: loanAnnualIncome,
        loan_term: loanYears,
        cibil_score: cibilScore,
        residential_assets_value: rAssetValues,
        commercial_assets_value: cAssetValues,
        luxury_assets_value: lAssetValues,
        bank_asset_value: bAssetValues,
      };

      const response = await fetch(backendURL + "/llm_prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfile),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setLLMResponse(result);
        setLLMResponseSuccess(true);
        // Handle the result as needed
      } else {
        console.error("Error:", response.statusText);
        // Handle error response
      }
    } catch (error) {
      console.error("Error submitting llm request: ", error);
    }

    try {
      const response = await fetch(backendURL + "/xrp_rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setXrpRate(result);
        // Handle the result as needed
      } else {
        console.error("Error:", response.statusText);
        // Handle error response
      }
    } catch (error) {
      console.error("Error submitting xrp rate request:");
    }
  };

  const handleConfirmationMessage = async (e) => {
    setFundsConfirmation(true);
  };

  return (
    <div className="container mx-auto p-4 flex flex-wrap justify-between">
      {/* Loan Issuance Request Section */}
      <div className="w-full lg:w-1/2 p-4 bg-black text-white">
        <h1 className="text-3xl font-bold mb-6 border-b-2 border-white pb-2">
          Loan Issuance Request
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Number of Dependents */}
          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="loanDependents" className="block font-medium mb-2">
              Number of Dependents
            </label>
            <input
              type="number"
              id="loanDependents"
              value={loanDependents}
              onChange={(e) => setLoanDependents(e.target.value)}
              placeholder="If none enter 0"
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="loanEducation" className="block mb-2">
              Set Your Education Level
            </label>
            <input
              type="number"
              id="loanEducation"
              value={loanEducation}
              onChange={(e) => setLoanEducation(e.target.value)}
              placeholder="Enter 0/1 if not graduate/graduate respectively"
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="loanEmployment" className="block mb-2">
              Set Your Self-Employed Status
            </label>
            <input
              type="number"
              id="loanEmployment"
              value={loanEmployment}
              onChange={(e) => setLoanEmployment(e.target.value)}
              placeholder="Enter 0/1 if not/is self-employed respectively"
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="loanAnnualIncome" className="block mb-2">
              Enter Your Annual Income
            </label>
            <input
              type="number"
              id="loanAnnualIncome"
              value={loanAnnualIncome}
              onChange={(e) => setLoanAnnualIncome(e.target.value)}
              placeholder="Enter your annual income in SGD"
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="loanAmount" className="block mb-2">
              Loan Amount
            </label>
            <input
              type="number"
              id="loanAmount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter loan amount"
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="loanDate" className="block mb-2">
              Preferred Date of Loan
            </label>
            <input
              type="date"
              id="loanDate"
              value={loanDate}
              onChange={(e) => setLoanDate(e.target.value)}
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="repaymentDate" className="block mb-2">
              Preferred Maturity/Termination Date of Loan
            </label>
            <input
              type="date"
              id="repaymentDate"
              value={repaymentDate}
              onChange={(e) => setRepaymentDate(e.target.value)}
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="loanYears" className="block mb-2">
              Total Repayment Years of Loan
            </label>
            <input
              type="number"
              id="loanYears"
              value={loanYears}
              onChange={(e) => setLoanYears(e.target.value)}
              placeholder="Enter Loan Years"
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="cibilScore" className="block mb-2">
              Cibil Score
            </label>
            <input
              type="number"
              id="cibilScore"
              value={cibilScore}
              onChange={(e) => setCibilScore(e.target.value)}
              placeholder="Between 300 to 900, if not available enter 0"
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="rAssetValues" className="block mb-2">
              Residential Asset Values
            </label>
            <input
              type="number"
              id="rAssetValues"
              value={rAssetValues}
              onChange={(e) => setRAssetValues(e.target.value)}
              placeholder="Between 300 to 900, if not available enter 0"
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="cAssetValues" className="block mb-2">
              Commerical Asset Values
            </label>
            <input
              type="number"
              id="cAssetValues"
              value={cAssetValues}
              onChange={(e) => setCAssetValues(e.target.value)}
              placeholder="Properties such as shops, amount in SGD. Enter 0 if none."
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="lAssetValues" className="block mb-2">
              Luxury Asset Values
            </label>
            <input
              type="number"
              id="lAssetValues"
              value={lAssetValues}
              onChange={(e) => setLAssetValues(e.target.value)}
              placeholder="Fine art, paintings, jewelry, amount in SGD. Enter 0 if none"
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-4 p-4 border-2 border-white rounded-lg">
            <label htmlFor="bAssetValues" className="block mb-2">
              Current Bank Balance
            </label>
            <input
              type="number"
              id="bAssetValues"
              value={bAssetValues}
              onChange={(e) => setBAssetValuess(e.target.value)}
              placeholder="Amount in your bank account, in SGD. Enter 0 if none"
              className="w-full p-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
          >
            Submit Request
          </button>
        </form>
      </div>

      {/* Loan Eligibility Checker Section */}
      <div className="w-full lg:w-1/2 p-4 bg-black text-white overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 border-b-2 border-white pb-2">
          Loan Eligibility Checker
        </h1>
        <div>
          {showForm && (
            <div className="space-y-4">
              <form
                onSubmit={handleEligibleSubmission}
                className="p-4 border-2 border-white rounded-lg overflow-auto"
              >
                <p className="font-medium">Current Loan Request</p>
                <pre className="bg-gray-800 p-3 rounded-md overflow-x-auto">
                  {JSON.stringify(loanRequest, null, 2)}
                </pre>

                <p className="font-medium">
                  Eligibility Status:{" "}
                  {userEligibility
                    ? "You are eligible, now please check your eligibility details"
                    : "You are not eligible/or have not submitted an evaluation request"}
                </p>
                <button
                  type="submit"
                  className="w-full p-3 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
                >
                  Submit Evaluation
                </button>
                {userEligibility && (
                  <div className="space-y-4 mt-4">
                    <button
                      type="button"
                      className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150 ease-in-out"
                      onClick={handleLLMResponse}
                    >
                      Check Microloan Details!
                    </button>
                    <pre className="bg-gray-800 p-3 rounded-md whitespace-pre-wrap">
                      {JSON.stringify(llmResponse, null, 2)}
                    </pre>
                    <p>
                      If you agree with these terms, please generate a walletID
                      to transfer your funds on the XRPL Chain.
                    </p>
                    {llmResponseSuccess && (
                      <p>
                        The current exchange rate for 1 SGD ={" "}
                        {JSON.stringify(xrpRate, null, 2)} XRP
                      </p>
                    )}

                    <p>Your Wallet ID: {JSON.stringify(walletID, null, 2)}</p>
                    <p>
                      Lender Wallet ID:{" "}
                      {JSON.stringify(destinationWalletID, null, 2)}
                    </p>

                    <button
                      type="button"
                      className={`w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150 ease-in-out ${
                        loader ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={generate_wallets_and_transaction}
                      disabled={loader}
                    >
                      Confirm Loan and Transfer Funds!
                    </button>
                    {showFundsConfirmation && (
                      <div className="mt-4">
                        <p>
                          Congratulations on the loan! Your funds have been
                          successfully transferred.
                        </p>
                        <p>
                          Your wallet balance is XRP:{" "}
                          {JSON.stringify(walletBalance / 1_000_000, null, 2)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Spinner */}
      {loader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="spinner"></div>
          <div className="text-white ml-4">Processing your transaction...</div>
        </div>
      )}
    </div>
  );
}

/*
<div className="w-1/2 p-4">
        <h2>Previous Loan Requests</h2>
        <ul>
          {previousLoans.map((loan, index) => (
            <li key={index}>
              Amount: {loan.amount}, Date Taken: {loan.dateTaken}, Repayment
              Date: {loan.dateDue}
            </li>
          ))}
        </ul>
      </div>
*/
