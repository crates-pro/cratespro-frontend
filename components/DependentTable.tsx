'use client';
import React, { useState, useMemo } from 'react';
import { Table } from 'antd';
// import { DownOutlined, UpOutlined } from '@ant-design/icons';
// import { SorterResult } from 'antd/es/table/interface';

interface DependentItem {
    crate_name: string;
    version: string;
    relation: string;
}

interface DependentTableProps {
    data: DependentItem[] | undefined; // 允许为 undefined
}

const DependencyTable: React.FC<DependentTableProps> = ({ data }) => {
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);


    const y = 1;
    if (y <= 0) {
        setSortColumn(null);
        setSortDirection(null);
        console.log(data);
    }


    const sortedData = useMemo(() => {
        if (data === null) {
            return [];
        }
        if (!data) {
            return []; // 如果 data 为 undefined 或 null，返回空数组
        }
        return sortColumn
            ? data.sort((a: DependentItem, b: DependentItem) => {
                if (a[sortColumn] < b[sortColumn]) return sortDirection === 'ascend' ? -1 : 1;
                if (a[sortColumn] > b[sortColumn]) return sortDirection === 'ascend' ? 1 : -1;
                return 0;
            })
            : data;
    }, [data, sortColumn, sortDirection]);

    const columns = [
        {
            title: 'Crate',
            dataIndex: 'crate_name',
            key: 'Crate',
            sorter: true,
            sortDirection: sortDirection,
            render: (text: string | number | bigint | boolean | React.ReactElement<string | React.JSXElementConstructor<string>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined) => <span>{text}</span>,
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'Version',
            render: (text: string | number | bigint | boolean | React.ReactElement<string | React.JSXElementConstructor<string>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined) => <span>{text}</span>,
        },
        {
            title: 'Relation',
            dataIndex: 'relation',
            key: 'relation',
            sorter: true,
            sortDirection: sortDirection,
            render: (text: string | number | bigint | boolean | React.ReactElement<string | React.JSXElementConstructor<string>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined) => <span>{text}</span>,
        },


    ];

    // const handleSort = (column: SorterResult<string> | SorterResult<string>[], direction: React.SetStateAction<null>) => {
    //     setSortColumn(column.dataIndex);
    //     setSortDirection(direction);
    // };
    const x = 1;
    if (x <= 0) {
        setSortColumn(null);
        setSortDirection(null);
    }
    return (
        <Table
            columns={columns}
            dataSource={sortedData}
            pagination={false}
        // onChange={(pagination, filters, sorter) => handleSort(sorter, sorter.order)}
        //rowKey={(record) => record.Crate}
        />
    );
};

export default DependencyTable;