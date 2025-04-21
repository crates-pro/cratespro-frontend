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
            icon: "/images/homepage/homepage-1.png"
        },
        {
            title: "Vulnerability Detection and Risk Assessment",
            description: "CratesPro automatically detects potential vulnerabilities in the crates, including logic flaws, security risks, and performance bottlenecks. Using intelligent pattern recognition, it scans crate code and their dependencies to identify possible threats or weaknesses. These findings are presented with suggested fixes and recommendations.",
            icon: "/images/homepage/homepage-2.png"
        },
        {
            title: "CVE Tracking and Vulnerability Propagation",
            description: "CratesPro tracks CVE (Common Vulnerabilities and Exposures) related to Rust crates and their dependencies. The platform monitors crate versions and their updates, correlating them with known CVE databases to provide real-time updates on newly discovered vulnerabilities. This helps developers stay informed about potential threats to their projects and take proactive measures.",
            icon: "/images/homepage/homepage-3.png"
        },
        {
            title: "User-Uploaded Crates for Comprehensive Analysis",
            description: "CratesPro supports users who wish to upload their custom crates for comprehensive analysis. After uploading, CratesPro performs a full evaluation of the crate, analyzing dependencies, potential vulnerabilities, and even compatibility with other crates in the Rust ecosystem. This feature empowers developers to ensure the security and reliability of their own creations before publication.",
            icon: "/images/homepage/homepage-4.png"
        },
        {
            title: "Dependency Tracking and Visualization",
            description: "CratesPro offers detailed tracking of crate dependencies, visualizing the relationships between crates and how vulnerabilities propagate across them. By modeling dependencies and interactions, developers can see how a vulnerability in one crate may affect others in the ecosystem, offering a clearer understanding of potential risks.",
            icon: "/images/homepage/homepage-5.png"
        }
    ];

    const itemsToShow = 3; // 一次显示3个卡片
    const maxSlideIndex = features.length - itemsToShow; // 最大可滑动索引

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
        setActiveSlide((prev) => (prev >= maxSlideIndex ? maxSlideIndex : prev + 1));
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev <= 0 ? 0 : prev - 1));
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen bg-[#f0f0ff]">
                {/* 修改整个上半部分的容器结构 */}
                <div className="relative">
                    {/* 背景图片容器 - 减小高度 */}
                    <div className="absolute top-0 left-0 right-0 h-[500px] z-0">
                        <Image
                            src="/images/homepage/homepage-bg.png"
                            alt="Background"
                            fill
                            className="object-cover object-top"
                            priority
                        />
                    </div>

                    {/* 内容容器 - 对应减小高度 */}
                    <div className="relative z-10 h-[500px] flex flex-col">
                        {/* 导航栏 - 重新设计布局 */}
                        <header className="py-4 px-8 flex items-center justify-between">
                            {/* Logo 移到左上角 */}
                            <div className="flex-shrink-0">
                                <Image
                                    src="/images/homepage/logo-top.png"
                                    alt="CratesPro Logo"
                                    width={150}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>

                            {/* 导航链接居中 */}
                            <nav className="flex items-center space-x-10">
                                <Link href="#" className="text-[#003153] font-['HarmonyOS_Sans_SC'] text-base font-bold leading-normal">About</Link>
                                <Link href="#" className="text-[#003153] font-['HarmonyOS_Sans_SC'] text-base font-bold leading-normal">Documentation</Link>
                                <Link href="#" className="text-[#003153] font-['HarmonyOS_Sans_SC'] text-base font-bold leading-normal">Blog</Link>
                            </nav>

                            {/* 登录按钮靠右 */}
                            <div className="flex-shrink-0">
                                <SessionProvider>
                                    <SignIn />
                                </SessionProvider>
                            </div>
                        </header>

                        {/* 英雄区 - 调整内容和间距 */}
                        <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
                            <h1 className="text-[#003153] text-[64px] font-['HarmonyOS_Sans_SC'] font-bold leading-tight mb-4">
                                CratesPro
                            </h1>
                            <h2 className="text-[#003153] text-[36px] font-['HarmonyOS_Sans_SC'] font-bold leading-normal tracking-[0.72px] mb-4">
                                Rust Crate Analysis and Recommendation Platform
                            </h2>
                            <p className="text-[#003153] text-[22px] font-['HarmonyOS_Sans_Condensed'] font-medium leading-normal tracking-[2.64px] mb-12">
                                CratesPro is a sophisticated platform designed to analyze and evaluate Rust crates.
                            </p>

                            {/* 搜索框 */}
                            <div className="mx-auto w-[775px] flex-shrink-0 flex items-center justify-between">
                                <input
                                    type="text"
                                    placeholder="Search For Open Source Crates"
                                    className="w-[600px] h-[60px] p-4 rounded-[30px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                                <button
                                    className="w-[130px] h-[60px] bg-[#002851] text-white text-[30px] font-['HarmonyOS_Sans_SC'] font-bold capitalize rounded-[30px] ml-2 hover:bg-blue-800 transition"
                                    onClick={performSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="w-full h-[4px] bg-[#A5FFED] flex-shrink-0" />
                    </div>
                </div>

                {/* Why Choose Us 部分 - 增加上下内边距 */}
                <div className="bg-[#F6FCFF] py-8 px-4"> {/* 增加上下内边距到 py-24 */}
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-[#002851] mb-12"> {/* 增加标题下方间距 */}
                        Why Choose Us
                    </h2>

                    <div className="relative max-w-6xl mx-auto flex items-center justify-center">
                        {/* 左箭头 */}
                        <button
                            onClick={prevSlide}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 ${activeSlide <= 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
                            aria-label="Previous slide"
                            disabled={activeSlide <= 0}
                        >
                            <Image
                                src="/images/homepage/left-normal.png"
                                alt="Previous"
                                width={24}
                                height={24}
                            />
                        </button>

                        {/* 轮播内容 */}
                        <div className="flex overflow-hidden w-[960px]">
                            <div
                                className="flex transition-transform duration-500"
                                style={{ transform: `translateX(-${activeSlide * 320}px)` }}
                            >
                                {features.map((feature, index) => (
                                    <div key={index} className="w-[320px] flex-shrink-0 px-4 mt-[75px] relative">
                                        {/* 图片容器 - 绝对定位 */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[50%] z-10">
                                            <Image
                                                src={feature.icon}
                                                alt={feature.title}
                                                width={150}
                                                height={150}
                                            />
                                        </div>

                                        {/* 卡片主体 */}
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
                                            pt-20  {/* 调整上内边距 */}
                                        ">
                                            <h3 className="text-[16px] font-semibold mb-3 text-center text-[#002851]">
                                                {feature.title}
                                            </h3>
                                            <p className="text-[14px] text-gray-600 text-center leading-tight">
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
                            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 ${activeSlide >= maxSlideIndex ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
                            aria-label="Next slide"
                            disabled={activeSlide >= maxSlideIndex}
                        >
                            <Image
                                src="/images/homepage/left-normal.png"
                                alt="Next"
                                width={24}
                                height={24}
                                className="rotate-180"
                            />
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