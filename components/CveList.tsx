import React, { useEffect, useState } from 'react';
import { cveListInfo } from '@/app/lib/all_interface';
const VulnerabilityList = () => {

    const [vulnerabilities, setVulnerabilities] = useState<cveListInfo | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const response = await fetch('api/cvelist');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setVulnerabilities(data);
            } catch (error) {
                console.log('error:', error)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    // 确保 vulnerabilities 不是 null
    if (!vulnerabilities) return <div>No vulnerabilities found.</div>;


    return (
        <table className=" min-w-full border-collapse border border-gray-200">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border border-gray-200 px-4 py-2 text-black">Vuln ID</th>
                    <th className="border border-gray-200 px-4 py-2 text-black">Description</th>
                    <th className="border border-gray-200 px-4 py-2 text-black">Crate Name</th>
                    <th className="border border-gray-200 px-4 py-2 text-black">Start Version</th>
                    <th className="border border-gray-200 px-4 py-2 text-black">End Version</th>
                </tr>
            </thead>
            <tbody>
                {vulnerabilities.cves.map((vuln, index) => (
                    <tr key={vuln.cve_id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                        <td className="border border-gray-200 px-4 py-2 text-black whitespace-nowrap">
                            <a
                                href={vuln.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {vuln.cve_id}
                            </a>
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-black">{vuln.description}</td>
                        <td className="border border-gray-200 px-4 py-2 text-black">{vuln.crate_name}</td>
                        <td className="border border-gray-200 px-4 py-2 text-black">{vuln.start_version}</td>
                        <td className="border border-gray-200 px-4 py-2 text-black">{vuln.end_version}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );


};

export default VulnerabilityList;