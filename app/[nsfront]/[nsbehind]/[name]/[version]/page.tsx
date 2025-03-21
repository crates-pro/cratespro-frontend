// Overview页面
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cratesInfo } from '@/app/lib/all_interface';
import { useParams } from 'next/navigation';
import { Pagination } from 'antd';
import NewHeader from '@/components/NewHeader';

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
    <div className="bg-white p-4 rounded-lg border border-gray-200">
        {/* 标题和ID */}
        <div className="mb-2">
            <p className="text-red-600 font-medium">
                {cve.subtitle || 'No subtitle available'}
            </p>
            <p className="text-gray-600">
                {cve.id || 'No ID available'}
            </p>
        </div>

        {/* 时间信息 */}
        <div className=" mb-2 ">
            <div>
                <span className="font-medium text-gray-500 mr-4">Reported </span>
                <span className="text-gray-600">{cve.reported || 'Not specified'}</span>
            </div>

        </div>

        {/* 时间信息 */}
        <div className="mb-2">
            <span className="font-medium text-gray-500 mr-4">Issued </span>
            <span className="text-gray-600">{cve.issued || 'Not specified'}</span>
        </div>



        {/* 包信息 */}
        <div className="mb-2">
            <span className="text-sm font-medium text-gray-500 mr-4">Package </span>
            <span className="text-gray-600">{cve.package || 'No package info'}</span>
        </div>




        {/* 类型信息 */}
        {cve.ttype && (
            <div className="mb-2 ">
                <span className="text-sm font-medium text-gray-500 mr-4">Type </span>
                <span className="text-gray-600">{cve.ttype}</span>
            </div>
        )}


        {/* 别名信息 */}
        {cve.aliases && (
            <div className="mb-2">
                <span className="text-sm font-medium text-gray-500 mr-4">Aliases </span>
                <span className="text-gray-600">{Array.isArray(cve.aliases) ? cve.aliases.join(', ') : cve.aliases}</span>
            </div>

        )}

        {/* 关键词 */}
        {cve.keywords && (
            <div className="mb-2">
                <span className="text-sm font-medium text-gray-500 mr-4">Keywords </span>
                <span className="text-gray-600">{cve.keywords}</span>
            </div>
        )}


        {/* 修复状态 */}
        {cve.patched && (
            <div className="mb-2">
                <span className="text-sm font-medium text-gray-500 mr-4">Patched </span>
                <span className="text-gray-600">{cve.patched}</span>
            </div>

        )}

        {/* 未受影响版本 */}
        {cve.unaffected && (
            <div className="mb-2">
                <span className="text-sm font-medium text-gray-500 mr-4">Unaffected </span>
                <span className="text-gray-600">{cve.unaffected}</span>
            </div>

        )}

        {/* URL */}
        {cve.url && (
            <div className="mb-2">
                <span className="text-sm font-medium text-gray-500 mr-4">Url </span>
                <a
                    href={cve.url}

                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-all"
                >
                    {cve.url}
                </a>
            </div>
        )}

        {/* 引用链接 */}
        {cve.reference && (
            <div className="mb-2">
                <p className="text-sm font-medium text-gray-500">Reference</p>
                <div className="text-blue-500 hover:underline break-all">
                    {cve.reference.split(' ').map((url: string, i: number) => (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            {url}
                        </a>
                    ))}
                </div>
            </div>
        )}

        {/* 描述信息 */}
        {cve.description && (
            <div className="mb-2">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-gray-600">{cve.description}</p>
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
    const itemsPerPage = 1;

    useEffect(() => {
        const fetchCrateData = async () => {
            try {
                const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setResults(data);
                console.log('data in overviewwwwwwwww:', data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchCrateData();
    }, [params.name, params.version, params.nsfront, params.nsbehind]);
    console.log('results in overviewwwwwwwww:', results);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // 计算当前页的 CVE 数据
    const getCurrentPageItems = (items: CVE[], currentPage: number) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
    };

    return (
        <div style={{ width: '90%', margin: '0 auto' }}>
            <div className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">

                    {/* Security Advisories 主框 */}
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
                        {/* Security Advisories 标题 */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl">Security Advisories</h2>
                                <span
                                    className="text-white px-3 py-1 rounded-full text-sm"
                                    style={{
                                        backgroundColor: results && (results.cves?.length + results.dep_cves?.length) > 0
                                            ? 'rgb(179, 20, 18)'
                                            : 'rgb(34, 197, 94)'
                                    }}
                                >
                                    {results ? (results.cves?.length || 0) + (results.dep_cves?.length || 0) : 0}
                                </span>
                            </div>
                        </div>

                        {/* 两个子框的容器 */}
                        <div className="space-y-6">
                            {/* In this package 框 */}
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold">In this package</h3>
                                    <span className="text-white px-3 py-1 rounded-full text-sm"
                                        style={{ backgroundColor: (results?.cves && results.cves.length > 0) ? 'rgb(179, 20, 18)' : 'rgb(34, 197, 94)' }}>
                                        {results?.cves?.length || 0}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {results?.cves && results.cves.length > 0 ? (
                                        <>
                                            {getCurrentPageItems(results.cves, packageCurrentPage).map((cve, index) => (
                                                <CveCard key={index} cve={cve} />
                                            ))}
                                            {results.cves.length > itemsPerPage && (
                                                <div className="mt-4 flex justify-center">
                                                    <Pagination
                                                        current={packageCurrentPage}
                                                        onChange={setPackageCurrentPage}
                                                        total={results.cves.length}
                                                        pageSize={itemsPerPage}
                                                        size="small"
                                                        showSizeChanger={false}
                                                        simple
                                                    />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-500">No vulnerabilities found</p>
                                    )}
                                </div>
                            </div>

                            {/* In the dependencies 框 */}
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold">In the dependencies</h3>
                                    <span className="text-white px-3 py-1 rounded-full text-sm"
                                        style={{ backgroundColor: results && results.dep_cves && results.dep_cves.length > 0 ? 'rgb(179, 20, 18)' : 'rgb(34, 197, 94)' }}>
                                        {results?.dep_cves?.length || 0}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {results?.dep_cves && results.dep_cves.length > 0 ? (
                                        <>
                                            {getCurrentPageItems(results.dep_cves, depCurrentPage).map((cve, index) => (
                                                <CveCard key={index} cve={cve} />
                                            ))}
                                            {results.dep_cves.length > itemsPerPage && (
                                                <div className="mt-4 flex justify-center">
                                                    <Pagination
                                                        current={depCurrentPage}
                                                        onChange={setDepCurrentPage}
                                                        total={results.dep_cves.length}
                                                        pageSize={itemsPerPage}
                                                        size="small"
                                                        showSizeChanger={false}
                                                        simple
                                                    />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-500">No vulnerabilities found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Licenses */}
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
                        <h2 className="text-3xl mb-2">Licenses</h2>
                        <a
                            href={'#'}
                            className="hover:underline"
                            style={{ color: 'rgb(25,135,188)' }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Learn more about license information.
                        </a>
                        <div className="mb-1 mt-6">
                            <span className="">LICENSES</span>
                        </div>
                        <div className='mb-3 text-2xl'>
                            <span>{results ? results.license : 'No results available'}</span>
                        </div>
                    </div>

                    {/* Dependencies */}
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl mb-2">Dependencies</h2>
                            <span className="text-m border border-gray-300 p-1 w-auto rounded inline-block">
                                {results ? results.dependencies.direct + results.dependencies.indirect : 0}
                            </span>
                        </div>
                        {/* Direct */}
                        <div className="mb-1 mt-6 flex items-center">
                            <div style={{ color: 'rgb(25,135,188)', width: '100px' }}>Direct</div>
                            <span className="mr-1" style={{ color: 'rgb(25,135,188)', width: '50px', textAlign: 'right' }}>
                                {results ? JSON.stringify(results.dependencies.direct) : 'No cves detected.'}
                            </span>
                            <div className="flex-grow bg-gray-200 h-2 rounded">
                                <div
                                    style={{
                                        width: `${results && (results.dependencies.direct + results.dependencies.indirect) > 0
                                            ? (results.dependencies.direct / (results.dependencies.direct + results.dependencies.indirect)) * 100
                                            : 0 // 当分母为0时，条状图宽度直接设为0%
                                            }%`,
                                        backgroundColor: 'rgb(50,165,224)',
                                    }}
                                    className="h-full rounded"
                                ></div>
                            </div>
                        </div>
                        {/* Indirect */}
                        <div className="mb-2 flex items-center">
                            <div style={{ color: 'rgb(25,135,188)', width: '100px' }}>Indirect</div>
                            <span className="mr-1" style={{ color: 'rgb(25,135,188)', width: '50px', textAlign: 'right' }}>
                                {results ? JSON.stringify(results.dependencies.indirect) : 'No results available'}
                            </span>
                            <div className="flex-grow bg-gray-200 h-2 rounded">
                                <div
                                    style={{
                                        width: `${results && (results.dependencies.direct + results.dependencies.indirect) > 0
                                            ? (results.dependencies.indirect / (results.dependencies.direct + results.dependencies.indirect)) * 100
                                            : 0
                                            }%`,
                                        backgroundColor: 'rgb(50,165,224)',
                                    }}
                                    className="h-full rounded"
                                ></div>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <Link
                                href={`/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependencies`}
                            >
                                <div className="font-bold hover:underline" style={{ color: 'rgb(0,137,205)' }}>
                                    View all dependencies
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Dependents */}
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl mb-2">Dependents</h2>
                            <span className="text-m border border-gray-300 p-1 w-auto rounded inline-block">
                                {results ? results.dependents.direct + results.dependents.indirect : 0}
                            </span>
                        </div>
                        {/* Direct */}
                        <div className="mb-1 mt-6 flex items-center">
                            <div style={{ color: 'rgb(25,135,188)', width: '100px' }}>Direct</div>
                            <span className="mr-1" style={{ color: 'rgb(25,135,188)', width: '50px', textAlign: 'right' }}>
                                {results ? JSON.stringify(results.dependents.direct) : 'No results available'}
                            </span>

                            <div className="flex-grow bg-gray-200 h-2 rounded overflow-hidden">
                                <div
                                    style={{
                                        width: `${results && (results.dependents.direct + results.dependents.indirect) > 0
                                            ? (results.dependents.direct / (results.dependents.direct + results.dependents.indirect)) * 100
                                            : 0 // 当分母为0时，条状图宽度直接设为0%
                                            }%`,
                                        backgroundColor: 'rgb(50,165,224)',
                                    }}
                                    className="h-full rounded"
                                ></div>
                            </div>
                        </div>
                        {/* Indirect */}
                        <div className="mb-2 flex items-center">
                            <div style={{ color: 'rgb(25,135,188)', width: '100px' }}>Indirect</div>
                            <span className="mr-1" style={{ color: 'rgb(25,135,188)', width: '50px', textAlign: 'right' }}>
                                {results ? JSON.stringify(results.dependents.indirect) : 'No results available'}
                            </span>
                            <div className="flex-grow bg-gray-200 h-2 rounded overflow-hidden">
                                <div
                                    style={{
                                        width: `${results && (results.dependents.direct + results.dependents.indirect) > 0
                                            ? (results.dependents.indirect / (results.dependents.direct + results.dependents.indirect)) * 100
                                            : 0 // 当分母为0时，将宽度设为0%
                                            }%`,
                                        backgroundColor: 'rgb(50,165,224)',
                                    }}
                                    className="h-full rounded"
                                ></div>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <Link href={`/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependents`}>
                                <div className="font-bold hover:underline" style={{ color: 'rgb(0,137,205)' }}>
                                    View all dependents
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>

                {/* 新增的块: doc_url 和 github_url */}
                <div className="space-y-6">
                    <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-300" style={{ maxWidth: '80%', marginLeft: 'auto' }}>
                        <h2 className="text-3xl mb-2">Documentation & GitHub Links</h2>
                        <div className="mb-2">
                            <span className="">Documentation URL: </span>
                            <a
                                href={results ? results.doc_url : 'No results available'}
                                className="hover:underline"
                                style={{ color: 'rgb(25,135,188)' }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {results && results.doc_url !== '' ? results.doc_url : 'No results available'}
                            </a>
                        </div>
                        <div className="mb-2">
                            <span className="">GitHub URL: </span>
                            <a
                                href={results ? results.github_url : 'No results available'}
                                className="hover:underline"
                                style={{ color: 'rgb(25,135,188)' }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {results ? results.github_url : 'No results available'}
                            </a>
                        </div>
                    </div>

                    {/* OpenSSF scorecard */}
                    <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-300" style={{ maxWidth: '80%', marginLeft: 'auto' }}>
                        <h2 className="text-3xl mb-2">OpenSSF scorecard</h2>
                        <p>The Open Source Security Foundation is a cross-industry collaboration to improve the security of open source software (OSS). The Scorecard provides security health metrics for open source projects.</p>
                        <a href="#" className="hover:underline" style={{ color: 'rgb(25,135,188)' }}>View information about checks and how to fix failures.</a>
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-3xl">8.3/10</div>
                            <div className="text-sm text-gray-500">Scorecard as of November 11, 2024.</div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between"><span>Code-Review</span><span>10/10</span></div>
                            <div className="flex justify-between"><span>Maintained</span><span>10/10</span></div>
                            <div className="flex justify-between"><span>CI/Best-Practices</span><span>0/10</span></div>
                            <div className="flex justify-between"><span>License</span><span>10/10</span></div>
                            <div className="flex justify-between"><span>Dangerous-Workflow</span><span>10/10</span></div>
                            <div className="flex justify-between"><span>Security-Policy</span><span>10/10</span></div>
                            <div className="flex justify-between"><span>Token-Permissions</span><span>10/10</span></div>
                            <div className="flex justify-between"><span>Binary-Artifacts</span><span>10/10</span></div>
                            <div className="flex justify-between"><span>Pinned-Dependencies</span><span>0/10</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CratePage;