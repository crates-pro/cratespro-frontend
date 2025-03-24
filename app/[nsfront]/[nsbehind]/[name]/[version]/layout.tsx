'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CrateNav from '@/components/CrateNav';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();

    return (
        <div className="mb-0">
            <CrateNav
                nsfront={params.nsfront as string}
                nsbehind={params.nsbehind as string}
                name={params.name as string}
                version={params.version as string}
            />
            {children}
        </div>
    );
} 