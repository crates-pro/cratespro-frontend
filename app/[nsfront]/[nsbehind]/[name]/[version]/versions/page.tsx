//Versions页面
"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import VersionsTable from '@/components/VersionsTable';

interface VersionInfo {
    version: string;
    updated_at: string;
    downloads: string;
    dependents: number;
}

const CratePage = () => {
    const [results, setResults] = useState<VersionInfo[] | undefined>(undefined);
    console.log(results);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();

    useEffect(() => {
        const fetchCrateData = async () => {
            try {
                setError(null);
                const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/versions`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setResults(data); // 设置获取的数据
            } catch (error) {
                console.log('Error fetching data:', error);
                setError("Failed to fetch data.");
            } finally {
                setLoading(false); // 完成加载
            }
        };
        fetchCrateData(); // 调用函数来获取数据
    }, [params.name, params.version, params.nsfront, params.nsbehind]); // 依赖项数组，确保在参数改变时重新获取数据

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="flex justify-center w-full py-4">
                <div className="w-[1500px] px-8">
                    <VersionsTable />
                </div>
            </div>

            {/* 页脚 */}
            <footer className="bg-[#002851] text-white py-12 mt-auto">
                <div className="flex justify-center w-full">
                    <div className="w-[1500px] px-8">
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
                </div>
            </footer>
        </div>
    );
};

export default CratePage;