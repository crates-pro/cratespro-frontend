import React, { useState } from "react";
import Link from "next/link";

const NewHeader = () => {
    const [searchQuery, setSearchQuery] = useState('');
    return (

        <header className="bg-white shadow p-4">
            <div className="flex justify-between items-center">
                <Link href="/homepage">
                    <div className="text-xl font-bold flex items-center space-x-1">
                        <span>open</span>
                        <span className="text-green-500">/</span>
                        <span>source</span>
                        <span className="text-green-500">/</span>
                        <span>insights</span>
                    </div>
                </Link>
                <div className="flex items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search for open source crates"
                        className="p-2 border-none rounded-md text-gray-800 w-80 max-w-2xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // 更新搜索内容
                    />
                    <Link href={{
                        pathname: '/homepage/search',
                        query: {
                            crate_name: searchQuery, // 将搜索内容作为参数传递给新页面
                        },
                    }}>
                        <button className="bg-teal-600 text-white rounded-md p-2 ml-2 hover:bg-teal-700">Search</button>
                    </Link>
                </div>
            </div>
        </header>

    );
}
export default NewHeader;