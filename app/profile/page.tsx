'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs } from 'antd';
import { useState } from 'react';

export default function ProfilePage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('1');

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Please login first</h1>
                </div>
            </div>
        );
    }

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
                            children: <UploadsTab />,
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
function UploadsTab() {
    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Uploads</h3>
                {/* Uploads list */}
                <div className="space-y-4">
                    {/* Sample upload item */}
                    <div className="border-b pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-medium">my-crate</h4>
                                <p className="text-sm text-gray-600">Upload Time: 2024-03-20</p>
                            </div>
                            <button className="text-blue-500 hover:text-blue-600">
                                View Analysis
                            </button>
                        </div>
                    </div>
                    {/* More upload items... */}
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