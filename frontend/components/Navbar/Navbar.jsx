"use client";

import Link from "next/link";
import { useState } from "react";
import { FaWallet, FaUserFriends, FaHistory, FaCog } from "react-icons/fa";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import { FaUserLarge } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { BASE_URL } from "@/constants";
import Cookies from "js-cookie";
import axios from "axios";
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cachedUser = localStorage.getItem("user");
  const [user, setUser] = useState(cachedUser ? JSON.parse(cachedUser) : {});
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [dropDownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/payments/details", icon: FaWallet },
    { name: "Friends", href: "/friends", icon: FaUserFriends },
    { name: "History", href: "/payments/history", icon: FaHistory },
    { name: "Settings", href: "/settings", icon: FaCog },
  ];

  const handleLogout = async () => {
    const res = await axios.get(`${BASE_URL}/user/logout`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    });
    if (res.status === 200) {
      Cookies.remove("access_token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
  };
  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold">Wallet Wiz</span>
            </Link>
          </div>
          <div className="relative hidden md:flex md:items-center justify-center gap-x-3">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out"
                >
                  <item.icon className="inline-block mr-1 mb-1" />
                  {item.name}
                </Link>
              ))}
            </div>
            {user.name}
            <button
              onClick={() => setDropdownOpen(!dropDownOpen)}
              className="border rounded-full p-[0.35rem]"
            >
              <FaUserLarge />
            </button>
            {dropDownOpen && (
              <ul className="absolute -right-5 top-10 bg-[#1F2937] shadow-lg p-3">
                <li>
                  <Link
                    onClick={() => handleLogout()}
                    href={"/auth/login"}
                    className="flex items-center gap-x-2 justify-center"
                  >
                    <CiLogout />
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? (
                <RiCloseLine className="block h-6 w-6" />
              ) : (
                <RiMenuLine className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-150 ease-in-out"
                onClick={toggleMenu}
              >
                <item.icon className="inline-block mr-2 mb-1" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
