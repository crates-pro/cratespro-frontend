//Dependencies页面
"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'

import DependencyTable from '../../../../../../../components/DependencyTable';
import { dependenciesInfo } from '@/app/lib/all_interface';


const CratePage = () => {
    const params = useParams();

    const [results, setResults] = useState<dependenciesInfo | null>(null);


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchCrateData = async () => {
            try {
                setError(null);
                const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependencies`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();


                setResults(data); // 设置获取的数据

            } catch (error) {
                console.log('Error fetching data:', error);
            } finally {
                setLoading(false); // 完成加载
            }
        };
        fetchCrateData(); // 调用函数来获取数据
    }, [params.name, params.version, params.nsfront, params.nsbehind]); // 依赖项数组，确保在 crateName 或 version 改变时重新获取数据

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    // console.log('dependencyyyyyyyyyyyyyyy', results?.data);
    return (
        <>
            {/* Existing header and search */}

            <DependencyTable data={results?.data} />
        </>

    );
};

export default CratePage;