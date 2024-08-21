// components/VersionsSelector.tsx
import React from 'react';

interface VersionsSelectorProps {
    versions: string[];
    currentVersion: string;
    crateName: string;
    onVersionChange: (version: string) => void;
}

const VersionsSelector: React.FC<VersionsSelectorProps> = ({ versions, currentVersion, crateName, onVersionChange }) => {
    return (
        <div className="bg-white p-4 mb-2 shadow-lg rounded-lg">
            <div className="flex items-center mb-0">
                <label htmlFor="versions" className="text-xl font-semibold text-gray-800 mr-6">
                    Current Version
                </label>
                <select
                    id="versions"
                    value={currentVersion}
                    onChange={(e) => onVersionChange(e.target.value)}
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
