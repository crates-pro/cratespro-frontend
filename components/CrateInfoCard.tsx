export interface CrateInfo {
    name: string;
    version: string;
    description: string;
    repository: string;
    downloads: number;
    maintainers: Maintainer[];
    documentation: string;
    publishedDate: string;
    licenses: string[];
    dependencyLicenses: Record<string, number>;
    links: Record<string, string>;
}
interface Maintainer {
    name: string;
    email: string;
}
const CrateInfoCard = ({ crateInfo }: { crateInfo: CrateInfo }) => (
    <section className="bg-white p-3 mb-2 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{crateInfo.name} <span className="text-gray-600 text-2xl">v{crateInfo.version}</span></h2>
        <p className="text-gray-700 mb-1 text-lg">{crateInfo.description}</p>
        <div className="flex items-center mb-1">
            <span className="text-gray-100 font-semibold text-lg">Downloads: </span>
            <span className="text-gray-700 ml-2 text-lg">{crateInfo.downloads}</span>
        </div>
        {crateInfo.repository && (
            <a href={crateInfo.repository} className="text-blue-500 underline mb-2 inline-block" target="_blank" rel="noopener noreferrer">
                Repository
            </a>
        )}
        {crateInfo.documentation && (
            <a href={crateInfo.documentation} className="text-blue-500 underline mb-2 inline-block ml-4" target="_blank" rel="noopener noreferrer">
                Documentation
            </a>
        )}
    </section>
);

export default CrateInfoCard;
