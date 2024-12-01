"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NewHeader from '@/components/NewHeader';
import { searchResult } from '@/app/lib/all_interface';

const Search = () => {
    const [results, setResults] = useState<searchResult | null>(null);
    const [currentPage, setCurrentPage] = useState(1); // 添加当前页码状态
    const searchParams = useSearchParams();
    const name = searchParams.get('crate_name');

    useEffect(() => {
        if (name) {
            fetchResults(name, currentPage); // 使用 name 和当前页发起请求
        }
    }, [name, currentPage]); // 当 name 或 currentPage 改变时重新运行

    const fetchResults = async (query: string, page: number) => {
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    pagination: {
                        page, // 使用传入的页码
                        per_page: 20 // 每页条数
                    }
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data1 = await response.json();
            const data = data1.data;
            setResults(data); // 假设返回的数据data字段
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleNextPage = () => {
        if (results && currentPage < results.data.total_page) {
            setCurrentPage(prevPage => prevPage + 1); // 增加页码
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1); // 减少页码
        }
    };

    console.log("results:", results?.data.items);
    return (
        <div className="min-h-screen bg-gray-100">
            <NewHeader />
            <div className="max-w-2xl ml-10 p-4">
                <div id="results" className="space-y-4">
                    {results ? (
                        results.data.total_page > 0 ? (
                            results.data.items.map((item, index) => (
                                <Link
                                    key={index}
                                    href={`/homepage/${item.nsfront}/${item.nsbehind}/${item.name}/${item.version}`}
                                >
                                    <div className="p-4 rounded-md hover:bg-blue-100 transition">
                                        <strong>{item.name}</strong>
                                        <div>
                                            Crate {item.version} - {item.nsfront}/{item.nsbehind}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>No items found.</p>
                        )
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                {/* 显示当前页数和总页数 */}
                {results && (
                    <div className="mt-4 text-center">
                        <p>
                            当前页: {currentPage} / 总页数: {results.data.total_page}
                        </p>
                    </div>
                )}

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={results === null || currentPage >= results.data.total_page}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Search />
        </Suspense>
    );
}