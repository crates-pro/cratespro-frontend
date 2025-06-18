"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import NewHeader from '@/components/NewHeader';
import { searchResult } from '@/app/lib/all_interface';

const Search = () => {
    const [results, setResults] = useState<searchResult | null>(null);
    // const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const name = searchParams.get('crate_name');
    const [activeTab, setActiveTab] = useState('All');
    const [localCurrentPage, setLocalCurrentPage] = useState(1); // 本地分页状态
    // const itemsPerPage = 10; // 每页显示10条

    useEffect(() => {
        if (name) {
            // 计算需要向后端请求的页码
            const backendPage = Math.ceil(localCurrentPage / 2);
            fetchResults(name, backendPage);
        }
    }, [name, localCurrentPage]);

    const fetchResults = async (query: string, page: number) => {
        setLoading(true);
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    pagination: {
                        page,
                        per_page: 20 // 保持后端每页20个
                    }
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data1 = await response.json();
            const data = data1.data;
            setResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // 计算当前页面应该显示的数据
    const getCurrentPageItems = () => {
        if (!results || !results.data || !results.data.items || !results.data.items.length) {
            return [];
        }

        const isFirstHalf = localCurrentPage % 2 === 1; // 奇数页显示前半部分，偶数页显示后半部分
        const startIndex = isFirstHalf ? 0 : 10;
        const endIndex = isFirstHalf ? Math.min(10, results.data.items.length) : Math.min(20, results.data.items.length);

        return results.data.items.slice(startIndex, endIndex);
    };

    // 计算总页数
    const getTotalLocalPages = () => {
        if (!results) return 0;
        return results.data.total_page * 2; // 后端每页20条，前端每页10条，所以总页数翻倍
    };

    const handleNextPage = () => {
        const totalPages = getTotalLocalPages();
        if (localCurrentPage < totalPages) {
            setLocalCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (localCurrentPage > 1) {
            setLocalCurrentPage(prevPage => prevPage - 1);
        }
    };

    // 直接跳转到指定页码
    const goToPage = (page: number) => {
        const totalPages = getTotalLocalPages();
        if (page >= 1 && page <= totalPages) {
            setLocalCurrentPage(page);
        }
    };

    // 获取当前页应显示的数据
    const currentItems = getCurrentPageItems();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* 添加 Header */}
            <NewHeader />

            {/* 创建一个居中的容器 */}
            <div className="flex mt-0 justify-center w-full">
                <div className="w-[1500px] flex flex-col">
                    {/* 标签导航 */}
                    <div className="h-[64px] flex-shrink-0 rounded-[12px] bg-white shadow-[0_0_12px_0_rgba(43,88,221,0.09)] flex items-center px-6 my-6">
                        <button
                            className={`mr-8 py-2 ${activeTab === 'All' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('All')}
                        >
                            All
                        </button>
                        <button
                            className={`mr-8 py-2 ${activeTab === 'Packages' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('Packages')}
                        >
                            Packages
                        </button>
                        <button
                            className={`mr-8 py-2 ${activeTab === 'Advisories' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('Advisories')}
                        >
                            Advisories
                        </button>
                        <button
                            className={`mr-8 py-2 ${activeTab === 'Projects' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('Projects')}
                        >
                            Projects
                        </button>

                        <div className="ml-auto">
                            <span className="text-[#4b68ff] font-['HarmonyOS_Sans_SC'] text-base font-normal tracking-[0.64px]"
                                style={{ textShadow: '0 0 20px rgba(43, 88, 221, 0.16)' }}>
                                Total {results?.data.total_page ? results.data.items.length * results.data.total_page : 0} results
                            </span>
                        </div>
                    </div>

                    {/* 搜索结果 */}
                    <div className="w-full">
                        {loading ? (
                            <p>Loading...</p>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <div
                                    key={index}
                                    className={`
                                        flex
                                        mb-4 
                                    
                                        h-[90px] 
                                        flex-shrink-0 
                                        rounded-[12px] 
                                        bg-white
                                        transition-all
                                        duration-200 
                                        hover:bg-[#4b68ff14]
                                        hover:shadow-[0_0_12px_0_rgba(43,88,221,0.2)]
                                    `}
                                >
                                    <Link href={`/${item.nsfront}/${item.nsbehind}/${item.name}/all`} className="block h-full">
                                        <div className="p-6 h-full flex flex-col justify-center">
                                            <div className="text-sm text-gray-600 mb-1">NuGet</div>
                                            <div className="text-blue-500 font-medium text-lg">{item.name}</div>
                                            <div className="text-gray-600 text-sm">
                                                Package {item.version} • Published October 22,2021
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p>No items found.</p>
                        )}
                    </div>

                    {/* 分页控制 */}
                    {results && getTotalLocalPages() > 0 && (
                        <div className="flex ml-6 mt-8 mb-8">
                            <button
                                onClick={() => goToPage(1)}
                                className="mx-1 w-8 h-8 rounded-full flex items-center justify-center border"
                                disabled={localCurrentPage === 1}
                            >
                                &lt;&lt;
                            </button>
                            <button
                                onClick={handlePreviousPage}
                                className="mx-1 w-8 h-8 rounded-full flex items-center justify-center border"
                                disabled={localCurrentPage === 1}
                            >
                                &lt;
                            </button>

                            {/* 页码指示器 */}
                            {Array.from({ length: Math.min(5, getTotalLocalPages()) }).map((_, i) => {
                                const pageNum = localCurrentPage - 2 + i;
                                if (pageNum > 0 && pageNum <= getTotalLocalPages()) {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => goToPage(pageNum)}
                                            className={`mx-1 w-8 h-8 rounded-full flex items-center justify-center ${localCurrentPage === pageNum
                                                ? 'bg-blue-500 text-white'
                                                : 'border'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                }
                                return null;
                            })}

                            <button
                                onClick={handleNextPage}
                                className="mx-1 w-8 h-8 rounded-full flex items-center justify-center border"
                                disabled={localCurrentPage >= getTotalLocalPages()}
                            >
                                &gt;
                            </button>
                            <button
                                onClick={() => goToPage(getTotalLocalPages())}
                                className="mx-1 w-8 h-8 rounded-full flex items-center justify-center border"
                                disabled={localCurrentPage >= getTotalLocalPages()}
                            >
                                &gt;&gt;
                            </button>
                        </div>
                    )}
                </div>
            </div>
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