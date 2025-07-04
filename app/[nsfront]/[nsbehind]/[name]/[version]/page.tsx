// Overview页面
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cratesInfo } from '@/app/lib/all_interface';
import { useParams } from 'next/navigation';
// import { Pagination } from 'antd';
import Image from 'next/image';
// import NewHeader from '@/components/NewHeader';

interface CVE {
    subtitle?: string;
    id?: string;
    reported?: string;
    issued?: string;
    package?: string;
    ttype?: string;
    aliases?: string | string[];
    keywords?: string;
    patched?: string;
    unaffected?: string;
    url?: string;
    reference?: string;
    description?: string;
}

const CveCard = ({ cve }: { cve: CVE }) => (
    <div className="mb-6 pb-6 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
        {/* Package Name (红色标题) */}
        {cve.subtitle && (
            <div className="mb-[4px]">
                <p className="text-[#FD5656] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">
                    {cve.subtitle}
                </p>
            </div>
        )}

        {/* ID */}
        <div className="mb-[4px]">
            <p className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">
                {cve.id || 'No ID available'}
            </p>
        </div>

        {/* Reported */}
        <div className="mb-[4px]">
            <div>
                <span className="text-[#666666] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px] mr-4">Reported </span>
                <span className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">{cve.reported || 'Not specified'}</span>
            </div>
        </div>

        {/* Issued */}
        <div className="mb-[4px]">
            <span className="text-[#666666] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px] mr-4">Issued </span>
            <span className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">{cve.issued || 'Not specified'}</span>
        </div>

        {/* Package */}
        <div className="mb-[4px]">
            <span className="text-[#666666] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px] mr-4">Package </span>
            <span className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">{cve.package || 'No package info'}</span>
        </div>

        {/* Type */}
        {cve.ttype && (
            <div className="mb-[4px]">
                <span className="text-[#666666] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px] mr-4">Type </span>
                <span className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">{cve.ttype}</span>
            </div>
        )}

        {/* Aliases */}
        {cve.aliases && (
            <div className="mb-[4px]">
                <span className="text-[#666666] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px] mr-4">Aliases </span>
                <span className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">{Array.isArray(cve.aliases) ? cve.aliases.join(', ') : cve.aliases}</span>
            </div>
        )}

        {/* Keywords */}
        {cve.keywords && (
            <div className="mb-[4px]">
                <span className="text-[#666666] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px] mr-4">Keywords </span>
                <span className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">{cve.keywords}</span>
            </div>
        )}

        {/* Patched */}
        {cve.patched && (
            <div className="mb-[4px]">
                <span className="text-[#666666] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px] mr-4">Patched </span>
                <span className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">{cve.patched}</span>
            </div>
        )}

        {/* Unaffected */}
        {cve.unaffected && (
            <div className="mb-[4px]">
                <span className="text-[#666666] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px] mr-4">Unaffected </span>
                <span className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">{cve.unaffected}</span>
            </div>
        )}

        {/* URL */}
        {cve.url && (
            <div className="mb-[4px]">
                <span className="text-[#666666] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px] mr-4">Url </span>
                <a
                    href={cve.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4B68FF] text-[16px] font-['HarmonyOS_Sans_SC'] font-normal leading-[18px] hover:underline break-all"
                >
                    {cve.url}
                </a>
            </div>
        )}

        {/* Reference */}
        {cve.reference && (
            <div className="mb-[4px]">
                <span className="text-[#666666] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">Reference</span>
                <div className="text-[#4B68FF] hover:underline break-all">
                    {cve.reference.split(' ').map((url: string, i: number) => (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[16px] font-['HarmonyOS_Sans_SC'] font-normal leading-[18px]"
                        >
                            {url}
                        </a>
                    ))}
                </div>
            </div>
        )}

        {/* Description */}
        {cve.description && (
            <div className="mb-[4px]">
                <span className="text-[#666666] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">Description</span>
                <p className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[16px] font-normal leading-[18px]">{cve.description}</p>
            </div>
        )}
    </div>
);

const CratePage = () => {
    const params = useParams();
    const [results, setResults] = useState<cratesInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [packageCurrentPage, setPackageCurrentPage] = useState(1);
    const [depCurrentPage, setDepCurrentPage] = useState(1);
    const [versions, setVersions] = useState<string[]>([]);
    const itemsPerPage = 1;
    const basePath = `/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}`;

    useEffect(() => {
        const fetchCrateData = async () => {
            try {
                // 首先获取所有版本信息
                const versionsResponse = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/all`);
                if (!versionsResponse.ok) {
                    throw new Error(`HTTP error! status: ${versionsResponse.status}`);
                }
                const versionsData = await versionsResponse.json();
                setVersions(versionsData.versions || []);

                // 获取当前URL版本的数据
                const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching crate data:', error);
                setError('An error occurred');
            } finally {
                setLoading(false);
                console.log('results', versions);
            }
        };

        fetchCrateData();
    }, [params.name, params.nsfront, params.nsbehind]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const getCurrentPageItems = (items: CVE[], currentPage: number) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="flex justify-center">
                <div className="w-[1500px] px-8 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 左侧内容区域 - 占据2列 */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Security Advisories 标题 */}
                            <div className="flex items-center gap-3">
                                <div className="w-[4px] h-[24px] flex-shrink-0 rounded-[2px] bg-[#4B68FF]"></div>
                                <h2 className="text-[24px] font-bold text-[#333333] tracking-[0.96px] font-['HarmonyOS_Sans_SC']">
                                    Security Advisories
                                </h2>
                            </div>

                            {/* Security Advisories 内容 */}
                            <div className="space-y-6">
                                {/* In this package */}
                                <div className={`bg-white rounded-2xl p-6 shadow-[0_0_12px_0_rgba(43,88,221,0.09)] ${results?.cves && results.cves.length > 0 ? 'h-[502px]' : 'h-[300px]'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-[24px] text-[#333333] font-['HarmonyOS_Sans_SC'] font-medium tracking-[0.96px]">In this package</h3>
                                        <span className={`w-[28px] h-[28px] flex-shrink-0 aspect-square flex items-center justify-center rounded-full text-sm text-white ${results?.cves && results.cves.length > 0 ? 'bg-[#FD5656]' : 'bg-[#4B68FF]'}`}>
                                            {results?.cves?.length || 0}
                                        </span>
                                    </div>
                                    <div className="h-[calc(100%-40px)] flex items-center justify-center">
                                        {results?.cves && results.cves.length > 0 ? (
                                            <div className={results?.cves && results.cves.length > 0 ? "overflow-auto h-full w-full" : ""}>
                                                {getCurrentPageItems(results.cves, packageCurrentPage).map((cve, index) => (
                                                    <CveCard key={index} cve={cve} />
                                                ))}
                                                {results.cves.length > itemsPerPage && (
                                                    <div className="mt-4 flex justify-center">
                                                        <button
                                                            onClick={() => setPackageCurrentPage(1)}
                                                            className="mx-1 w-6 h-6 rounded-full flex items-center justify-center border text-sm"
                                                            disabled={packageCurrentPage === 1}
                                                        >
                                                            &lt;&lt;
                                                        </button>
                                                        <button
                                                            onClick={() => setPackageCurrentPage(prev => Math.max(1, prev - 1))}
                                                            className="mx-1 w-6 h-6 rounded-full flex items-center justify-center border text-sm"
                                                            disabled={packageCurrentPage === 1}
                                                        >
                                                            &lt;
                                                        </button>
                                                        {Array.from({ length: Math.min(5, Math.ceil(results.cves.length / itemsPerPage)) }).map((_, i) => {
                                                            const pageNum = packageCurrentPage - Math.floor(Math.min(5, Math.ceil(results.cves.length / itemsPerPage)) / 2) + i;
                                                            if (pageNum > 0 && pageNum <= Math.ceil(results.cves.length / itemsPerPage)) {
                                                                return (
                                                                    <button
                                                                        key={i}
                                                                        onClick={() => setPackageCurrentPage(pageNum)}
                                                                        className={`mx-1 w-6 h-6 rounded-full flex items-center justify-center text-sm ${packageCurrentPage === pageNum
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
                                                            onClick={() => setPackageCurrentPage(prev => Math.min(Math.ceil(results.cves.length / itemsPerPage), prev + 1))}
                                                            className="mx-1 w-6 h-6 rounded-full flex items-center justify-center border text-sm"
                                                            disabled={packageCurrentPage >= Math.ceil(results.cves.length / itemsPerPage)}
                                                        >
                                                            &gt;
                                                        </button>
                                                        <button
                                                            onClick={() => setPackageCurrentPage(Math.ceil(results.cves.length / itemsPerPage))}
                                                            className="mx-1 w-6 h-6 rounded-full flex items-center justify-center border text-sm"
                                                            disabled={packageCurrentPage >= Math.ceil(results.cves.length / itemsPerPage)}
                                                        >
                                                            &gt;&gt;
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Image
                                                    src="/images/homepage/miss.png"
                                                    alt="No vulnerabilities"
                                                    width={140}
                                                    height={140}
                                                    className="mb-1"
                                                />
                                                <p className="text-[#C9D2FF] font-['HarmonyOS_Sans_SC'] text-[14px] font-normal leading-normal capitalize">No vulnerabilities found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* In the dependencies */}
                                <div className={`bg-white rounded-2xl p-6 shadow-[0_0_12px_0_rgba(43,88,221,0.09)] ${results?.dep_cves && results.dep_cves.length > 0 ? 'h-[502px]' : 'h-[300px]'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-[24px] text-[#333333] font-['HarmonyOS_Sans_SC'] font-medium tracking-[0.96px]">In the dependencies</h3>
                                        <span className={`w-[28px] h-[28px] flex-shrink-0 aspect-square flex items-center justify-center rounded-full text-sm text-white ${results?.dep_cves && results.dep_cves.length > 0 ? 'bg-[#FD5656]' : 'bg-[#4B68FF]'}`}>
                                            {results?.dep_cves?.length || 0}
                                        </span>
                                    </div>
                                    <div className="h-[calc(100%-40px)] flex items-center justify-center">
                                        {results?.dep_cves && results.dep_cves.length > 0 ? (
                                            <div className={results?.dep_cves && results.dep_cves.length > 0 ? "overflow-auto h-full w-full" : ""}>
                                                {getCurrentPageItems(results.dep_cves, depCurrentPage).map((cve, index) => (
                                                    <CveCard key={index} cve={cve} />
                                                ))}
                                                {results.dep_cves.length > itemsPerPage && (
                                                    <div className="mt-4 flex justify-center">
                                                        <button
                                                            onClick={() => setDepCurrentPage(1)}
                                                            className="mx-1 w-6 h-6 rounded-full flex items-center justify-center border text-sm"
                                                            disabled={depCurrentPage === 1}
                                                        >
                                                            &lt;&lt;
                                                        </button>
                                                        <button
                                                            onClick={() => setDepCurrentPage(prev => Math.max(1, prev - 1))}
                                                            className="mx-1 w-6 h-6 rounded-full flex items-center justify-center border text-sm"
                                                            disabled={depCurrentPage === 1}
                                                        >
                                                            &lt;
                                                        </button>
                                                        {Array.from({ length: Math.min(5, results.dep_cves.length) }).map((_, i) => {
                                                            const pageNum = depCurrentPage - 2 + i;
                                                            if (pageNum > 0 && pageNum <= results.dep_cves.length) {
                                                                return (
                                                                    <button
                                                                        key={i}
                                                                        onClick={() => setDepCurrentPage(pageNum)}
                                                                        className={`mx-1 w-6 h-6 rounded-full flex items-center justify-center text-sm ${depCurrentPage === pageNum
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
                                                            onClick={() => setDepCurrentPage(prev => Math.min(results.dep_cves.length, prev + 1))}
                                                            className="mx-1 w-6 h-6 rounded-full flex items-center justify-center border text-sm"
                                                            disabled={depCurrentPage >= results.dep_cves.length}
                                                        >
                                                            &gt;
                                                        </button>
                                                        <button
                                                            onClick={() => setDepCurrentPage(results.dep_cves.length)}
                                                            className="mx-1 w-6 h-6 rounded-full flex items-center justify-center border text-sm"
                                                            disabled={depCurrentPage >= results.dep_cves.length}
                                                        >
                                                            &gt;&gt;
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Image
                                                    src="/images/homepage/miss.png"
                                                    alt="No vulnerabilities"
                                                    width={192}
                                                    height={192}
                                                    className="mb-1"
                                                />
                                                <p className="text-[#C9D2FF] font-['HarmonyOS_Sans_SC'] text-[14px] font-normal leading-normal capitalize">No vulnerabilities found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Licenses */}
                            <div className="space-y-6">
                                {/* Licenses 标题 */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-[4px] h-[24px] flex-shrink-0 rounded-[2px] bg-[#4B68FF]"></div>
                                        <h2 className="text-[24px] font-bold text-[#333333] tracking-[0.96px] font-['HarmonyOS_Sans_SC']">
                                            Licenses
                                        </h2>
                                    </div>
                                    <a href="#" className="text-[#4B68FF] text-[14px] font-['HarmonyOS_Sans_SC'] font-normal capitalize hover:underline">
                                        Learn more about license information.
                                    </a>
                                </div>
                                {/* Licenses 内容 */}
                                <div className="bg-white rounded-2xl p-6 shadow-[0_0_12px_0_rgba(43,88,221,0.09)]">
                                    <div className="text-[18px] text-black font-['HarmonyOS_Sans_SC'] font-normal capitalize">
                                        {results ? results.license : 'No results available'}
                                    </div>
                                </div>
                            </div>

                            {/* Dependencies */}
                            <div className="space-y-6">
                                {/* Dependencies 标题 */}
                                <div className="flex items-center gap-3">
                                    <div className="w-[4px] h-[24px] flex-shrink-0 rounded-[2px] bg-[#4B68FF]"></div>
                                    <h2 className="text-[24px] font-bold text-[#333333] tracking-[0.96px] font-['HarmonyOS_Sans_SC']">
                                        Dependencies
                                    </h2>
                                </div>
                                {/* Dependencies 内容 */}
                                {results && (results.dependencies.direct + results.dependencies.indirect) > 0 ? (
                                    <div className="bg-white rounded-2xl p-6 shadow-[0_0_12px_0_rgba(43,88,221,0.09)]">
                                        <div className="space-y-4">
                                            {/* Direct */}
                                            <div className="grid grid-cols-[80px_48px_1fr] gap-3 items-center">
                                                <div className="text-black text-[18px] font-['HarmonyOS_Sans_SC'] font-normal capitalize">Direct</div>
                                                <div className="text-right text-[#4B68FF] text-[18px] font-['HarmonyOS_Sans_SC'] font-normal capitalize">{results.dependencies.direct}</div>
                                                <div className="h-4 rounded-lg overflow-hidden bg-[#F5F7FF]">
                                                    <div
                                                        className="h-full bg-[#4B68FF] rounded-lg"
                                                        style={{
                                                            width: `${(results.dependencies.direct / (results.dependencies.direct + results.dependencies.indirect)) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Indirect */}
                                            <div className="grid grid-cols-[80px_48px_1fr] gap-3 items-center">
                                                <div className="text-black text-[18px] font-['HarmonyOS_Sans_SC'] font-normal capitalize">Indirect</div>
                                                <div className="text-right text-[#4B68FF] text-[18px] font-['HarmonyOS_Sans_SC'] font-normal capitalize">{results.dependencies.indirect}</div>
                                                <div className="h-4 rounded-lg overflow-hidden bg-[#F5F7FF]">
                                                    <div
                                                        className="h-full bg-[#4B68FF] rounded-lg"
                                                        style={{
                                                            width: `${(results.dependencies.indirect / (results.dependencies.direct + results.dependencies.indirect)) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 text-center">
                                            <Link href={`/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependencies`}>
                                                <span className="text-[#4B68FF] text-[18px] font-['HarmonyOS_Sans_SC'] font-normal hover:underline">
                                                    View all dependencies ({results.dependencies.direct + results.dependencies.indirect})
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[18px] font-normal leading-normal capitalize">
                                        This Package Has No Known Dependencies.
                                    </div>
                                )}
                            </div>

                            {/* Dependents */}
                            <div className="space-y-6">
                                {/* Dependents 标题 */}
                                <div className="flex items-center gap-3">
                                    <div className="w-[4px] h-[24px] flex-shrink-0 rounded-[2px] bg-[#4B68FF]"></div>
                                    <h2 className="text-[24px] font-bold text-[#333333] tracking-[0.96px] font-['HarmonyOS_Sans_SC']">
                                        Dependents
                                    </h2>
                                </div>
                                {/* Dependents 内容 */}
                                {results && (results.dependents.direct + results.dependents.indirect) > 0 ? (
                                    <div className="bg-white rounded-2xl p-6 shadow-[0_0_12px_0_rgba(43,88,221,0.09)]">
                                        <div className="space-y-4">
                                            {/* Direct */}
                                            <div className="grid grid-cols-[80px_48px_1fr] gap-3 items-center">
                                                <div className="text-black text-[18px] font-['HarmonyOS_Sans_SC'] font-normal capitalize">Direct</div>
                                                <div className="text-right text-[#4B68FF] text-[18px] font-['HarmonyOS_Sans_SC'] font-normal capitalize">{results.dependents.direct}</div>
                                                <div className="h-4 rounded-lg overflow-hidden bg-[#F5F7FF]">
                                                    <div
                                                        className="h-full bg-[#4B68FF] rounded-lg"
                                                        style={{
                                                            width: `${(results.dependents.direct / (results.dependents.direct + results.dependents.indirect)) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Indirect */}
                                            <div className="grid grid-cols-[80px_48px_1fr] gap-3 items-center">
                                                <div className="text-black text-[18px] font-['HarmonyOS_Sans_SC'] font-normal capitalize">Indirect</div>
                                                <div className="text-right text-[#4B68FF] text-[18px] font-['HarmonyOS_Sans_SC'] font-normal capitalize">{results.dependents.indirect}</div>
                                                <div className="h-4 rounded-lg overflow-hidden bg-[#F5F7FF]">
                                                    <div
                                                        className="h-full bg-[#4B68FF] rounded-lg"
                                                        style={{
                                                            width: `${(results.dependents.indirect / (results.dependents.direct + results.dependents.indirect)) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 text-center">
                                            <Link href={`/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependents`}>
                                                <span className="text-[#4B68FF] text-[18px] font-['HarmonyOS_Sans_SC'] font-normal hover:underline">
                                                    View all dependents ({results.dependents.direct + results.dependents.indirect})
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-[#333333] font-['HarmonyOS_Sans_SC'] text-[18px] font-normal leading-normal capitalize">
                                        This Package Has No Known Dependents.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 右侧内容区域 - 占据1列 */}
                        <div className="space-y-6">
                            {/* Documentation */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <Image
                                        src="/images/homepage/3.png"
                                        alt="icon"
                                        width={16}
                                        height={16}
                                        className="flex-shrink-0 rounded-[16.05px] border-[1.6px] border-[#333333]"
                                    />
                                    <h2 className="text-[18px] font-bold text-[#333333] tracking-[0.72px] font-['HarmonyOS_Sans_SC']">
                                        Documentation
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[14px] text-[#333333] font-['HarmonyOS_Sans_SC'] font-normal whitespace-nowrap">
                                            Documentation URL:
                                        </h3>
                                        <a
                                            href={results?.doc_url}
                                            className="text-[#4B68FF] text-[14px] font-['HarmonyOS_Sans_SC'] font-normal hover:underline break-all"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {results?.doc_url || 'No results available'}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* GitHub Links */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <Image
                                        src="/images/homepage/4.png"
                                        alt="icon"
                                        width={16}
                                        height={16}
                                        className="flex-shrink-0 rounded-[16.05px] border-[1.6px] border-[#333333]"
                                    />
                                    <h2 className="text-[18px] font-bold text-[#333333] tracking-[0.72px] font-['HarmonyOS_Sans_SC']">
                                        GitHub Links
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[14px] text-[#333333] font-['HarmonyOS_Sans_SC'] font-normal whitespace-nowrap">
                                            GitHub URL:
                                        </h3>
                                        <a
                                            href={results?.github_url}
                                            className="text-[#4B68FF] text-[14px] font-['HarmonyOS_Sans_SC'] font-normal hover:underline break-all"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {results?.github_url || 'No results available'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {/* 第一个摘要 */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <Image
                                        src="/images/homepage/1.png"
                                        alt="icon"
                                        width={16}
                                        height={16}
                                        className="flex-shrink-0 rounded-[16.05px] border-[1.6px] border-[#333333]"
                                    />
                                    <h2 className="text-[18px] font-bold text-[#333333] tracking-[0.72px] font-['HarmonyOS_Sans_SC']">
                                        SenseLeak
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <a
                                            href={basePath + '/senseleak'}
                                            className="text-[#4B68FF] text-[14px] font-['HarmonyOS_Sans_SC'] font-normal hover:underline break-all"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {basePath + '/senseleak' || 'No results available'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {/* Mirchecker 部分 - 新增 */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <Image
                                        src="/images/homepage/1.png"
                                        alt="icon"
                                        width={16}
                                        height={16}
                                        className="flex-shrink-0 rounded-[16.05px] border-[1.6px] border-[#333333]"
                                    />
                                    <h2 className="text-[18px] font-bold text-[#333333] tracking-[0.72px] font-['HarmonyOS_Sans_SC']">
                                        Unsafechecker
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <a
                                            href={basePath + '/unsafechecker'}
                                            className="text-[#4B68FF] text-[14px] font-['HarmonyOS_Sans_SC'] font-normal hover:underline break-all"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {basePath + '/unsafechecker' || 'No results available'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {/* OpenSSF Scorecard */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Image
                                        src="/images/homepage/5.png"
                                        alt="icon"
                                        width={16}
                                        height={16}
                                        className="flex-shrink-0 rounded-[16.05px] border-[1.6px] border-[#333333]"
                                    />
                                    <h2 className="text-[18px] font-bold text-[#333333] tracking-[0.72px] font-['HarmonyOS_Sans_SC']">
                                        OpenSSF Scorecard
                                    </h2>
                                </div>
                                <p className="text-[14px] text-[#333333] font-['HarmonyOS_Sans_SC'] font-normal mb-4">
                                    The Open Source Security Foundation is a cross-industry collaboration to improve the security of
                                    open source software (OSS). The Scorecard provides security health metrics for open source projects.
                                </p>
                                <a href="#" className="text-[#4B68FF] text-[14px] font-['HarmonyOS_Sans_SC'] font-normal hover:underline block mb-6">
                                    View information about checks and how to fix failures.
                                </a>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-[24px] font-bold text-[#333333] font-['HarmonyOS_Sans_SC']">8.3/10</div>
                                    <div className="text-[14px] text-[#333333] font-['HarmonyOS_Sans_SC'] font-normal">Scorecard as of November 11, 2024</div>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { name: 'Code-Review', score: '10/10' },
                                        { name: 'Maintained', score: '10/10' },
                                        { name: 'CI/Best-Practices', score: '10/10' },
                                        { name: 'License', score: '10/10' },
                                        { name: 'Dangerous-Workflow', score: '10/10' },
                                        { name: 'Security-Policy', score: '10/10' },
                                        { name: 'Token-Permissions', score: '10/10' },
                                        { name: 'Binary-Artifacts', score: '10/10' },
                                        { name: 'Pinned-Dependencies', score: '10/10' }
                                    ].map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-[14px] text-[#333333] font-['HarmonyOS_Sans_SC'] font-normal">{item.name}</span>
                                            <span className="text-[14px] text-[#333333] font-['HarmonyOS_Sans_SC'] font-normal">{item.score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
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
};

export default CratePage;