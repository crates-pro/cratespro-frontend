'use client';
import React, { useState } from 'react';
import '@/app/ui/global.css';
import Link from 'next/link';
// import VulnerabilityList from '@/components/CveList';
import { message } from 'antd';
import Image from 'next/image';
import SignIn from '@/components/sign-in';
import { SessionProvider } from "next-auth/react"


const HomePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [messageApi, contextHolder] = message.useMessage();//antd-message的hooks调用
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
            //test for review
            //alert("请输入搜索内容"); // 可选：提示用户输入内容
        }
        if (searchQuery.trim()) {
            // 使用 Link 跳转到搜索页面
            window.location.href = `/search?crate_name=${searchQuery}`;
        }
    };
    console.log("test for build 1111111111111");


    return (
        //绿色渐变
        <>
            {contextHolder}
            < div className=" min-h-screen bg-gray-900 text-white" >
                <header className="flex bg-teal-500 p-4 flex justify-between items-center">
                    <Link href="/">
                        <div className="flex items-center space-x-1">  {/* items-center 确保垂直居中，space-x-4 添加间距 */}
                            <div className="text-3xl font-bold">CratesPro</div>
                            <div className="flex justify-center">
                                <Image className="w-20 object-contain" src="/rust.svg" alt="Rust Logo"
                                    width={200}
                                    height={200} />
                                {/* <img className="w-20 object-contain" src="/rust.svg" alt="Rust Logo" /> */}
                            </div>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <ul className="flex space-x-5">
                            <li><a href="#" className="hover:underline">About</a></li>
                            <li><a href="#" className="hover:underline">Documentation</a></li>
                            <li><a href="#" className="hover:underline">Blog</a></li>
                        </ul>
                        <SessionProvider>
                            <SignIn />
                        </SessionProvider>
                    </nav>
                </header>
                {/* 搜索部分 */}
                <div className="flex flex-col items-center justify-center h-80 bg-gradient-to-b from-teal-500 to-gray-800">
                    <h1 className="text-4xl font-bold mb-4 ">CratesPro - Rust Crate Analysis and Recommendation Platform</h1>
                    <p className="text-center mb-4">CratesPro is a sophisticated platform designed to analyze and evaluate Rust crates.</p>
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


                {/* 分割线部分 */}
                <div className="flex border-t-4 border-green-500 h-1/4"></div>

                {/* <VulnerabilityList /> */}


                {/* 一些介绍 */}
                <div className="relative container mx-auto p-10">
                    <div className="flex justify-center">
                        {/* <img className="w-1/2 object-cover rounded-t" src="/image.png" alt="Overview" /> */}
                    </div>
                    <div className="bg-gray-800 p-5 mb-6 rounded shadow-md">
                        <h2 className="text-2xl font-semibold">AI-Powered Multi-Dimensional Analysis</h2>
                        <p className="mt-2">CratesPro leverages advanced AI models to provide in-depth, multi-dimensional analysis of Rust crates. By analyzing a variety of data points—including code structure, dependencies, and historical vulnerability patterns—the platform offers intelligent recommendations to optimize crates, enhance security, and reduce the risk of bugs or inefficiencies in your code.</p>
                        {/* <p className="mt-2">Learn more about the new features on our blog, or get started with the API documentation, and code examples.</p> */}
                    </div>


                    <div className="bg-gray-800 p-5 mb-6 rounded shadow-md">
                        <h2 className="text-2xl font-semibold">Vulnerability Detection and Risk Assessment</h2>
                        <p className="mt-2">CratesPro automatically detects potential vulnerabilities in the crates, including logic flaws, security risks, and performance bottlenecks. Using intelligent pattern recognition, it scans crate code and their dependencies to identify possible threats or weaknesses. These findings are presented with suggested fixes and recommendations.</p>
                        {/* <p className="mt-2">With Open Source Insights, you can actually see the dependency graph for a package, then isolate the paths to a particular dependency. Or see whether a vulnerability in a dependency might affect your code. Or compare two versions of a package to see how the dependencies have changed in a new release.</p> */}
                    </div>

                    <div className="bg-gray-800 p-5 mb-6 rounded shadow-md">
                        <h2 className="text-2xl font-semibold">CVE Tracking and Vulnerability Propagation</h2>
                        <p className="mt-2">CratesPro tracks CVE (Common Vulnerabilities and Exposures) related to Rust crates and their dependencies. The platform monitors crate versions and their updates, correlating them with known CVE databases to provide real-time updates on newly discovered vulnerabilities. This helps developers stay informed about potential threats to their projects and take proactive measures.</p>
                    </div>

                    <div className="bg-gray-800 p-5 mb-6 rounded shadow-md">
                        <h2 className="text-2xl font-semibold">User-Uploaded Crates for Comprehensive Analysis</h2>
                        <p className="mt-2">CratesPro supports users who wish to upload their custom crates for comprehensive analysis. After uploading, CratesPro performs a full evaluation of the crate, analyzing dependencies, potential vulnerabilities, and even compatibility with other crates in the Rust ecosystem. This feature empowers developers to ensure the security and reliability of their own creations before publication.</p>
                    </div>

                    <div className="bg-gray-800 p-5 mb-6 rounded shadow-md">
                        <h2 className="text-2xl font-semibold">Dependency Tracking and Visualization</h2>
                        <p className="mt-2">CratesPro offers detailed tracking of crate dependencies, visualizing the relationships between crates and how vulnerabilities propagate across them. By modeling dependencies and interactions, developers can see how a vulnerability in one crate may affect others in the ecosystem, offering a clearer understanding of potential risks.</p>
                    </div>
                </div>
            </div >
        </>
    );
}

export default HomePage;
