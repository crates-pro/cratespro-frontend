// src/components/LicensesInfo.tsx
import React from 'react';

interface LicensesInfoProps {
    licenses: string[] | undefined;
    dependencyLicenses: Record<string, number> | undefined;
}

const LicensesInfo: React.FC<LicensesInfoProps> = ({ licenses, dependencyLicenses = {} }) => {
    return (
        <div className="bg-white p-4 mb-2 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-2">Licenses</h2>
            <p>Licenses: {licenses ? licenses.join(', ') : 'No licenses available'}</p>
            <div>
                <p>Dependency licenses:</p>
                <ul className="list-disc ml-6">
                    {Object.entries(dependencyLicenses).map(([license, count]) => (
                        <li key={license}>
                            {license}: {count}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LicensesInfo;
