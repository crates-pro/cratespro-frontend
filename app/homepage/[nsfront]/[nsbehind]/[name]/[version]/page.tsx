//Overview页面
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
//import { useSearchParams } from 'next/navigation';
import { cratesInfo } from '@/app/lib/all_interface';
import { useParams } from 'next/navigation';





const CratePage = () => {

    const params = useParams();






    const [results, setResults] = useState<cratesInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const fetchCrateData = async () => {
            try {
                const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('overviewwwwwwwwwwwwww:', data);

                setResults(data); // 设置获取的数据

            } catch (error) {
                console.log('Error fetching data:', error);
                setError('An error occurred');
            } finally {
                setLoading(false); // 完成加载
            }
        };


        fetchCrateData(); // 调用函数来获取数据
    }, [params.name, params.version, params.nsfront, params.nsbehind]); // 依赖项数组，确保在 name 或 version 改变时重新获取数据

    // 渲染部分
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;




    return (
        <div>
            {/* cve */}
            <div className="container mx-auto my-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {/* Security Advisories */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-lg font-bold mb-2">Security Advisories</h2>
                        <p>cve: {results ? JSON.stringify(results.cves) : 'No results available'}</p>
                    </div>
                    {/* Licenses */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-lg font-bold mb-2">Licenses</h2>
                        <div className="mb-2">
                            <span className="font-bold">LICENSES:</span> MIT
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">DEPENDENCY LICENSES:</span>
                            <ul className="list-disc pl-6">
                                <li>Apache-2.0 OR MIT (116)</li>
                                <li>MIT (27)</li>
                                <li>MIT OR Uniclicense (7)</li>
                                {/* Add more dependency licenses */}
                            </ul>
                        </div>
                    </div>
                    {/* Dependencies */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-lg font-bold mb-2">Dependencies</h2>
                        <div className="mb-2">
                            <span className="font-bold">Direct: {results ? JSON.stringify(results.dependencies.direct) : 'No results available'}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Indirect: {results ? JSON.stringify(results.dependencies.indirect) : 'No results available'}</span>
                        </div>
                        <Link
                            href={`/homepage/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependencies`}
                        >
                            <div className="text-blue-500 hover:underline">
                                View all dependencies
                            </div>
                        </Link>
                    </div>
                    {/* Dependents */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-lg font-bold mb-2">Dependents</h2>
                        <div className="mb-2">
                            <span className="font-bold">Direct: {results ? JSON.stringify(results.dependents.direct) : 'No results available'}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Indirect: {results ? JSON.stringify(results.dependents.indirect) : 'No results available'}</span>
                        </div>
                        <Link
                            href={`/homepage/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependents`}
                        >
                            <div className="text-blue-500 hover:underline">
                                View all dependencies
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-2">OpenSSF scorecard</h2>
                    <p>The Open Source Security Foundation is a cross-industry collaboration to improve the security of open source software (OSS). The Scorecard provides security health metrics for open source projects.</p>
                    <a href="#" className="text-blue-500 hover:underline">
                        View information about checks and how to fix failures.
                    </a>
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-3xl font-bold">8.3/10</div>
                        <div className="text-sm text-gray-500">Scorecard as of November 11, 2024.</div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Code-Review</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Maintained</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>CI/Best-Practices</span>
                            <span>0/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>License</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Dangerous-Workflow</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Security-Policy</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Token-Permissions</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Binary-Artifacts</span>
                            <span>10/10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Pinned-Dependencies</span>
                            <span>0/10</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CratePage;