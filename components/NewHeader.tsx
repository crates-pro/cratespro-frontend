import React, { useState } from "react";
import Link from "next/link";
import { message } from "antd";


const NewHeader = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [messageApi, contextHolder] = message.useMessage();//antd-message的hooks调用
    console.log('sss:', contextHolder);
    const handleKeyPress = (e: { key: string; }) => {
        // 检查是否按下了回车键
        if (e.key === 'Enter') {
            // 如果是回车键，执行搜索
            performSearch();
        }
    };

    const performSearch = () => {
        if (!searchQuery || searchQuery.trim() === '') {

            messageApi.warning('请输入搜索内容');
            //alert("请输入搜索内容"); // 可选：提示用户输入内容
        }
        if (searchQuery.trim()) {
            // 使用 Link 跳转到搜索页面
            window.location.href = `/search?crate_name=${searchQuery}`;
        }
    };

    return (

        <header className="bg-white shadow p-4">
            <div className="flex justify-between items-center">
                <Link href="/">
                    <div className="text-xl font-bold flex items-center space-x-1">
                        <span style={{ color: 'rgb(57,62,70)' }}>open</span>
                        <span style={{ color: 'rgb(50,224,196)' }}>/</span>
                        <span style={{ color: 'rgb(57,62,70)' }}>source</span>
                        <span style={{ color: 'rgb(50,224,196)' }}>/</span>
                        <span style={{ color: 'rgb(57,62,70)' }}>insights</span>
                    </div>

                </Link>
                <div className="flex items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search for open source crates"
                        className="p-2 border-none rounded-md text-gray-800 w-80 max-w-2xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // 更新搜索内容
                        onKeyDown={handleKeyPress}
                    />
                    {/* <Link href={{
                        pathname: '/homepage/search',
                        query: {
                            crate_name: searchQuery, // 将搜索内容作为参数传递给新页面
                        },
                    }}> */}
                    <button className="bg-teal-600 text-white rounded-md p-2 ml-2 hover:bg-teal-700 "
                        onClick={performSearch}
                    >
                        Search</button>
                    {/* </Link> */}
                </div>
            </div>
        </header>

    );
}
export default NewHeader;