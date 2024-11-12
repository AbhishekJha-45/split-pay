import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-lg font-semibold">Wallet Wiz</span>
            <p className="text-sm mt-1">Split payments made easy</p>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="hover:text-blue-400 transition duration-150 ease-in-out"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition duration-150 ease-in-out"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition duration-150 ease-in-out"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          © {new Date().getFullYear()} Wallet Wiz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
