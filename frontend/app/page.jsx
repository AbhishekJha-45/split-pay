"use client";

import "@/styles/globals.css";
import { BASE_URL } from "@/constants";
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function SplitPayment() {
  const router = useRouter();

  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const accessToken = Cookies.get("access_token");

    if (!user || !accessToken) {
      router.push("/auth/login");
    } else {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/user/list-users`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setAllUsers(response.data.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/category`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      !selectedUsers.some((selectedUser) => selectedUser._id === user._id) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchTerm("");
  };

  const handleRemoveUser = (user_id) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== user_id));
  };

  const splitAmount = useMemo(() => {
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || selectedUsers.length === 0) return 0;
    return (amount / (selectedUsers.length + 1)).toFixed(2);
  }, [totalAmount, selectedUsers]);

  const handleSubmit = async () => {
    const paymentData = {
      amount: parseFloat(totalAmount),
      note,
      category: selectedCategory,
      users: [
        ...selectedUsers.map((user) => user._id),
        JSON.parse(localStorage.getItem("user"))._id,
      ],
    };

    try {
      const res = await axios.post(`${BASE_URL}/payments`, paymentData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      if (res.status === 201) {
        alert("Payment Split Successfully");
      }
    } catch (error) {
      console.error("Error splitting payment:", error);
      alert("Failed to split payment. Please try again.");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) {
      alert("Please enter a category name");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/category`,
        {
          name: newCategoryName,
          description: newCategoryDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );

      if (res.status === 201) {
        alert("Category added successfully");
        setNewCategoryName("");
        setNewCategoryDescription("");
        setIsAddingCategory(false);
        fetchCategories();
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 my-5 max-w-2xl">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Split Payment</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="total-amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Total Amount
              </label>
              <input
                id="total-amount"
                type="number"
                placeholder="Enter total amount"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="note"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Note
              </label>
              <input
                id="note"
                placeholder="Add a note for this payment"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <div className="flex items-center space-x-2">
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsAddingCategory(true)}
                  className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  +
                </button>
              </div>
            </div>
            {isAddingCategory && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Category description (optional)"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Category
                  </button>
                  <button
                    onClick={() => setIsAddingCategory(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div>
              <label
                htmlFor="user-search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Add People to Split With
              </label>
              <input
                id="user-search"
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {searchTerm && (
              <div className="max-h-72 overflow-y-auto border border-gray-300 rounded-md">
                {filteredUsers.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {user.name[0]}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Selected Users</h3>
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(user._id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-4 text-lg font-semibold">
              Split Amount: ₹{splitAmount} per person (including you)
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Split Payment
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}