export interface CrateInfo {
    name: string;
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
    <section className="bg-white p-4 mb-2 shadow-lg rounded-lg">
        <h3 className="text-xl font-bold mb-2">Crate Infomation</h3>
        <p>Name: {crateInfo.name}</p>
        <p>Description: {crateInfo.description}</p>
        <p>Downloads: {crateInfo.downloads}</p>
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
