'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs } from 'antd';
import { useState, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

import clsx from 'clsx';


interface Crates {
    name: string;
    time: string;
}

export default function ProfilePage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('1');
    // const [results, setResults] = useState<profileResult | null>(null);
    const [uploadCrates, setUploadCrates] = useState<Crates[]>([]);

    const [isModalOpen, setModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isGithubLink, setIsGithubLink] = useState(true); // 控制输入类型
    //暂定上传数据类型为react表单类型
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        const currentTime = new Date().toISOString();
        const email = session?.user?.email || ''; // 提供默认空字符串

        if (isGithubLink) {
            formData.append('githubLink', inputValue);
        } else if (file) {
            formData.append('file', file);
        }

        formData.append('uploadTime', currentTime);
        formData.append('user_email', email); // 现在 email 一定是字符串类型
        try {
            //用fetch向服务器发声POST请求，提交用户输入的内容
            const response = await fetch('/api/submitCrate', {  // 待替换为服务器API
                method: 'POST',
                //请求体，将对象转换为json字符串
                body: formData,
            });
            //响应处理，根据响应结果显示提示信息，并重置输入框或关闭弹窗
            if (response.ok) {
                alert('内容提交成功！');//提交成功后重置输入框的值，并关闭弹窗
                setInputValue('');
                setFile(null);
                setModalOpen(false);
            } else {
                alert('提交失败，请重试。');
            }
        } catch (error) {
            console.error('提交错误:', error);
            alert('提交失败，请检查网络连接。');
        }
    };

    useEffect(() => {
        const fetchProfileInfo = async () => {
            console.log('session in useEffect:', session);
            if (!session) return;
            console.log('!!!!!!!!!!!!!!!!');
            try {
                const response = await fetch(`/api/profile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(session.user?.email),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const rep = await response.json();

                console.log('rep :', rep);
                // setResults(rep);
                setUploadCrates(rep.crates);


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchProfileInfo();
    }, [session]);

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Please login first</h1>
                </div>
            </div>
        );
    }
    console.log('uploadCrates :', uploadCrates);
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top bar: Return Home button on the left, Profile Info on the right */}
            <header className="bg-white border-b">
                <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-6">
                    {/* Left: Return Home Button */}
                    <div>
                        <Link href="/">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                                Return Home
                            </button>
                        </Link>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)} //点击打开弹窗
                        className={clsx(
                            'mt-4 flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-800 hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
                        )}
                    >
                        <PaperAirplaneIcon className="w-6" /> {/* 使用的图标 */}
                        Submit
                    </button>

                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-md w-96 ">
                                <h2 className="text-lg font-bold mb-4">Submit Crates</h2>
                                {/* 表单元素，包裹输入控件和提交按钮 */}
                                <form onSubmit={handleSubmit}> {/* 将表单的提交事件绑定到handleSubmit函数，处理用户提交逻辑 */}
                                    <div className="mb-4">
                                        <label>
                                            <input
                                                type="radio"
                                                value="github"
                                                checked={isGithubLink}
                                                onChange={() => setIsGithubLink(true)}
                                            />
                                            GitHub Link
                                        </label>
                                        <label className="ml-4">
                                            <input
                                                type="radio"
                                                value="zip"
                                                checked={!isGithubLink}
                                                onChange={() => setIsGithubLink(false)}
                                            />
                                            Upload ZIP File
                                        </label>
                                    </div>

                                    {isGithubLink ? (
                                        <input
                                            type="url"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="Enter GitHub URL..."
                                            required
                                        />
                                    ) : (
                                        <div>
                                            {/*<label className="block mb-2">Select a ZIP file:</label>*/}
                                            <input
                                                type="file"
                                                accept=".zip"
                                                onChange={(e) => {
                                                    const selectedFile = e.target.files?.[0]; // 使用可选链操作符检查 files 是否为 null
                                                    if (selectedFile) {
                                                        setFile(selectedFile);
                                                    } else {
                                                        setFile(null); // 如果没有文件选择，清空文件状态
                                                    }
                                                }}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setModalOpen(false)}
                                            className="mr-2 rounded-md bg-gray-300 p-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-blue-600 text-white p-2"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Right: Profile Info */}
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <Image
                                src={session.user?.image || '/default-avatar.png'}
                                alt="Profile"
                                width={100}
                                height={100}
                                className="rounded-full"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-1">{session.user?.name}</h1>
                            <p className="text-gray-600 mb-2">{session.user?.email}</p>
                            <button className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area (Tabs) */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: '1',
                            label: 'Overview',
                            children: <OverviewTab />,
                        },
                        {
                            key: '2',
                            label: 'My Favorites',
                            children: <FavoritesTab />,
                        },
                        {
                            key: '3',
                            label: 'Uploads',
                            children: <UploadsTab uploadCrates={uploadCrates || []} />,
                        },
                        {
                            key: '4',
                            label: 'Analysis History',
                            children: <AnalysisHistoryTab />,
                        },
                    ]}
                />
            </div>
        </div>
    );
}

// Overview Tab component
function OverviewTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity Stats */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Activity Stats</h3>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span>Analysis Count</span>
                        <span className="font-semibold">123</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Favorites Count</span>
                        <span className="font-semibold">45</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Crate Uploads</span>
                        <span className="font-semibold">12</span>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex-1">
                            <p className="text-sm">Analyzed tokio crate</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex-1">
                            <p className="text-sm">Favorited serde crate</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// My Favorites Tab component
function FavoritesTab() {
    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">My Favorites</h3>
                {/* Favorites list */}
                <div className="space-y-4">
                    {/* Sample favorite item */}
                    <div className="border-b pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-medium">serde</h4>
                                <p className="text-sm text-gray-600">
                                    A generic serialization/deserialization framework
                                </p>
                            </div>
                            <button className="text-red-500 hover:text-red-600">
                                Unfavorite
                            </button>
                        </div>
                    </div>
                    {/* More favorite items... */}
                </div>
            </div>
        </div>
    );
}

// Uploads Tab component
function UploadsTab({ uploadCrates }: { uploadCrates: Crates[] }) {
    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Uploads</h3>
                <div className="space-y-4">
                    {uploadCrates.map((crate: Crates, index: number) => (
                        <div key={index} className="border-b pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-lg font-medium">{crate.name}</h4>
                                    <p className="text-sm text-gray-600">Upload Time: {crate.time}</p>
                                </div>
                                <button className="text-blue-500 hover:text-blue-600">
                                    View Analysis
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Analysis History Tab component
function AnalysisHistoryTab() {
    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Analysis History</h3>
                {/* Analysis history list */}
                <div className="space-y-4">
                    {/* Sample analysis item */}
                    <div className="border-b pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-medium">tokio (v1.36.0)</h4>
                                <p className="text-sm text-gray-600">Analysis Time: 2024-03-21</p>
                            </div>
                            <button className="text-blue-500 hover:text-blue-600">
                                View Report
                            </button>
                        </div>
                    </div>
                    {/* More analysis items... */}
                </div>
            </div>
        </div>
    );
} 