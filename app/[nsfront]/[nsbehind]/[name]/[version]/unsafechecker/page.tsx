'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface MircheckerRes {
    run_state: boolean;
    exist: boolean;
    res: string;
}

const MircheckerPage = () => {
    const params = useParams();
    const [versionsList, setVersionsList] = useState<string[]>([]);
    const [mircheckerData, setMircheckerData] = useState<MircheckerRes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // 添加滚动条状态和引用
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();
    const containerRef = useRef<HTMLDivElement>(null);

    // 添加滚动位置状态
    const [scrollPosition, setScrollPosition] = useState(0);

    // 获取版本列表和Mirchecker数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取版本列表
                const versionsResponse = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}`);
                if (!versionsResponse.ok) {
                    throw new Error(`HTTP error! status: ${versionsResponse.status}`);
                }
                const versionsData = await versionsResponse.json();
                setVersionsList(versionsData.versions || []);

                // 获取 Mirchecker 数据
                const mircheckerResponse = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/unsafechecker`);
                if (!mircheckerResponse.ok) {
                    throw new Error(`HTTP error! status: ${mircheckerResponse.status}`);
                }
                const mircheckerData = await mircheckerResponse.json();
                setMircheckerData(mircheckerData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('获取数据时出错');
                setLoading(false);
            }
        };

        fetchData();
    }, [params.nsfront, params.nsbehind, params.name, params.version]);

    // 当前选中的版本
    const currentVersion = params.version as string;

    // 添加过滤后的版本列表计算
    const filteredVersions = versionsList.filter(version =>
        version.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 处理滚动事件
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollPosition(e.currentTarget.scrollTop);
        setIsScrolling(true);

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
        }, 1500);
    };

    // 处理搜索输入
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
            setScrollPosition(0);
        }
    };

    // 清理定时器
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg">加载中...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500 text-lg">错误: {error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9F9F9] flex">
            {/* 左侧边栏 - 版本列表 */}
            <div className="w-[300px] h-screen sticky top-0 flex-shrink-0 bg-white shadow-[0_0_12px_0_#2b58dd17] backdrop-blur-[200px] flex flex-col">
                {/* Logo 和搜索框区域 - 固定不动 */}
                <div className="p-4 space-y-4 flex-shrink-0">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <Image
                            src="/images/homepage/logo-top.png"
                            alt="CratesPro Logo"
                            width={150}
                            height={75}
                            className="mb-2"
                        />
                    </div>

                    {/* 搜索框 */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Image
                                src="/images/homepage/senseleak-search.png"
                                alt="Search Icon"
                                width={16}
                                height={16}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Search Files"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-[250px] h-[36px] flex-shrink-0 pl-10 pr-4 rounded-[18px] border border-[#333333] bg-white shadow-[0_0_12px_0_#2b58dd17] text-[14px] font-['HarmonyOS_Sans_SC'] text-[#999999] focus:outline-none focus:ring-1 focus:ring-[#4B68FF] focus:border-[#4B68FF]"
                        />
                    </div>
                </div>

                {/* 版本列表区域 - 可滚动 */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                    onScroll={handleScroll}
                >
                    {/* 自定义滚动条 */}
                    <div
                        className={`absolute right-1 w-[4px] transition-opacity duration-150 ${isScrolling || containerRef.current?.scrollTop !== 0 ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            height: '60px',
                            top: containerRef.current
                                ? `${Math.min(
                                    (scrollPosition /
                                        (containerRef.current.scrollHeight - containerRef.current.clientHeight)) *
                                    (containerRef.current.clientHeight - 60),
                                    containerRef.current.clientHeight - 60
                                )}px`
                                : '0',
                            background: '#4B68FF',
                            borderRadius: '3px',
                            pointerEvents: 'none',
                            transition: 'top 0.1s linear, opacity 0.15s ease-in-out',
                        }}
                    />

                    <div className="p-4">
                        <div className="space-y-2">
                            {filteredVersions.map((version, index) => (
                                <Link
                                    key={index}
                                    href={`/${params.nsfront}/${params.nsbehind}/${params.name}/${version}/unsafechecker`}
                                >
                                    <div className={`transition-colors cursor-pointer ${version === currentVersion
                                        ? 'bg-[#4b68ff] w-[278px] h-[37px] flex items-center text-white rounded-l-full rounded-r-none'
                                        : 'hover:bg-[#F5F7FF] text-[#333333] p-3'
                                        }`}>
                                        <div className={`flex items-center ${version === currentVersion ? 'pl-3' : ''}`}>
                                            <div className="mr-2">
                                                <Image
                                                    src="/images/homepage/senseleak-file.png"
                                                    alt="Version Icon"
                                                    width={16}
                                                    height={16}
                                                    className={version === currentVersion ? 'brightness-0 invert' : ''}
                                                />
                                            </div>
                                            <span className="font-['HarmonyOS_Sans_SC'] text-[16px]">Version-{version}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {filteredVersions.length === 0 && (
                                <div className="text-center py-4 text-[#999999] font-['HarmonyOS_Sans_SC']">
                                    没有找到匹配的版本
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 右侧内容区域 - Mirchecker数据 */}
            <div className="flex-1 py-8 px-12">
                <div className="max-w-[1500px] mx-auto">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-[4px] h-[24px] flex-shrink-0 rounded-[2px] bg-[#4B68FF]"></div>
                        <h1 className="text-[24px] font-bold text-[#333333] tracking-[0.96px] font-['HarmonyOS_Sans_SC']">
                            Unsafechecker Analysis: {params.name}/{params.version}
                        </h1>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-[0_0_12px_0_rgba(43,88,221,0.09)]">
                        {mircheckerData ? (
                            mircheckerData.run_state ? (
                                mircheckerData.exist ? (
                                    <pre className="whitespace-pre-wrap font-['HarmonyOS_Sans_SC'] text-[14px] leading-relaxed text-[#333333] p-4 bg-[#F8F9FC] rounded-lg overflow-x-auto">
                                        {mircheckerData.res}
                                    </pre>
                                ) : (
                                    <div className="flex flex-col items-center p-8">
                                        <Image
                                            src="/images/homepage/miss.png"
                                            alt="No data"
                                            width={140}
                                            height={140}
                                            className="mb-4"
                                        />
                                        <p className="text-[#C9D2FF] font-['HarmonyOS_Sans_SC'] text-[14px] font-normal leading-normal capitalize">
                                            no result
                                        </p>
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col items-center p-8">
                                    <Image
                                        src="/images/homepage/miss.png"
                                        alt="Run failed"
                                        width={140}
                                        height={140}
                                        className="mb-4"
                                    />
                                    <p className="text-[#C9D2FF] font-['HarmonyOS_Sans_SC'] text-[14px] font-normal leading-normal capitalize">
                                        run failed
                                    </p>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center p-8">
                                <Image
                                    src="/images/homepage/miss.png"
                                    alt="No data"
                                    width={140}
                                    height={140}
                                    className="mb-4"
                                />
                                <p className="text-[#C9D2FF] font-['HarmonyOS_Sans_SC'] text-[14px] font-normal leading-normal capitalize">
                                    加载中...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MircheckerPage;
