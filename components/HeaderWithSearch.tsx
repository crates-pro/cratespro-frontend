// components/Header.js
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { message } from 'antd';

const Header = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [searchQuery, setSearchQuery] = useState('');

    const handleKeyPress = (e: { key: string; }) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const performSearch = () => {
        if (!searchQuery || searchQuery.trim() === '') {
            messageApi.warning('请输入搜索内容');
        }
        if (searchQuery.trim()) {
            window.location.href = `/search?crate_name=${searchQuery}`;
        }
    };

    return (
        <>
            {contextHolder}
            <header className="bg-white shadow p-4">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold">
                        <Link href="/">
                            <div className="text-xl font-bold flex items-center space-x-1">
                                <span style={{ color: 'rgb(57,62,70)' }}>open</span>
                                <span style={{ color: 'rgb(50,224,196)' }}>/</span>
                                <span style={{ color: 'rgb(57,62,70)' }}>source</span>
                                <span style={{ color: 'rgb(50,224,196)' }}>/</span>
                                <span style={{ color: 'rgb(57,62,70)' }}>insights</span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search for open source crates"
                            className="p-2 border-none rounded-md text-gray-800 w-80 max-w-2xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button className="bg-teal-600 text-white rounded-md p-2 ml-2 hover:bg-teal-700"
                            onClick={performSearch}
                        >
                            Search</button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;