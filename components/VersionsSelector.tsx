// components/VersionsSelector.tsx
import React from 'react';
import { useRouter } from 'next/navigation';

interface VersionsSelectorProps {
    versions: string[];
    currentVersion: string;
    crateName: string;
}

const VersionsSelector: React.FC<VersionsSelectorProps> = ({ versions, currentVersion, crateName }) => {
    const router = useRouter();

    const handleVersionChange = (version: string) => {
        router.push(`/programs/${crateName}/${version}`);
    };

    return (
<div className="bg-white p-4 mb-2 shadow-lg rounded-lg">
    <div className="flex items-center mb-0">
        <label htmlFor="versions" className="text-xl font-semibold text-gray-800 mr-6">
            Current Version
        </label>
        <select
            id="versions"
            value={currentVersion}
            onChange={(e) => handleVersionChange(e.target.value)}
            className="block w-1/3 p-2 border border-gray-300 rounded-md"
        >
            {versions.map((version) => (
                <option key={version} value={version}>
                    {version}
                </option>
            ))}
        </select>
    </div>
</div>

    );
};

export default VersionsSelector;
