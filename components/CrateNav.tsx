import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NewHeader from '@/components/NewHeader';

interface CrateNavProps {
    nsfront: string;
    nsbehind: string;
    name: string;
    version: string;
}

const CrateNav: React.FC<CrateNavProps> = ({ nsfront, nsbehind, name, version }) => {
    const pathname = usePathname();
    const basePath = `/${nsfront}/${nsbehind}/${name}/${version}`;

    const navItems = [
        { name: 'Overview', path: '' },
        { name: 'Dependencies', path: '/dependencies' },
        { name: 'Dependents', path: '/dependents' },
        { name: 'Versions', path: '/versions' },
    ];

    const isActive = (path: string) => {
        if (path === '') {
            return pathname === basePath;
        }
        return pathname === `${basePath}${path}`;
    };

    return (
        <div>
            <NewHeader />
            <nav className="border-b border-gray-200 mb-4">
                <div className="flex space-x-8 px-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={`${basePath}${item.path}`}
                            className={`py-4 px-2 border-b-2 ${isActive(item.path)
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default CrateNav; 