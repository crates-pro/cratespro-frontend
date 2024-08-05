'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CrateInfoCard, { CrateInfo } from '../../../components/CrateInfoCard';
import MaintainersList from '../../../components/MaintainersList';
import DependenciesList, { Dependency } from '../../../components/DependenciesList';
import DependencyGraph from '../../../components/DependencyGraph';
import VulnerabilitiesList, { Vulnerability } from '../../../components/VulnerabilitiesList';
import CrateInfoHeader from '../../../components/CrateInfoHeader';
import SecurityAdvisories from '../../../components/SecurityAdvisories';
import LicensesInfo from '../../../components/LicensesInfo';
import MetadataSection from '@/components/MetadataSection';

const CratePage = () => {
    const [crateInfo, setCrateInfo] = useState<CrateInfo | null>(null);
    const [dependencies, setDependencies] = useState<Dependency[]>([]);
    const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
    const { name } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (name) {
            fetch(`/api/crates/${name}`, {
                method: 'GET', // 明确指定使用 GET 方法
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text(); // 先返回文本
                })
                .then(text => {
                    try {
                        const data = JSON.parse(text); // 手动解析 JSON
                        setCrateInfo(data.crateInfo || null);
                        setDependencies(data.dependencies || []);
                        setVulnerabilities(data.vulnerabilities || []);
                    } catch (error) {
                        console.error('Error parsing JSON:', error, 'Response text:', text);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [name]);

    if (!crateInfo) {
        return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
    }

    return (
        <div className="flex flex-col h-screen">
            <Header onBack={() => router.back()} />
            <main className="flex-grow overflow-y-auto bg-gray-100">
                <div className="container mx-auto p-4 flex">
                    <div className="w-full md:w-2/3 pr-2">
                        <CrateInfoHeader name={crateInfo.name} version={crateInfo.version} />
                        <CrateInfoCard crateInfo={crateInfo} />
                        <MaintainersList maintainers={crateInfo?.maintainers || []} />
                        <SecurityAdvisories vulnerabilities={vulnerabilities} />
                        <LicensesInfo licenses={crateInfo.licenses} dependencyLicenses={crateInfo.dependencyLicenses} />
                        <MetadataSection
                            publishedDate={crateInfo.publishedDate}
                            description={crateInfo.description}
                            links={crateInfo.links}
                        />
                    </div>
                    <div className="w-full md:w-1/3 pl-2 border-l-2">
                        <VulnerabilitiesList vulnerabilities={vulnerabilities} />
                        <DependenciesList dependencies={dependencies} />
                        <DependencyGraph dependencies={dependencies} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CratePage;
