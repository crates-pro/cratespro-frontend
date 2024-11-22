import React from 'react';
import Link from 'next/link';
const CratePage = () => {
    // Other code

    return (
        <div>
            {/* Existing header and search */}
            <header className="bg-white shadow p-4">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold flex flex-col items-start space-y-1">
                        <div className="flex items-center space-x-1">
                            <span>open</span>
                            <span className="text-green-500">/</span>
                            <span>source</span>
                            <span className="text-green-500">/</span>
                            <span>insights</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-15">
                            <span>tokio</span>
                            <div className="relative">
                                <button className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                                    1.41.1
                                    <svg
                                        className="ml-2 w-4 h-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {/* 这里可以添加版本选择的下拉菜单 */}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            className="p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search..."
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                            Search
                        </button>
                    </div>
                </div>

                <nav className="mt-4">
                    <ul className="flex space-x-4 text-gray-500 relative">
                        <li className="cursor-pointer relative">
                            <Link href="/homepage/search/ad">
                                <div className="block py-2 relative z-10">Overview</div>
                            </Link>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>
                        </li>
                        <li className="cursor-pointer relative">
                            <Link href="/homepage/search/ad/dependencies">
                                <div className="block py-2 relative z-10">Dependencies</div>
                            </Link>

                        </li>
                        <li className="cursor-pointer relative">
                            <a href="#" className="block py-2 relative z-10">Dependents</a>
                        </li>
                        <li className="cursor-pointer relative">
                            <a href="#" className="block py-2 relative z-10">Compare</a>
                        </li>
                        <li className="cursor-pointer relative">
                            <a href="#" className="block py-2 relative z-10">Versions</a>
                        </li>
                    </ul>
                </nav>
            </header>



        </div>
    );
};

export default CratePage;