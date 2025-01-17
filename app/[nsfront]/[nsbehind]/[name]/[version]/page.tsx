// Overview页面
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
                setResults(data);
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

    return (
        <div style={{ width: '90%', margin: '0 auto' }}>
            <div className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">

                    {/* Security Advisories */}
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">

                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl mb-2">Security Advisories</h2>
                            <span
                                className="text-white border border-gray-300 p-1 w-auto rounded inline-block "
                                style={{ backgroundColor: 'rgb(179, 20, 18)' }}
                            >
                                {results ? results.cves.length + results.dep_cves.length : 0}
                            </span>
                        </div>
                        <h3 className="text-xl mt-3">In this package</h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                {results && results.cves && results.cves.length > 0 ? (
                                    results.cves.map((cve, index) => (
                                        <div key={index}>
                                            <p className="text-sm mt-4" style={{ color: 'rgb(179,20,18)' }}>
                                                {cve.id !== '' ? JSON.stringify(cve.small_desc) : 'No results available'}
                                            </p>
                                            <p className="text-grey-500 text-sm mt-0">
                                                {cve.id !== '' ? JSON.stringify(cve.id) : 'No results available'}
                                            </p>

                                            <p key={index} className="text-grey-500 text-sm ml-8">
                                                <div className='mt-0'>SIMILAR ADVISORIES</div>
                                                {cve.id !== '' ? JSON.stringify(cve.aliases) : 'No results available'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No results available</p>
                                )}
                            </div>
                            {/* <button
                                style={{
                                    marginLeft: '20px',
                                    border: '1px solid blue',
                                    color: 'blue',
                                    backgroundColor: 'white',
                                    padding: '10px 15px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => window.location.href = 'YOUR_LINK_HERE'}>
                                MORE DETAILS
                            </button> */}
                        </div>



                        <h3 className="text-xl mt-10">In the dependencies</h3>
                        <div>
                            {results && results.dep_cves && results.dep_cves.length > 0 ? (
                                results.dep_cves.map((dep_cves, index) => (
                                    <>
                                        <p key={index} className="text-sm mt-4" style={{ color: 'rgb(179,20,18)' }}>
                                            {dep_cves.id !== '' ? JSON.stringify(dep_cves.small_desc) : 'No results available'}
                                        </p>
                                        <p key={index} className="text-grey-500 text-sm mt-1">
                                            {dep_cves.id !== '' ? JSON.stringify(dep_cves.id) : 'No results available'}
                                        </p>
                                        <p key={index} className="text-grey-500 text-sm ml-8">
                                            <div className='mt-0'>SIMILAR ADVISORIES</div>
                                            {dep_cves.id !== '' ? JSON.stringify(dep_cves.aliases) : 'No results available'}
                                        </p>
                                    </>
                                ))
                            ) : (
                                <p>No results available</p>
                            )}
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