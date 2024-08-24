'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import CrateInfoCard from '../../../../components/CrateInfoCard';
import DependenciesList, { Dependency } from '../../../../components/DependenciesList';
import DependencyGraph, {GraphDependency} from '../../../../components/DependencyGraph';
import VulnerabilitiesList, { Vulnerability } from '../../../../components/VulnerabilitiesList';
import SecurityAdvisories from '../../../../components/SecurityAdvisories';
import BenchmarkResults from '../../../../components/BenchmarkResults';
import VersionsSelector from '../../../../components/VersionsSelector';
import { CrateInfo } from '@/app/lib/crate_info';


async function fetchDependencyTree(name: string, version: string) {
    const response = await fetch(`/api/crates/${name}/${version}`);
    const versionData = await response.json();
    
    const dependencies = versionData.dependencies || [];
    
    const dependenciesDetails = await Promise.all(dependencies.map(async (subDep: { name: string; version: string; }) => {
        return fetchDependencyTree(subDep.name, subDep.version);
    }));

    return {
        name,
        version,
        dependencies: dependenciesDetails
    };
}



const CratePage = () => {
    const router = useRouter();
    const [crateInfo, setCrateInfo] = useState<CrateInfo | null>(null);
    const [versions, setVersions] = useState<string[]>([]);
    const [dependencies, setDependencies] = useState<Dependency[]>([]);
    const [graphDependencies, setGraphDependencies] = useState<GraphDependency>();
    const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
    const [benchmarks, setBenchmarks] = useState<{ name: string; value: string }[]>([]);
    const { name, version } = useParams<{ name: string; version: string }>();


    const crateName = Array.isArray(name) ? name[0] : name;
    const currentVersion = Array.isArray(version) ? version[0] : version;


    useEffect(() => {
       
        fetch(`/api/crates/${crateName}`)
            .then(response => response.json())
            .then(data => {
                setCrateInfo(data.crateInfo || {});
                setVersions(data.versions || []);
            
                setBenchmarks(data.benchmarks || []);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    
    }, [crateName, currentVersion]);
 
    useEffect(()=>{
        fetch(`/api/crates/${name}/${version}`)
        .then(response => response.json())
        .then(data => {
            setVulnerabilities(data.vulnerabilities);
            setDependencies(data.dependencies);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });


    }, [crateName, currentVersion]);


    useEffect(() => {
        async function loadDependencies() {
            try {
                const graphDep = await fetchDependencyTree(crateName, currentVersion);
                console.log(graphDep);
                setGraphDependencies(graphDep);
            } catch (error) {
                console.error('Error fetching dependency tree:', error);
            }
        }
    
        if (crateName && currentVersion) {
            loadDependencies();
        }
    }, [crateName, currentVersion]);

    const handleVersionChange = (version: string) => {
        console.log(`Navigating to /programs/${name}/${version}`);
        router.push(`/programs/${name}/${version}`);
    };

    const handleDependencyClick = (dependencyName: string, dependencyVersion: string) => {
        router.push(`/programs/${dependencyName}/${dependencyVersion}`);
    };

    if (!crateInfo) {
        return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
    }

    return (
        <div className="flex h-full flex-col px-3 py-1 md:px-1">
            <Header onBack={() => window.history.back()} />
            <main className="flex-grow overflow-y-auto bg-gray-100">
                <div className="container mx-auto p-2 flex">
                    <div className="w-full md:w-2/3 pr-2">                        
                        <CrateInfoCard crateInfo={crateInfo} />
                        <SecurityAdvisories vulnerabilities={vulnerabilities} />
                        <VulnerabilitiesList vulnerabilities={vulnerabilities} />
                        <BenchmarkResults benchmarks={benchmarks} />
                    </div>
                    <div className="w-full md:w-1/3 pl-2 border-l-2">
                        <VersionsSelector
                            versions={versions}
                            currentVersion={version}
                            crateName={crateInfo.name}
                            onVersionChange={handleVersionChange}
                        />
                        
                        <DependenciesList dependencies={dependencies} onDependencyClick={handleDependencyClick} />
                        <DependencyGraph crateName={name} currentVersion={version} dependencies={graphDependencies} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CratePage;
