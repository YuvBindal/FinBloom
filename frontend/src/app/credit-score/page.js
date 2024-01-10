"use client";
import React, { useState } from 'react';

export default function CreditScorePage() {
  const [userId, setUserId] = useState('');
  const [creditScore, setCreditScore] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // TODO: Replace '/api/credit-score' with API endpoint
      const response = await fetch(`/api/credit-score?userId=${userId}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setCreditScore(data.creditScore); // Adjust based on API response
      } else {
        console.error('Failed to fetch credit score');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container p-4">
      <h1>Credit Score Evaluation</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <label htmlFor="userId" className="block mb-2">User ID</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID"
            className="w-full p-2"
          />
        </div>

        <button type="submit" className="p-2 bg-blue-500 text-white">Evaluate Credit Score</button>
      </form>

      {creditScore !== null && (
        <div className="mt-4">
          <h2>Your Credit Score:</h2>
          <p>{creditScore}</p>
        </div>
      )}
    </div>
  );
}