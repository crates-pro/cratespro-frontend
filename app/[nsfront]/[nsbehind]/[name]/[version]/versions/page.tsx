//Dependents页面
"use client";
import React, { useEffect, useState } from 'react';

import VersionsTable from '@/components/VersionsTable';
// import { VersionsInfo } from '@/app/lib/all_interface';
import { useParams } from 'next/navigation';

interface VersionInfo {
    version: string;
    // publishDay: string;
    dependents_number: number;
}

// interface VersionsTableProps {
//     data: VersionInfo[] | undefined;

// }

const CratePage = () => {
    const [results, setResults] = useState<VersionInfo[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const params = useParams();



    useEffect(() => {
        const fetchCrateData = async () => {
            try {
                const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/versions`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();


                setResults(data); // 设置获取的数据

            } catch (error) {
                setError(null);
                console.log('Error fetching data:', error);
            } finally {
                setLoading(false); // 完成加载
            }
        };
        fetchCrateData(); // 调用函数来获取数据
    }, [params.name, params.version, params.nsfront, params.nsbehind]); // 依赖项数组，确保在 crateName 或 version 改变时重新获取数据
    console.log('results in versionsssssss', results);
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;



    return (
        <div>

            <VersionsTable />

        </div>
    );
};

export default CratePage;