import React from 'react';
import { Vulnerability } from './VulnerabilitiesList';

interface SecurityAdvisoriesProps {
    vulnerabilities: Vulnerability[];
}

const SecurityAdvisories: React.FC<SecurityAdvisoriesProps> = ({ vulnerabilities }) => {
    return (
        <div className="bg-white p-4 mb-2 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Security Advisories</h2>
            <ul className="list-disc ml-6">
                {vulnerabilities.map((vuln, index) => (
                    <li key={index}>
                        <strong>{vuln.title}</strong> ({vuln.id})
                        <a href="#">More details</a>
                        <p>{vuln.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SecurityAdvisories;
