'use client';
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useParams } from 'next/navigation';

// 假设后端接口返回的类型
interface VersionInfo {
    version: string;
    dependents: number; // 保持原始字段以便从API获取
}

// 新增 PublishDay 接口
interface FormattedVersionInfo extends VersionInfo {
    publishDay: string; // 新增字段
}

const VersionsTable: React.FC = () => {
    const [versionsData, setVersionsData] = useState<FormattedVersionInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();

    useEffect(() => {
        const fetchVersionsData = async () => {
            try {
                const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/versions`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: VersionInfo[] = await response.json();

                // 检查数据是否有效
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format');
                }

                // 将 API 数据转换为 Table 需要的格式
                const formattedData = data.map((item) => ({
                    version: item.version,
                    dependents: item.dependents, // 保留依赖数
                    publishDay: 'N/A', // 设置默认发布日为 N/A
                }));

                setVersionsData(formattedData); // 设置获取的数据
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unknown error occurred'); // 改进错误处理
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // 完成加载
            }
        };

        fetchVersionsData(); // 调用函数来获取数据
    }, [params.nsfront, params.nsbehind, params.name, params.version]); // 依赖项数组

    const columns = [
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Publish Day',
            dataIndex: 'publishDay', // 修改为使用 publishDay
            key: 'publishDay', // 修改为使用 publishDay
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Dependents Number',
            dataIndex: 'dependents',
            key: 'dependents',
            render: (text: number) => <span>{text}</span>,
        },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <Table
            columns={columns}
            dataSource={versionsData}
            pagination={false}
            rowKey="version" // 使用版本字符串作为唯一键
            loading={loading} // 显示加载状态
        />
    );
};

export default VersionsTable;