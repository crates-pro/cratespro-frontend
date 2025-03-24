'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

// 假设后端接口返回的类型
interface VersionInfo {
    version: string;
    dependents: number; // 保持原始字段以便从API获取
    updated_at: string; // 新增字段
    downloads: string;
}

// 新增 PublishDay 接口
// interface FormattedVersionInfo extends VersionInfo {
//     updated_at: string; // 新增字段
//     downloads: string;
// }

const VersionsTable: React.FC = () => {
    const params = useParams();
    const [versionsData, setVersionsData] = useState<VersionInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // 每页显示条目数
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const fetchVersionsData = async () => {
            try {
                const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/versions`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // 检查数据是否有效
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format');
                }

                setVersionsData(data); // 设置获取的数据
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unknown error occurred'); // 改进错误处理
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // 完成加载
            }
        };

        fetchVersionsData(); // 调用函数来获取数据
    }, [params.nsfront, params.nsbehind, params.name, params.version]); // 依赖项数组

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
    const filteredData = versionsData.filter(item =>
        item.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.updated_at.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.downloads.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.dependents).includes(searchQuery)
    );

    // 辅助函数：将下载量字符串转换为数字
    const parseDownloadsToNumber = (downloadsStr: string): number => {
        // 如果为空，返回0
        if (!downloadsStr) return 0;

        // 移除所有逗号
        const cleanStr = downloadsStr.replace(/,/g, '');

        // 处理带单位的数字，如"1.2M"、"3.4K"等
        if (cleanStr.endsWith('K') || cleanStr.endsWith('k')) {
            return parseFloat(cleanStr) * 1000;
        } else if (cleanStr.endsWith('M') || cleanStr.endsWith('m')) {
            return parseFloat(cleanStr) * 1000000;
        } else if (cleanStr.endsWith('B') || cleanStr.endsWith('b')) {
            return parseFloat(cleanStr) * 1000000000;
        }

        // 尝试直接解析为数字
        return parseFloat(cleanStr) || 0;
    };

    // 辅助函数：比较版本号
    const compareVersions = (versionA: string, versionB: string): number => {
        // 分割版本号为组件部分
        const partsA = versionA.split('.').map(part => parseInt(part) || 0);
        const partsB = versionB.split('.').map(part => parseInt(part) || 0);

        // 确保两个版本号数组长度相同
        const maxLength = Math.max(partsA.length, partsB.length);
        while (partsA.length < maxLength) partsA.push(0);
        while (partsB.length < maxLength) partsB.push(0);

        // 逐部分比较
        for (let i = 0; i < maxLength; i++) {
            if (partsA[i] > partsB[i]) return 1;
            if (partsA[i] < partsB[i]) return -1;
        }

        return 0; // 版本号相等
    };

    // 排序数据
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortField) return 0;

        let valueA, valueB;

        switch (sortField) {
            case 'version':
                // 使用版本号比较函数
                return sortDirection === 'asc'
                    ? compareVersions(a.version, b.version)
                    : compareVersions(b.version, a.version);
            case 'downloads':
                // 将下载量字符串转换为数字进行排序
                valueA = parseDownloadsToNumber(a.downloads);
                valueB = parseDownloadsToNumber(b.downloads);
                break;
            case 'dependents':
                valueA = a.dependents;
                valueB = b.dependents;
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

    if (loading) return <div className="flex justify-center items-center">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="w-full mt-0">
            {/* 搜索区域 */}
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
            </div>

            {/* 表格 */}
            <div className="w-full">
                <div className="w-full h-[73px] flex-shrink-0 rounded-t-[16px] bg-[#4b68ff08]">
                    <div className="flex items-center h-full">
                        <div className="py-3 px-4 text-left text-[#333333] font-['HarmonyOS_Sans_SC'] text-lg font-bold capitalize flex-1 flex items-center">
                            Version
                            <button
                                onClick={() => handleSort('version')}
                                className="ml-2 focus:outline-none"
                            >
                                <Image
                                    src={sortField === 'version'
                                        ? "/images/homepage/array-up.png"
                                        : "/images/homepage/array-grey.png"}
                                    alt="Sort"
                                    width={12}
                                    height={12}
                                    className={`transform ${sortField === 'version' && sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                />
                            </button>
                        </div>
                        <div className="py-3 px-4 text-left text-[#333333] font-['HarmonyOS_Sans_SC'] text-lg font-bold capitalize flex-1 flex items-center">
                            Updated At
                        </div>
                        <div className="py-3 px-4 text-left text-[#333333] font-['HarmonyOS_Sans_SC'] text-lg font-bold capitalize flex-1 flex items-center">
                            Downloads
                            <button
                                onClick={() => handleSort('downloads')}
                                className="ml-2 focus:outline-none"
                            >
                                <Image
                                    src={sortField === 'downloads'
                                        ? "/images/homepage/array-up.png"
                                        : "/images/homepage/array-grey.png"}
                                    alt="Sort"
                                    width={12}
                                    height={12}
                                    className={`transform ${sortField === 'downloads' && sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                />
                            </button>
                        </div>
                        <div className="py-3 px-4 text-left text-[#333333] font-['HarmonyOS_Sans_SC'] text-lg font-bold capitalize flex-1 flex items-center">
                            Dependents
                            <button
                                onClick={() => handleSort('dependents')}
                                className="ml-2 focus:outline-none"
                            >
                                <Image
                                    src={sortField === 'dependents'
                                        ? "/images/homepage/array-up.png"
                                        : "/images/homepage/array-grey.png"}
                                    alt="Sort"
                                    width={12}
                                    height={12}
                                    className={`transform ${sortField === 'dependents' && sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
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
                                        href={`/${params.nsfront}/${params.nsbehind}/${params.name}/${item.version}`}
                                        className="text-[#333333] group-hover:text-white font-['HarmonyOS_Sans_SC'] text-base font-normal hover:underline"
                                    >
                                        {item.version}
                                    </Link>
                                </div>
                                <div className="px-4 flex-1 text-[#333333] group-hover:text-white font-['HarmonyOS_Sans_SC'] text-base font-normal">{item.updated_at}</div>
                                <div className="px-4 flex-1 text-[#333333] group-hover:text-white font-['HarmonyOS_Sans_SC'] text-base font-normal">{item.downloads}</div>
                                <div className="px-4 flex-1 text-[#333333] group-hover:text-white font-['HarmonyOS_Sans_SC'] text-base font-normal">{item.dependents}</div>
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

export default VersionsTable;