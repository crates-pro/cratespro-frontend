// Dependencies 页面
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DependencyTable from "@/components/DependencyTable";
// import DependencyGraph from "@/components/DependencyGraph"; // 假设你已经创建了 DependencyGraph 组件
import { dependenciesInfo } from "@/app/lib/all_interface";
import Link from "next/link";

const CratePage = () => {
    const params = useParams();
    // const currentVersion = params.version;
    // const crateName = params.name;
    const [results, setResults] = useState<dependenciesInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 新增状态：控制显示 DependencyTable 或 DependencyGraph
    const [showTable, setShowTable] = useState(true);

    useEffect(() => {
        const fetchCrateData = async () => {
            try {
                setError(null);
                const response = await fetch(
                    `/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependencies`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                setResults(data); // 设置获取的数据
            } catch (error) {
                console.log("Error fetching data:", error);
                setError("Failed to fetch data.");
            } finally {
                setLoading(false); // 完成加载
            }
        };
        fetchCrateData(); // 调用函数来获取数据
    }, [params.name, params.version, params.nsfront, params.nsbehind]); // 依赖项数组，确保在 crateName 或 version 改变时重新获取数据

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">

            {/* 切换按钮 */}
            <Link
                onClick={() => setShowTable(!showTable)} // 切换状态
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                href={`/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependencies/graph`}            >
                {showTable ? "Show Graph" : "Show Table"}
            </Link>

            <DependencyTable data={results?.data} />

        </div>
    );
};

export default CratePage;
