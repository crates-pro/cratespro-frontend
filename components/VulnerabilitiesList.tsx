export interface Vulnerability {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
}

const VulnerabilitiesList = ({ vulnerabilities }: { vulnerabilities: Vulnerability[] }) => (
    <section className="bg-white p-4 mb-2 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-2">Vulnerabilities</h2>
        {vulnerabilities.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {vulnerabilities.map(vul => (
                    <li key={vul.id} className="p-4 bg-gray-50 rounded-md shadow-sm border border-gray-200">
                        <h3 className="text-x font-bold mb-1 text-gray-800">{vul.title}</h3>
                        <p className="text-gray-600 text-xs mb-2">{vul.description}</p>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${getSeverityColor(vul.severity)}`}>
                            {vul.severity}
                        </span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500">No vulnerabilities found.</p>
        )}
    </section>
);

const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
        case 'low':
            return 'bg-green-200 text-green-800';
        case 'medium':
            return 'bg-yellow-200 text-yellow-800';
        case 'high':
            return 'bg-red-200 text-red-800';
        default:
            return 'bg-gray-200 text-gray-800';
    }
};

export default VulnerabilitiesList;
