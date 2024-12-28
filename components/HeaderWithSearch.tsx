// components/Header.js
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useHeaderContext } from '../app/context/CrateContext';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
// import { cratesInfo } from '@/app/lib/all_interface';

const Header = () => {
    const router = useRouter();
    console.log('paramsssssssssssss:', router.refresh);
    const params = useParams();
    const [messageApi, contextHolder] = message.useMessage();//antd-message的hooks调用
    const [searchQuery, setSearchQuery] = useState('');
    const { crateData, setCrateData } = useHeaderContext();
    const [isOpen, setIsOpen] = useState(false);


    const [currentVersion, setCurrentVersion] = useState(params.version); // 存储当前选中的版本

    const [activeTab, setActiveTab] = useState('overview'); // 默认选中 Overview
    // console.log('pathhhhhhhhhhhhhhhhhhhhhhhhhhhh:', params);
    // 定义导航项数据
    const navItems = [
        { name: 'Overview', path: '' },
        { name: 'Dependencies', path: '/dependencies' },
        { name: 'Dependents', path: '/dependents' },
    ];


    const handleKeyPress = (e: { key: string; }) => {
        // 检查是否按下了回车键
        if (e.key === 'Enter') {
            // 如果是回车键，执行搜索
            performSearch();
        }
    };

    const performSearch = () => {
        if (!searchQuery || searchQuery.trim() === '') {

            messageApi.warning('请输入搜索内容');
            //alert("请输入搜索内容"); // 可选：提示用户输入内容
        }
        if (searchQuery.trim()) {
            // 使用 Link 跳转到搜索页面
            window.location.href = `/search?crate_name=${searchQuery}`;
        }
    };
    useEffect(() => {
        const path = params.path || ''; // 确保有值
        console.log('path:', path);
        switch (path) {
            case '':
                setActiveTab('overview');
                break;
            case 'dependencies':
                setActiveTab('dependencies');
                break;
            case 'dependents':
                setActiveTab('dependents');
                break;
            default:
                setActiveTab('overview');
                break;
        }
    }, [params.path]); // 依赖于 params.path
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
        <>
            {contextHolder}
            <header className="bg-white shadow p-4">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold flex flex-col items-start space-y-1">
                        <Link href="/">
                            <div className="text-xl font-bold flex items-center space-x-1">
                                <span style={{ color: 'rgb(57,62,70)' }}>open</span>
                                <span style={{ color: 'rgb(50,224,196)' }}>/</span>
                                <span style={{ color: 'rgb(57,62,70)' }}>source</span>
                                <span style={{ color: 'rgb(50,224,196)' }}>/</span>
                                <span style={{ color: 'rgb(57,62,70)' }}>insights</span>
                            </div>
                        </Link>
                        <div className="flex items-center space-x-2 mt-15">
                            <span className="text-2xl" style={{ color: 'rgb(28, 63, 115)' }}>{params.name}</span>
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
                                                        onClick={() => {
                                                            setCurrentVersion(version);
                                                            setActiveTab('overview'); // 更新导航条为 Overview
                                                        }}
                                                        href={`/${params.nsfront}/${params.nsbehind}/${crateData.results?.crate_name}/${version}`}
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
                            onChange={(e) => setSearchQuery(e.target.value)} // 更新搜索内容
                            onKeyDown={handleKeyPress}
                        />
                        {/* <Link href={{
                        pathname: '/homepage/search',
                        query: {
                            crate_name: searchQuery, // 将搜索内容作为参数传递给新页面
                        },
                    }}> */}
                        <button className="bg-teal-600 text-white rounded-md p-2 ml-2 hover:bg-teal-700 "
                            onClick={performSearch}
                        >
                            Search</button>
                        {/* </Link> */}
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
                                <Link href={`/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}${item.path}`}>
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
        </>

    );
};

export default Header;