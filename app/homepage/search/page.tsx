"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NewHeader from '@/components/NewHeader';
import { searchResult } from '@/app/lib/all_interface';

const Search = () => {
    const [results, setResults] = useState<searchResult | null>(null);
    const searchParams = useSearchParams();
    const name = searchParams.get('crate_name');

    useEffect(() => {
        if (name) {
            fetchResults(name); // 使用 name 发起请求
        }
    }, [name]); // 当 name 改变时重新运行

    const fetchResults = async (query: string) => {
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query, // 将 query 作为 JSON 发送
                    pagination: {
                        page: 1,    // 页码
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
                                    href={{
                                        pathname: `/homepage/${item.name}/${item.version}`,
                                        query: {
                                            crate_name: item.name,
                                            version: item.version,
                                        },
                                    }}
                                >
                                    <div className="p-4 rounded-md hover:bg-blue-100 transition">
                                        <strong>{item.name}</strong>
                                        <div>
                                            Crate {item.version}
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