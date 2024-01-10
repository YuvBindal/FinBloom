"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, collection, addDoc, query, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { UserAuth } from "../utils/auth-helper";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

  const [loanDate, setLoanDate] = useState("");
  const [repaymentDate, setRepaymentDate] = useState("");
  const [previousLoans, setPreviousLoans] = useState([]);

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
      console.log("user not found")
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
      const loanId = `loan${Math.random().toString(16).slice(2)}`;
      const loanData = {
        loanId: loanId,
        isEligible: true,
        takenAmount: parseFloat(loanAmount),
        repaymentAmount: parseFloat(loanAmount) * 1.1,
        dateDue: repaymentDate,
        dateTaken: loanDate,
        repayed: false,
      };

      setLoanRequest({
        loan_id: loanId,
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
        email: user.email,
      });

      const loanRequestWithDefaults = Object.fromEntries(
        Object.entries(loanRequest).map(([key, value]) => {
          // Check if the value is empty (i.e., an empty string or undefined)
          // and set it to 0 if it's empty
          return [key, value === '' || value === undefined ? 0 : value];
        })
      );

      
      await setDoc(doc(db, "loan_requests", loanId), loanRequest);
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
      const response = await fetch('http://127.0.0.1:8000/eligible', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'hi',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Eligibility result:', result);
        // Handle the result as needed
      } else {
        console.error('Error:', response.statusText);
        // Handle error response
      }

    } catch (error) {
      console.error("Error submitting eligiblity request: ", error)
    }
  }

  return (
    <div className="container flex">
      <div className="w-1/2 p-4">
        <h1><strong>Loan Issuance Request</strong></h1>
        <form onSubmit={handleSubmit} style={{ color: "black" }}>
        <div className="form-group mb-4">
            <label
              htmlFor="loanDependents"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Number of dependents
            </label>
            <input
              type="number"
              id="loanDependents"
              value={loanDependents}
              onChange={(e) => setLoanDependents(e.target.value)}
              placeholder="If none enter 0"
              className="w-full p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="loanEducation"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Set your education level
            </label>
            <input
              type="number"
              id="loanEducation"
              value={loanEducation}
              onChange={(e) => setLoanEducation(e.target.value)}
              placeholder="Enter 0/1 if not graduate/graduate respectively"
              className="w-full p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="loanEmployment"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Set your self-employed status
            </label>
            <input
              type="number"
              id="loanEmployment"
              value={loanEmployment}
              onChange={(e) => setLoanEmployment(e.target.value)}
              placeholder="Enter 0/1 if not/is self-employed respectively"
              className="w-full p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="loanAnnualIncome"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Enter your annual income
            </label>
            <input
              type="number"
              id="loanAnnualIncome"
              value={loanAnnualIncome}
              onChange={(e) => setLoanAnnualIncome(e.target.value)}
              placeholder="Values in SGD"
              className="w-full p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="loanAmount"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Loan Amount
            </label>
            <input
              type="number"
              id="loanAmount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter loan amount"
              className="w-full p-2"
            />
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="loanDate"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Preferred Date of Loan
            </label>
            <input
              type="date"
              id="loanDate"
              value={loanDate}
              onChange={(e) => setLoanDate(e.target.value)}
              className="w-full p-2"
            />
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="repaymentDate"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Preferred Maturity/Termination Date of Loan
            </label>
            <input
              type="date"
              id="repaymentDate"
              value={repaymentDate}
              onChange={(e) => setRepaymentDate(e.target.value)}
              className="w-full p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="loanYears"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Total Repayment Years of Loan
            </label>
            <input
              type="number"
              id="loanYears"
              value={loanYears}
              onChange={(e) => setLoanYears(e.target.value)}
              placeholder="Enter Loan Years"
              className="w-full p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="cibilScore"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Cibil Score
            </label>
            <input
              type="number"
              id="loanYears"
              value={cibilScore}
              onChange={(e) => setCibilScore(e.target.value)}
              placeholder="Between 300 to 900, if not available enter 0"
              className="w-full p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="rAssetValues"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Residential Asset Values
            </label>
            <input
              type="number"
              id="rAssetValues"
              value={rAssetValues}
              onChange={(e) => setRAssetValues(e.target.value)}
              placeholder="Properties such as houses, amount in SGD. Enter 0 if none"
              className="w-full p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="cAssetValues"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Commerical Asset Values
            </label>
            <input
              type="number"
              id="cAssetValues"
              value={cAssetValues}
              onChange={(e) => setCAssetValues(e.target.value)}
              placeholder="Properties such as shops, amount in SGD. Enter 0 if none."
              className="w-full p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="lAssetValues"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Luxury Asset Values
            </label>
            <input
              type="number"
              id="lAssetValues"
              value={lAssetValues}
              onChange={(e) => setLAssetValues(e.target.value)}
              placeholder="Fine art, paintings, jewelery, amount in SGD. Enter 0 if none"
              className="w-full p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="bAssetValues"
              className="block mb-2"
              style={{ color: "white" }}
            >
              Current Bank Balance
            </label>
            <input
              type="number"
              id="bAssetValues"
              value={bAssetValues}
              onChange={(e) => setBAssetValuess(e.target.value)}
              placeholder="Amount in your bank account, in SGD. Enter 0 if none"
              className="w-full p-2"
            />
          </div>
          <button type="submit" className="p-2 bg-blue-500 text-white">
            Submit Request
          </button>
        </form>
      </div>
      
      
      
      <div className="w-1/2 p-4">
        <h1><strong>Loan Eligiblity Checker</strong></h1>
        <div>
          {showForm && (
          <form onSubmit={handleEligibleSubmission}>
            <p>Current Loan Request</p>
            <pre>{JSON.stringify(loanRequest, null, 2)}</pre>
            <p>Eligibility Status: {userEligibility ? "You are eligible, now please check your eligibility details": "You are not eligible/or have not submitted an evaluation request"}</p>
            <button type="submit" className="p-2 bg-blue-500 text-white">
              Submit Evaluation
            </button>
          </form>
          )}
        </div>


      </div>
      
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