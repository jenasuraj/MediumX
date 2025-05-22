import React from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-15 px-5">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Logo & Description */}
                <div className="text-center md:text-left">
                    <h1 className="text-2xl font-extrabold tracking-wide">MediumX</h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Explore, write & publish trends in AI and technology.
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="flex space-x-6 mt-6 md:mt-0">
                    <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                        Home
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                        About
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                        Blog
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                        Contact
                    </a>
                </div>

                {/* Social Media Links */}
                <div className="flex space-x-5 mt-6 md:mt-0">
                    <a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300 text-2xl">
                        <FaTwitter />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-blue-600 transition duration-300 text-2xl">
                        <FaLinkedin />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-gray-500 transition duration-300 text-2xl">
                        <FaGithub />
                    </a>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-700 mt-8 pt-5 text-center text-gray-400 text-sm">
                © {new Date().getFullYear()} MediumX. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
