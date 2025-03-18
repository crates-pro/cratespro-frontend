'use client';
import React, { useState } from 'react';
import '@/app/ui/global.css';
import Link from 'next/link';
import { message } from 'antd';
import Image from 'next/image';
import SignIn from '@/components/sign-in';
import { SessionProvider } from "next-auth/react"

const HomePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    const [activeSlide, setActiveSlide] = useState(0);

    const features = [
        {
            title: "AI-Powered Multi-Dimensional Analysis",
            description: "CratesPro leverages advanced AI models to provide in-depth, multi-dimensional analysis of Rust crates. By analyzing a variety of data points—including code structure, dependencies, and historical vulnerability patterns—the platform offers intelligent recommendations to optimize crates, enhance security, and reduce the risk of bugs or inefficiencies in your code.",
            icon: "/images/homepage/ai-powered.png"
        },
        {
            title: "Vulnerability Detection and Risk Assessment",
            description: "CratesPro automatically detects potential vulnerabilities in the crates, including logic flaws, security risks, and performance bottlenecks. Using intelligent pattern recognition, it scans crate code and their dependencies to identify possible threats or weaknesses. These findings are presented with suggested fixes and recommendations.",
            icon: "/images/homepage/vulnerability-detection.png"
        },
        {
            title: "CVE Tracking and Vulnerability Propagation",
            description: "CratesPro tracks CVE (Common Vulnerabilities and Exposures) related to Rust crates and their dependencies. The platform monitors crate versions and their updates, correlating them with known CVE databases to provide real-time updates on newly discovered vulnerabilities. This helps developers stay informed about potential threats to their projects and take proactive measures.",
            icon: "/images/homepage/cve-tracking.png"
        }
    ];

    const handleKeyPress = (e: { key: string; }) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const performSearch = () => {
        if (!searchQuery || searchQuery.trim() === '') {
            messageApi.warning('请输入搜索内容');
        }
        if (searchQuery.trim()) {
            window.location.href = `/search?crate_name=${searchQuery}`;
        }
    };

    const nextSlide = () => {
        setActiveSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1));
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen bg-[#f0f0ff]">
                {/* 导航栏 */}
                <header className=" p-4 flex justify-between items-center">

                    <nav className="flex items-center space-x-10 flex-1 justify-center">
                        <Link href="#" className="text-[#003153] font-['HarmonyOS_Sans_SC'] text-base font-bold leading-normal capitalize">About</Link>
                        <Link href="#" className="text-[#003153] font-['HarmonyOS_Sans_SC'] text-base font-bold leading-normal capitalize">Documentation</Link>
                        <Link href="#" className="text-[#003153] font-['HarmonyOS_Sans_SC'] text-base font-bold leading-normal capitalize">Blog</Link>
                    </nav>
                    <div className="flex-1 flex justify-end">
                        <SessionProvider>
                            <SignIn />
                        </SessionProvider>
                    </div>
                </header>

                {/* 英雄区 */}
                <div className="flex flex-col items-center justify-center pt-16 pb-20 px-4 text-center">
                    <div className="mb-8">
                        <Image
                            src="/images/homepage/logo-top.png"
                            alt="CratesPro Logo"
                            width={200}
                            height={100}
                            className="mx-auto"
                        />
                    </div>
                    <h1 className="text-[#003153] text-[36px] font-['HarmonyOS_Sans_SC'] font-bold leading-normal tracking-[0.72px] ">
                        CratesPro - Rust Crate Analysis and Recommendation Platform
                    </h1>
                    <p className="text-[#003153] text-[22px] font-['HarmonyOS_Sans_Condensed'] font-medium leading-normal tracking-[2.64px] ">
                        CratesPro is a sophisticated platform designed to analyze and evaluate Rust crates.
                    </p>

                    {/* 搜索框 */}
                    <div className="mx-auto mt-8 w-[775px] flex-shrink-0 flex items-center justify-between">
                        <input
                            type="text"
                            placeholder="Search For Open Source Crates"
                            className="w-[600px] h-[60px] p-4 rounded-[30px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button
                            className="
                                w-[130px] 
                                h-[60px] 
                                bg-[#002851] 
                                text-white 
                                text-[30px] 
                                font-['HarmonyOS_Sans_SC'] 
                                font-bold 
                                capitalize 
                                rounded-[30px] 
                                ml-2 
                                hover:bg-blue-800 
                                transition
                            "
                            onClick={performSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* 彩色分隔线 */}
                <div className="flex justify-center my-0">
                    <svg
                        width="1953.5"
                        height="4"
                        className="flex-shrink-0"
                        viewBox="0 0 1953.5 4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <line
                            x1="0"
                            y1="2"
                            x2="1953.5"
                            y2="2"
                            stroke="#A5FFED"
                            strokeWidth="4"
                        />
                    </svg>
                </div>

                {/* 为什么选择我们 */}
                <div className="py-16 px-4 bg-[#F6FCFF]">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-[#002851] mb-16">
                        Why Choose Us
                    </h2>

                    <div className="relative max-w-6xl mx-auto flex items-center justify-center">
                        {/* 左箭头 */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                            aria-label="Previous slide"
                        >
                            <Image
                                src="/images/homepage/left-normal.png"
                                alt="Previous"
                                width={24}
                                height={24}
                            />
                        </button>

                        {/* 轮播内容 */}
                        <div className="flex overflow-hidden">
                            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                                {features.map((feature, index) => (
                                    <div key={index} className="w-[320px] flex-shrink-0 px-4">
                                        <div className="
                                                h-[430px] 
                                                rounded-[46px]
                                                bg-gradient-to-b from-[#CED4FF] to-[#F6FCFF]
                                                shadow-[0_0_20px_0_rgba(43,88,221,0.16)]
                                                p-8 
                                                flex 
                                                flex-col 
                                                items-center
                                                mx-auto
                                            ">
                                            <div className="mb-6">
                                                <Image
                                                    src={feature.icon}
                                                    alt={feature.title}
                                                    width={150}
                                                    height={150}
                                                />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-4 text-center text-[#002851]">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 text-center">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 右箭头 */}
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
                            aria-label="Next slide"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 页脚 */}
                <footer className="bg-[#002851] text-white py-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <Image
                                    src="/images/homepage/logo-footer.png"
                                    alt="CratesPro Logo"
                                    width={180}
                                    height={60}
                                    className="mb-4"
                                />
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                                <ul className="space-y-2">
                                    <li><Link href="#" className="hover:text-blue-300">Documentation</Link></li>
                                    <li><Link href="#" className="hover:text-blue-300">About</Link></li>
                                    <li><Link href="#" className="hover:text-blue-300">Blog</Link></li>
                                    <li><Link href="#" className="hover:text-blue-300">FAQ</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">API</h4>
                                <ul className="space-y-2">
                                    <li><Link href="#" className="hover:text-blue-300">API</Link></li>
                                    <li><Link href="#" className="hover:text-blue-300">BigQuery Dataset</Link></li>
                                    <li><Link href="#" className="hover:text-blue-300">GitHub</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                                <ul className="space-y-2">
                                    <li><Link href="#" className="hover:text-blue-300">Legal</Link></li>
                                    <li><Link href="#" className="hover:text-blue-300">Privacy</Link></li>
                                    <li><Link href="#" className="hover:text-blue-300">Terms</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
                            <p>Copyright © 2023 jp21.com.cn All Rights Reserved(@ICPBH180237号)</p>
                        </div>
                    </div>
                </footer>
            </div >
        </>
    );
}

export default HomePage;