import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { message } from "antd";

const NewHeader = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

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
            <div className="flex justify-center w-full bg-white">
                <header className="w-[1500px] py-3 px-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/">
                            <div className="flex items-center">
                                <Image
                                    src="/images/homepage/logo-top.png"
                                    alt="CratesPro"
                                    width={150}
                                    height={40}
                                />
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-[597px] h-[42px]">
                            <input
                                type="text"
                                placeholder="Search For Open Source Crates"
                                className="w-full h-full px-4 border rounded-[30px] focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <button
                            className="h-[42px] bg-[#002851] text-white px-6 rounded-[30px]"
                            onClick={performSearch}
                        >
                            Search
                        </button>
                    </div>
                </header>
            </div>
        </>
    );
}

export default NewHeader;