'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface DependencyItem {
    crate_name: string;
    version: string;
    relation: string;
    dependencies: number;
}

interface DependencyTableProps {
    data: DependencyItem[] | undefined; // 允许为 undefined
}

const DependencyTable: React.FC<DependencyTableProps> = ({ data }) => {
    const params = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    // const [showGraph, setShowGraph] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // 每页显示条目数
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // 处理搜索逻辑
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // 搜索时重置到第一页
    };

    // 处理排序
    const handleSort = (field: string) => {
        if (sortField === field) {
            // 如果已经在按这个字段排序，则切换排序方向
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // 如果是新的排序字段，设置为升序
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1); // 排序时重置到第一页
    };

    // 筛选数据
    const filteredData = data?.filter(item =>
        item.crate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.relation.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // 排序数据
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortField) return 0;

        let valueA, valueB;

        switch (sortField) {
            case 'crate_name':
                valueA = a.crate_name.toLowerCase();
                valueB = b.crate_name.toLowerCase();
                break;
            case 'relation':
                valueA = a.relation.toLowerCase();
                valueB = b.relation.toLowerCase();
                break;
            case 'dependencies':
                valueA = a.dependencies;
                valueB = b.dependencies;
                break;
            default:
                return 0;
        }

        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // 分页逻辑
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sortedData.slice(startIndex, endIndex);

    // 分页控制函数
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // 生成页码按钮
    const getPageButtons = () => {
        const pageButtons = [];
        const maxVisiblePages = 5;

        // 计算要显示的页码范围
        let startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // 调整起始页，确保显示足够的页码
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`mx-1 w-[26px] h-[26px] flex-shrink-0 aspect-ratio-1/1 flex items-center justify-center bg-white rounded-full ${currentPage === i
                        ? 'border border-[#4B68FF] text-[#4B68FF]'
                        : 'border border-gray-300 text-gray-400'
                        } font-["HarmonyOS_Sans_SC"] text-[14px] font-normal capitalize`}
                >
                    {i}
                </button>
            );
        }

        return pageButtons;
    };

    return (
        <div className="w-full">
            {/* 搜索和显示选项 */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative">
                    <div className="relative flex items-center">
                        <div className="absolute left-5 mr-4">
                            <Image
                                src="/images/homepage/search-Dependencies.png"
                                alt="Search icon"
                                width={25}
                                height={25}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Search For The Information You Need"
                            className="ml-1 w-[549px] h-[42px] flex-shrink-0 rounded-[21px] pl-16 pr-4 py-2 focus:outline-none shadow-[0_0_12px_0_#2b58dd17] text-[#999999] font-['HarmonyOS_Sans_SC'] text-lg font-normal capitalize"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <Link
                    href={params.version === 'all' ? '#' : `/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependencies/graph`}
                    className={`w-[163px] h-[42px] flex-shrink-0 rounded-[21px] shadow-[0_0_12px_0_#2b58dd17] text-white flex items-center justify-center transition-colors ${params.version === 'all' ? 'bg-gray-300' : 'bg-[#4B68FF] hover:bg-[#3a57f0]'}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    {...(params.version === 'all' ? { tabIndex: -1, 'aria-disabled': true, onClick: (e) => e.preventDefault() } : {})}
                >
                    <span className="font-['HarmonyOS_Sans_SC'] text-lg font-bold capitalize">Show Graph</span>
                </Link>
            </div>

            {/* 表格 */}
            <div className="w-full">
                <div className="w-full h-[73px] flex-shrink-0 rounded-t-[16px] bg-[#4b68ff08]">
                    <div className="flex items-center h-full">
                        <div className="py-3 px-4 text-left text-[#333333] font-['HarmonyOS_Sans_SC'] text-lg font-bold capitalize flex-1 flex items-center">
                            Crate
                            <button
                                onClick={() => handleSort('crate_name')}
                                className="ml-2 focus:outline-none"
                            >
                                <Image
                                    src={sortField === 'crate_name'
                                        ? "/images/homepage/array-up.png"
                                        : "/images/homepage/array-grey.png"}
                                    alt="Sort"
                                    width={12}
                                    height={12}
                                    className={`transform ${sortField === 'crate_name' && sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                />
                            </button>
                        </div>
                        <div className="py-3 px-4 text-left text-[#333333] font-['HarmonyOS_Sans_SC'] text-lg font-bold capitalize flex-1 flex items-center">
                            Version
                        </div>
                        <div className="py-3 px-4 text-left text-[#333333] font-['HarmonyOS_Sans_SC'] text-lg font-bold capitalize flex-1 flex items-center">
                            Relation
                            <button
                                onClick={() => handleSort('relation')}
                                className="ml-2 focus:outline-none"
                            >
                                <Image
                                    src={sortField === 'relation'
                                        ? "/images/homepage/array-up.png"
                                        : "/images/homepage/array-grey.png"}
                                    alt="Sort"
                                    width={12}
                                    height={12}
                                    className={`transform ${sortField === 'relation' && sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                />
                            </button>
                        </div>
                        <div className="py-3 px-4 text-left text-[#333333] font-['HarmonyOS_Sans_SC'] text-lg font-bold capitalize flex-1 flex items-center">
                            Dependencies
                            <button
                                onClick={() => handleSort('dependencies')}
                                className="ml-2 focus:outline-none"
                            >
                                <Image
                                    src={sortField === 'dependencies'
                                        ? "/images/homepage/array-up.png"
                                        : "/images/homepage/array-grey.png"}
                                    alt="Sort"
                                    width={12}
                                    height={12}
                                    className={`transform ${sortField === 'dependencies' && sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <div
                                key={index}
                                className={`
                                    flex items-center w-full h-[59px] flex-shrink-0 group
                                    ${index % 2 === 1 ? 'bg-[#4b68ff08]' : 'bg-white'}
                                    hover:bg-[#4B68FF] transition-colors duration-200
                                `}
                            >
                                <div className="px-4 flex-1">
                                    <Link
                                        href={`/${params.nsfront}/${item.crate_name}/${item.crate_name}/${item.version}`}
                                        className="text-[#333333] group-hover:text-white font-['HarmonyOS_Sans_SC'] text-base font-normal hover:underline"
                                    >
                                        {item.crate_name}
                                    </Link>
                                </div>
                                <div className="px-4 flex-1 text-[#333333] group-hover:text-white font-['HarmonyOS_Sans_SC'] text-base font-normal">{item.version}</div>
                                <div className="px-4 flex-1 text-[#333333] group-hover:text-white font-['HarmonyOS_Sans_SC'] text-base font-normal">{item.relation}</div>
                                <div className="px-4 flex-1 text-[#333333] group-hover:text-white font-['HarmonyOS_Sans_SC'] text-base font-normal">{item.dependencies}</div>
                            </div>
                        ))
                    ) : (
                        <div className="py-4 text-center text-gray-500 w-full">
                            {searchQuery ? 'No matching results found' : 'No data available'}
                        </div>
                    )}
                </div>
            </div>

            {/* 分页控制 */}
            {sortedData.length > 0 && (
                <div className="flex justify-start mt-6">
                    <button
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className={`mx-1 w-[26px] h-[26px] flex-shrink-0 aspect-ratio-1/1 flex items-center justify-center bg-white rounded-full 
                            ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed border-gray-300' : 'border border-gray-300 text-gray-400'} 
                            font-["HarmonyOS_Sans_SC"] text-[14px] font-normal capitalize`}
                    >
                        &lt;&lt;
                    </button>
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`mx-1 w-[26px] h-[26px] flex-shrink-0 aspect-ratio-1/1 flex items-center justify-center bg-white rounded-full 
                            ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed border-gray-300' : 'border border-gray-300 text-gray-400'} 
                            font-["HarmonyOS_Sans_SC"] text-[14px] font-normal capitalize`}
                    >
                        &lt;
                    </button>

                    {getPageButtons()}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`mx-1 w-[26px] h-[26px] flex-shrink-0 aspect-ratio-1/1 flex items-center justify-center bg-white rounded-full 
                            ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed border-gray-300' : 'border border-gray-300 text-gray-400'} 
                            font-["HarmonyOS_Sans_SC"] text-[14px] font-normal capitalize`}
                    >
                        &gt;
                    </button>
                    <button
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`mx-1 w-[26px] h-[26px] flex-shrink-0 aspect-ratio-1/1 flex items-center justify-center bg-white rounded-full 
                            ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed border-gray-300' : 'border border-gray-300 text-gray-400'} 
                            font-["HarmonyOS_Sans_SC"] text-[14px] font-normal capitalize`}
                    >
                        &gt;&gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default DependencyTable;