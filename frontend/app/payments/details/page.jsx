"use client";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/constants";
import axios from "axios";
import Cookies from "js-cookie";

const UserPaymentCard = ({ user }) => (
  <div className="my-6 bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
    <div className="bg-gradient-to-r from-teal-500 to-green-600 p-4">
      <h2 className="text-xl font-semibold text-white">{user.name}</h2>
    </div>
    <div className="p-4">
      <p className="text-2xl font-bold text-gray-800">
        ₹{user.amount.toFixed(2)}
      </p>
    </div>
  </div>
);

export default function PaymentAnalysis() {
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaymentAnalysis = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/payments/payments-detail`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      setPaymentData(response.data.data);
    } catch (err) {
      setError("Failed to fetch payment analysis. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentAnalysis();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Payment Analysis
      </h1>
      {paymentData && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Total Amount to Pay
          </h2>
          <p className="text-4xl font-bold text-teal-600">
            ₹{paymentData.totalAmountToPay.toFixed(2)}
          </p>
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Users to Pay
      </h2>
      {paymentData && paymentData.usersToPay.length === 0 ? (
        <p className="text-gray-600 text-center">
          No users to pay at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentData &&
            paymentData.usersToPay.map((user) => (
              <UserPaymentCard key={user.userId} user={user} />
            ))}
        </div>
      )}
    </div>
  );
}
