"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cratesInfo } from '@/app/lib/all_interface';

const CratePage = () => {
    const [isOpen, setIsOpen] = useState(false); // 状态管理下拉菜单的显示




    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<cratesInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const crateName = searchParams.get('crate_name'); // 从 URL 中获取 crate_name 参数
    const crateVersion = searchParams.get('version'); // 从 URL 中获取 version 参数
    useEffect(() => {
        const fetchCrateData = async () => {
            try {
                const response = await fetch(`/api/crates/${crateName}/${crateVersion}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('overviewwwwwwwwwwwwww:', data);

                setResults(data); // 设置获取的数据

            } catch (error) {
                console.log('Error fetching data:', error);
                setError('An error occurred');
            } finally {
                setLoading(false); // 完成加载
            }
        };


        fetchCrateData(); // 调用函数来获取数据
    }, [crateName, crateVersion]); // 依赖项数组，确保在 crateName 或 version 改变时重新获取数据


    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    // 渲染部分
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;




    return (
        <div>
            {/* Existing header and search */}
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
                            <span>{crateName}</span>
                            {/*版本列表*/}
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                                >
                                    {crateVersion || 'Select Version'}
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
                                        {/* 遮罩层 */}
                                        <div className="absolute inset-0 bg-black opacity-50" onClick={closeDropdown}></div>
                                        <div className="relative bg-white border border-gray-300 rounded shadow-lg z-20">
                                            <ul className="max-h-60 overflow-y-auto">
                                                {results?.versions.map((version, index) => (
                                                    <Link
                                                        key={index}
                                                        href={{
                                                            pathname: `/homepage/${crateName}/${version}`,
                                                            query: {
                                                                crate_name: crateName,
                                                                version: version,
                                                            },
                                                        }}
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
                        />
                        <Link href={{
                            pathname: '/homepage/search',
                            query: {
                                crate_name: searchQuery, // 将搜索内容作为参数传递给新页面
                            },
                        }}>
                            <button className="bg-teal-600 text-white rounded-md p-2 ml-2 hover:bg-teal-700">Search</button>
                        </Link>
                    </div>
                </div>

                {/* 导航栏 */}
                <nav className="mt-4">
                    <ul className="flex space-x-4 text-gray-500 relative">
                        <li className="cursor-pointer relative">
                            <Link href={{
                                pathname: `/homepage/${crateName}/${crateVersion}`,
                                query: {
                                    crate_name: crateName,
                                    version: crateVersion,
                                },
                            }}>
                                <div className="block py-2 relative z-10">Overview</div>
                            </Link>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>
                        </li>
                        <li className="cursor-pointer relative">
                            <Link
                                href={{
                                    pathname: `/homepage/${crateName}/${crateVersion}/dependencies`,
                                    query: {
                                        crate_name: crateName,
                                        version: crateVersion,
                                    },
                                }}
                            >
                                <div className="block py-2 relative z-10">Dependencies</div>
                            </Link>
                        </li>

                        <Link
                            href={{
                                pathname: `/homepage/${crateName}/${crateVersion}/dependents`,
                                query: {
                                    crate_name: crateName,
                                    version: crateVersion,
                                },
                            }}
                        >
                            <li className="cursor-pointer relative">
                                <div className="block py-2 relative z-10">Dependents</div>
                            </li>
                        </Link>
                        {/* <li className="cursor-pointer relative">
                            <a href="#" className="block py-2 relative z-10">Compare</a>
                        </li>
                        <li className="cursor-pointer relative">
                            <a href="#" className="block py-2 relative z-10">Versions</a>
                        </li> */}
                    </ul>
                </nav>
            </header>

            {/* cve */}
            <div className="container mx-auto my-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {/* Security Advisories */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-lg font-bold mb-2">Security Advisories</h2>
                        <p>cve: {results ? JSON.stringify(results.cves) : 'No results available'}</p>
                    </div>
                    {/* Licenses */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-lg font-bold mb-2">Licenses</h2>
                        <div className="mb-2">
                            <span className="font-bold">LICENSES:</span> MIT
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">DEPENDENCY LICENSES:</span>
                            <ul className="list-disc pl-6">
                                <li>Apache-2.0 OR MIT (116)</li>
                                <li>MIT (27)</li>
                                <li>MIT OR Uniclicense (7)</li>
                                {/* Add more dependency licenses */}
                            </ul>
                        </div>
                    </div>
                    {/* Dependencies */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-lg font-bold mb-2">Dependencies</h2>
                        <div className="mb-2">
                            <span className="font-bold">Direct: {results ? JSON.stringify(results.dependencies.direct) : 'No results available'}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Indirect: {results ? JSON.stringify(results.dependencies.indirect) : 'No results available'}</span>
                        </div>
                        <Link
                            href={{
                                pathname: `/homepage/${crateName}/${crateVersion}/dependencies`,
                                query: {
                                    crate_name: crateName,
                                    version: crateVersion,
                                },
                            }}
                        >
                            <div className="text-blue-500 hover:underline">
                                View all dependencies
                            </div>
                        </Link>
                    </div>
                    {/* Dependents */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-lg font-bold mb-2">Dependents</h2>
                        <div className="mb-2">
                            <span className="font-bold">Direct: {results ? JSON.stringify(results.dependents.direct) : 'No results available'}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Indirect: {results ? JSON.stringify(results.dependents.indirect) : 'No results available'}</span>
                        </div>
                        <Link
                            href={{
                                pathname: `/homepage/${crateName}/${crateVersion}/dependents`,
                                query: {
                                    crate_name: crateName,
                                    version: crateVersion,
                                },
                            }}
                        >
                            <div className="text-blue-500 hover:underline">
                                View all dependencies
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-2">OpenSSF scorecard</h2>
                    <p>The Open Source Security Foundation is a cross-industry collaboration to improve the security of open source software (OSS). The Scorecard provides security health metrics for open source projects.</p>
                    <a href="#" className="text-blue-500 hover:underline">
                        View information about checks and how to fix failures.
                    </a>
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-3xl font-bold">8.3/10</div>
                        <div className="text-sm text-gray-500">Scorecard as of November 11, 2024.</div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Code-Review</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Maintained</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>CI/Best-Practices</span>
                            <span>0/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>License</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Dangerous-Workflow</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Security-Policy</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Token-Permissions</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Binary-Artifacts</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Pinned-Dependencies</span>
                            <span>0/10</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CratePage;