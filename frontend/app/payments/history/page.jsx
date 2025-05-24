"use client";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/constants";
import axios from "axios";
import Cookies from "js-cookie";
import PaymentCard from "../../../components/Card/PaymentCard";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/payments`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      setPayments(response.data.data);
    } catch (err) {
      setError("Failed to fetch payments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleMarkAsDone = async (paymentId) => {
    try {
      await axios.patch(
        `${BASE_URL}/payments/status/update/${paymentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      fetchPayments(); // Refresh the payments list
    } catch (err) {
      setError("Failed to mark payment as done. Please try again.");
    }
  };

  const handleDelete = async (paymentId) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await axios.delete(`${BASE_URL}/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        });
        fetchPayments(); // Refresh the payments list
      } catch (err) {
        setError("Failed to delete payment. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="container mx-auto p-4 my-5">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Split Payments
      </h1>
      {payments.length === 0 ? (
        <p className="text-gray-600 text-center">No payments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment) => (
            <PaymentCard
              key={payment._id}
              payment={payment}
              onMarkAsDone={handleMarkAsDone}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}