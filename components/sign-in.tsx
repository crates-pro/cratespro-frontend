'use client';

import { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

export default function SignInButton() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session) {
            // 提交 session 到后端
            fetch('api/submitUserinfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('成功提交 session:', data);
                })
                .catch(error => {
                    console.error('提交 session 失败:', error);
                });
        }
    }, [session]); // 依赖于 session

    if (status === 'loading') {
        return (
            <button className="bg-gray-200 text-gray-400 px-4 py-2 rounded-md cursor-not-allowed">
                Loading...
            </button>
        );
    }

    if (session) {
        const items: MenuProps['items'] = [
            {
                key: '1',
                label: <Link href={`/profile/${session.user?.name}`}>个人中心</Link>,
            },
            {
                key: '2',
                label: <span onClick={() => signOut()}>退出登录</span>,
            },
        ];

        return (
            <Dropdown menu={{ items }} placement="bottomRight">
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                        {session.user?.image && (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || 'User avatar'}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        )}
                        <span className="text-sm text-gray-700">{session.user?.name}</span>
                    </div>
                </div>
            </Dropdown>
        );
    }

    return (
        <button
            onClick={async () => {

                await signIn("github")
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
        >
            <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                />
            </svg>
            登录
        </button>
    );
}