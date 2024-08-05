export interface Vulnerability {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
}

const VulnerabilitiesList = ({ vulnerabilities }: { vulnerabilities: Vulnerability[] }) => (
    <section className="bg-white p-6 mb-2 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">Vulnerabilities</h2>
        {vulnerabilities.length > 0 ? (
            <ul className="space-y-6">
                {vulnerabilities.map(vul => (
                    <li key={vul.id} className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-2xl font-bold mb-2 text-gray-800">{vul.title}</h3>
                        <p className="text-gray-700 mb-4">{vul.description}</p>
                        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getSeverityColor(vul.severity)}`}>
                            {vul.severity}
                        </span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-lg">No vulnerabilities found.</p>
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
