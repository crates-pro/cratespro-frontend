"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'
import Link from 'next/link';
import DependencyTable from '../../../../../../../components/DependencyTable';
import { dependenciesInfo } from '@/app/lib/all_interface';

const CratePage = () => {
    const params = useParams();

    const [results, setResults] = useState<dependenciesInfo | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const crateName = params.name; // 从 URL 中获取 crate_name 参数
    const version = params.version; // 从 URL 中获取 version 参数

    useEffect(() => {
        const fetchCrateData = async () => {
            try {
                setError(null);
                const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependencies`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();


                setResults(data); // 设置获取的数据

            } catch (error) {
                console.log('Error fetching data:', error);
            } finally {
                setLoading(false); // 完成加载
            }
        };
        fetchCrateData(); // 调用函数来获取数据
    }, [params.name, params.version, params.nsfront, params.nsbehind]); // 依赖项数组，确保在 crateName 或 version 改变时重新获取数据

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    // console.log('dependencyyyyyyyyyyyyyyy', results?.data);
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
                            <Link
                                href={`/homepage/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}`}
                            >
                                <div className="block py-2 relative z-10">Overview</div>
                            </Link>
                        </li>
                        <li className="cursor-pointer relative">
                            <Link
                                href={
                                    `/homepage/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependencies`}
                            >
                                <div className="block py-2 relative z-10">Dependencies</div>
                            </Link>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>
                        </li>

                        <Link
                            href={`/homepage/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependents`}
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

            <DependencyTable data={results?.data} />

        </div>
    );
};

export default CratePage;