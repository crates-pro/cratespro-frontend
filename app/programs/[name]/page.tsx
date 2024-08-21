'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';

const CratePage = () => {
    const router = useRouter();
    const { name } = useParams();

    useEffect(() => {
        if (name) {
            fetch(`/api/crates/${name}`)
                .then(response => response.json())
                .then(data => {
                    const versions = data.versions || [];
                    if (versions.length > 0) {
                        const latestVersion = versions[versions.length - 1];
                        router.replace(`/programs/${name}/${latestVersion}`);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [name, router]);

    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
};

export default CratePage;
