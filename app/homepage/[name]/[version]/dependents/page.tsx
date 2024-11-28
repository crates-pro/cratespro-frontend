"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DependentTable from '../../../../../components/DependentTable';
import { useSearchParams } from 'next/navigation';
import { dependentsInfo } from '@/app/lib/all_interface';



const CratePage = () => {
    const [results, setResults] = useState<dependentsInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const searchParams = useSearchParams();
    const crateName = searchParams.get('crate_name'); // 从 URL 中获取 crate_name 参数
    const version = searchParams.get('version'); // 从 URL 中获取 version 参数

    useEffect(() => {
        const fetchCrateData = async () => {
            try {
                const response = await fetch(`/api/crates/${crateName}/${version}/dependents`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();


                setResults(data); // 设置获取的数据

            } catch (error) {
                setError(null);
                console.log('Error fetching data:', error);
            } finally {
                setLoading(false); // 完成加载
            }
        };
        fetchCrateData(); // 调用函数来获取数据
    }, [crateName, version]); // 依赖项数组，确保在 crateName 或 version 改变时重新获取数据

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    console.log('dependencyyyyyyyyyyyyyyy', results?.data);

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
                            <div className="relative">
                                <button className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                                    {version}
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

                {/* 导航栏 */}
                <nav className="mt-4">
                    <ul className="flex space-x-4 text-gray-500 relative">
                        <li className="cursor-pointer relative">
                            <Link href={{
                                pathname: `/homepage/${crateName}/${version}`,
                                query: {
                                    crate_name: crateName,
                                    version: version,
                                },
                            }}>
                                <div className="block py-2 relative z-10">Overview</div>
                            </Link>

                        </li>
                        <li className="cursor-pointer relative">
                            <Link
                                href={{
                                    pathname: `/homepage/${crateName}/${version}/dependencies`,
                                    query: {
                                        crate_name: crateName,
                                        version: version,
                                    },
                                }}
                            >
                                <div className="block py-2 relative z-10">Dependencies</div>
                            </Link>
                        </li>

                        <Link
                            href={{
                                pathname: `/homepage/${crateName}/${version}/dependents`,
                                query: {
                                    crate_name: crateName,
                                    version: version,
                                },
                            }}
                        >
                            <li className="cursor-pointer relative">
                                <div className="block py-2 relative z-10">Dependents</div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>
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


            <DependentTable data={results?.data} />

        </div>
    );
};

export default CratePage;