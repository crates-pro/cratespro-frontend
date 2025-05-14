'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import CrateNav from '@/components/CrateNav';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const pathname = usePathname();

    // 判断当前页面是否为SenseLeak页面
    const isSenseLeakPage = pathname.includes('/senseleak');
    const isMircheckerPage = pathname.includes('/mirchecker');
    return (
        <div className="mb-0">
            {/* 仅在非SenseLeak页面显示导航栏 */}
            {!isSenseLeakPage && !isMircheckerPage && (
                <CrateNav
                    nsfront={params.nsfront as string}
                    nsbehind={params.nsbehind as string}
                    name={params.name as string}
                    version={params.version as string}
                />
            )}
            {children}
        </div>
    );
} 