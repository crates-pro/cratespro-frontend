import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import NewHeader from '@/components/NewHeader';
import { useHeaderContext } from '../app/context/CrateContext';
import Image from 'next/image';

interface CrateNavProps {
    nsfront: string;
    nsbehind: string;
    name: string;
    version: string;
}

const CrateNav: React.FC<CrateNavProps> = ({ nsfront, nsbehind, name, version }) => {
    const pathname = usePathname();
    const router = useRouter();
    const basePath = `/${nsfront}/${nsbehind}/${name}/${version}`;
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { crateData, setCrateData } = useHeaderContext();

    const navItems = [
        { name: 'Overview', path: '' },
        { name: 'Dependencies', path: '/dependencies' },
        { name: 'Dependents', path: '/dependents' },
        { name: 'Versions', path: '/versions' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!crateData.results) {
                const response = await fetch(`/api/crates/${nsfront}/${nsbehind}/${name}/${version}`);
                const data = await response.json();
                setCrateData({
                    crateName: data.crate_name,
                    crateVersion: version,
                    results: data,
                });
            }
        };

        fetchData();
    }, [nsfront, nsbehind, name, version, setCrateData, crateData.results]);

    const isActive = (path: string) => {
        if (path === '') {
            return pathname === basePath;
        }
        if (path === '/dependencies') {
            return pathname === `${basePath}${path}` || pathname === `${basePath}${path}/graph`;
        }
        return pathname === `${basePath}${path}`;
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    // 判断是否在 graph page
    const isGraphPage = pathname.includes('/dependencies/graph');

    return (
        <div>
            <div className="flex justify-center w-full">
                <div className="w-[1500px] px-8">
                    <NewHeader />
                </div>
            </div>
            <div className="flex justify-center py-3">
                <div className="w-[1440px] h-[120px] bg-white rounded-2xl shadow-[0_0_12px_0_rgba(43,88,221,0.09)] px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-semibold" style={{ color: 'rgb(28, 63, 115)' }}>{name}</h1>
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center justify-between w-[150px] h-[36px] flex-shrink-0 rounded-[18.5px] border border-[#333333] bg-white px-4"
                                >
                                    <span>{version}</span>
                                    <Image
                                        src={isOpen ? "/images/homepage/verison-up.png" : "/images/homepage/version-down.png"}
                                        alt="version"
                                        width={16}
                                        height={16}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="absolute mt-1 w-full z-50">
                                        <div className="fixed inset-0" onClick={closeDropdown}></div>
                                        <div className="relative w-[150px] h-[196px] flex-shrink-0 rounded-[16px] bg-white border border-gray-300 shadow-lg">
                                            <div className="p-2 border-b border-gray-100">
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-[125px] h-[30px] flex-shrink-0 rounded-[9.5px] bg-white focus:bg-[#E2E9FF] border border-[#E5E5E5] focus:outline-none px-2"
                                                />
                                            </div>
                                            <ul className="max-h-[150px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&:hover::-webkit-scrollbar]:block [&:hover::-webkit-scrollbar]:w-1 [&:hover::-webkit-scrollbar-thumb]:bg-gray-300 [&:hover::-webkit-scrollbar-track]:bg-transparent">
                                                <Link
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                        closeDropdown();
                                                    }}
                                                    href={`/${nsfront}/${nsbehind}/${name}/all`}
                                                >
                                                    <li className="px-4 py-2 hover:bg-[#E2E9FF] cursor-pointer">
                                                        all
                                                    </li>
                                                </Link>
                                                {crateData.results?.versions
                                                    .filter(version => version.toLowerCase().includes(searchTerm.toLowerCase()))
                                                    .map((version, index) => (
                                                        <Link
                                                            key={index}
                                                            onClick={() => {
                                                                setSearchTerm('');
                                                                closeDropdown();
                                                            }}
                                                            href={`/${nsfront}/${nsbehind}/${name}/${version}`}
                                                        >
                                                            <li className="px-4 py-2 hover:bg-[#E2E9FF] cursor-pointer">
                                                                {version}
                                                            </li>
                                                        </Link>
                                                    ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <nav className="flex space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={`${basePath}${item.path}`}
                                    className={`py-4 px-2 relative font-['HarmonyOS_Sans_SC'] text-center min-w-[108px] ${isActive(item.path)
                                        ? 'text-blue-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {item.name}
                                    {isActive(item.path) && (
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[108px] h-[4px] flex-shrink-0 rounded-t-[3px] bg-[#4B68FF]"></div>
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Show List 按钮 - 仅在 graph page 显示 */}
                        {isGraphPage && (
                            <button
                                onClick={() => router.push(`${basePath}/dependencies`)}
                                className="bg-white w-[163px] h-[42px] flex-shrink-0 rounded-[21px] shadow-[0_0_12px_0_#2b58dd17] flex items-center justify-center hover:bg-[#3a57f0] transition-colors group"
                            >
                                <span className="font-['HarmonyOS_Sans_SC'] text-lg font-bold text-[#4B68FF] group-hover:text-white">
                                    Show List
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrateNav; 