'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Table } from 'antd';
import { useParams } from 'next/navigation';

// 假设后端接口返回的类型
interface VersionInfo {
    version: string;
    publishDay: string;
    dependentsNumber: number;
}

interface VersionsTableProps {
    data: string[] | undefined; // 传入的版本号数组
}

const VersionsTable: React.FC<VersionsTableProps> = ({ data }) => {
    const [versionsData, setVersionsData] = useState<VersionInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams();

    // 获取版本发布日的函数
    const fetchPublishDay = useCallback(async (version: string) => {
        try {
            const response = await fetch(`/api/publish-day/${version}`);
            if (!response.ok) {
                throw new Error('Failed to fetch publish day');
            }
            const data = await response.json();
            return data.publishDay || 'N/A'; // 如果没有返回值，则默认返回 'N/A'
        } catch (error) {
            console.error('Error fetching publish day:', error);
            return 'N/A'; // 请求失败时返回默认值
        }
    }, []);

    // 获取版本依赖数的函数
    const fetchDependentsNumber = useCallback(async (version: string) => {
        try {
            const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${version}/dependents`);
            if (!response.ok) {
                throw new Error('Failed to fetch dependents number');
            }
            const data = await response.json();
            return data.direct_count + data.indirect_count || 0; // 如果没有返回值，则默认返回 0
        } catch (error) {
            console.error('Error fetching dependents number:', error);
            return 0; // 请求失败时返回默认值
        }
    }, [params.nsfront, params.nsbehind, params.name]);

    // 请求版本的发布日和依赖数
    const fetchVersionDetails = useCallback(async (version: string) => {
        const publishDay = await fetchPublishDay(version);
        const dependentsNumber = await fetchDependentsNumber(version);
        return { version, publishDay, dependentsNumber };
    }, [fetchPublishDay, fetchDependentsNumber]);

    useEffect(() => {
        const fetchData = async () => {
            if (data && data.length > 0) {
                setLoading(true);
                const versionDetails = await Promise.all(
                    data.map(async (version) => {
                        return await fetchVersionDetails(version);
                    })
                );
                setVersionsData(versionDetails);
                setLoading(false);
            }
        };

        fetchData();
    }, [data, fetchVersionDetails]);

    const columns = [
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Publish Day',
            dataIndex: 'publishDay',
            key: 'publishDay',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Dependents Number',
            dataIndex: 'dependentsNumber',
            key: 'dependentsNumber',
            render: (text: number) => <span>{text}</span>,
        },
    ];

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