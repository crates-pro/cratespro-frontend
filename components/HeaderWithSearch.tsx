// components/Header.js
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useHeaderContext } from '../app/context/CrateContext';
import { useParams } from 'next/navigation';
// import { cratesInfo } from '@/app/lib/all_interface';

const Header = () => {
    const params = useParams();

    const [searchQuery, setSearchQuery] = useState('');
    const { crateData, setCrateData } = useHeaderContext();
    const [isOpen, setIsOpen] = useState(false);
    //const [currentVersion, setCurrentVersion] = useState<string | string[] | undefined>(); // 存储当前选中的版本

    const [currentVersion, setCurrentVersion] = useState(params.version); // 存储当前选中的版本

    const [activeTab, setActiveTab] = useState('overview'); // 默认选中 Overview
    // 定义导航项数据
    const navItems = [
        { name: 'Overview', path: '' },
        { name: 'Dependencies', path: '/dependencies' },
        { name: 'Dependents', path: '/dependents' },
    ];


    // 使用 useEffect 从 API 获取数据
    useEffect(() => {
        const fetchData = async () => {
            // 如果 crateData.results 为空，说明数据还未加载
            if (!crateData.results) {
                const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}`);
                const data = await response.json();
                console.log('dataaaaaaaaaaaaaa:', data);
                setCrateData({
                    crateName: data.crate_name,
                    crateVersion: params.version,
                    results: data,
                });

            }
        };

        fetchData();
    }, [params.nsfront, params.nsbehind, params.name, params.version, setCrateData, crateData.crateVersion, crateData.results]); // 添加 crateData 作为依赖项

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const closeDropdown = () => {
        setIsOpen(false);

    };





    return (
        <header className="bg-white shadow p-4">
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold flex flex-col items-start space-y-1">
                    <Link href="/homepage">
                        <div className="flex items-center space-x-1">
                            <span>open</span>
                            <span className="text-green-500">/</span>
                            <span>source</span>
                            <span className="text-green-500">/</span>
                            <span>insights</span>
                        </div>
                    </Link>
                    <div className="flex items-center space-x-2 mt-15">
                        <span>{params.name}</span>
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                {/* {crateData.crateVersion || 'Select Version'} */}
                                {currentVersion || 'Select Version'}
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
                            {isOpen && (
                                <div className="absolute mt-1 w-full">
                                    <div className="absolute inset-0 bg-black opacity-50" onClick={closeDropdown}></div>
                                    <div className="relative bg-white border border-gray-300 rounded shadow-lg z-20">
                                        <ul className="max-h-60 overflow-y-auto">
                                            {crateData.results?.versions.map((version, index) => (
                                                <Link
                                                    key={index}
                                                    onClick={() => setCurrentVersion(version)}
                                                    href={`/homepage/${params.nsfront}/${params.nsbehind}/${crateData.results?.crate_name}/${version}`}
                                                >
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">

                                                        {version}

                                                    </li>
                                                </Link>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search for open source crates"
                        className="p-2 border-none rounded-md text-gray-800 w-80 max-w-2xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Link href={{
                        pathname: '/homepage/search',
                        query: { crate_name: searchQuery },
                    }}>
                        <button className="bg-teal-600 text-white rounded-md p-2 ml-2 hover:bg-teal-700">Search</button>
                    </Link>
                </div>
            </div>
            <nav className="mt-4">
                <ul className="flex space-x-4 text-gray-500 relative">
                    {navItems.map((item) => (
                        <li
                            key={item.name}
                            className="cursor-pointer relative"
                            onClick={() => setActiveTab(item.name.toLowerCase())} // 设置当前选中的导航项
                        >
                            <Link href={`/homepage/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}${item.path}`}>
                                <div className={`block py-2 relative z-10 ${activeTab === item.name.toLowerCase() ? 'text-blue-500' : ''}`}>
                                    {item.name}
                                </div>
                            </Link>
                            {activeTab === item.name.toLowerCase() && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Header;