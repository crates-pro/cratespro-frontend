"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
    //const [query,] = useState(''); //const [query, setQuery] = useState('');
    // 使用假数据进行测试,const [results, setResults] = useState([
    const [results,] = useState([
        { crate_name: "tokio", version: "1.41.1", date: "2023-01-01" },
        { crate_name: "tokio", version: "0.1.2", date: "2023-02-01" },
    ]);

    // const search = async () => {
    //     // 待替换api
    //     const apiUrl = 'api';

    //     try {
    //         const response = await fetch(apiUrl, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ query }),
    //         });

    //         const data = await response.json();
    //         setResults(data.results);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    return (
        //页面顶部和搜索框
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow p-4">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold flex items-center space-x-1">
                        <span>open</span>
                        <span className="text-green-500">/</span>
                        <span>source</span>
                        <span className="text-green-500">/</span>
                        <span>insights</span>
                    </div>
                    <div className="flex items-center space-x-2">
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
            </header>

            {/*搜索数据展示 */}
            <div className="max-w-2xl ml-10 p-4">
                <Link href="/homepage/tokio/1.41.1">
                    <div id="results" className="space-y-4">
                        {results.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-md hover:bg-blue-100 transition"
                            >
                                <strong>{item.crate_name}</strong>
                                <div>Crate {item.version}Published {item.date}</div>
                            </div>
                        ))}
                    </div>
                </Link>
            </div>
        </div>
    );
}