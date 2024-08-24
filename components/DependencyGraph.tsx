import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useRouter } from 'next/navigation';

export interface GraphDependency {
    name: string;
    version: string;
    dependencies?: GraphDependency[];
}

interface DependencyNode extends d3.SimulationNodeDatum {
    id: string;
    color: string;
}

interface DependencyLink extends d3.SimulationLinkDatum<DependencyNode> {
    source: DependencyNode;
    target: DependencyNode;
}

export interface DependencyGraphProps {
    crateName: string;
    currentVersion: string;
    dependencies?: GraphDependency;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ crateName, currentVersion, dependencies }) => {
    const [graphDependencies, setGraphDependencies] = useState<GraphDependency | null>(null);
    const d3Container = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchDependencyTree(name: string, version: string): Promise<GraphDependency> {
            const response = await fetch(`/api/crates/${name}/${version}`);
            const versionData = await response.json();
            
            const dependencies = versionData.dependencies || [];
            
            const dependenciesDetails = await Promise.all(dependencies.map(async (subDep: any) => {
                return fetchDependencyTree(subDep.name, subDep.version);
            }));

            return {
                name,
                version,
                dependencies: dependenciesDetails
            };
        }

        async function loadDependencies() {
            const graphDep = await fetchDependencyTree(crateName, currentVersion);
            console.log(graphDep);
            setGraphDependencies(graphDep);
        }

        loadDependencies();
    }, [crateName, currentVersion]);

    useEffect(() => {
        if (!graphDependencies || d3Container.current === null) return;

        const width = 800;
        const height = 600;

        d3.select(d3Container.current).select('svg').remove();

        const svg = d3.select(d3Container.current).append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

        svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20) // 增加 refX 以使箭头远离节点
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 7)
        .attr('markerHeight', 7)
        .append('path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .attr('fill', '#333')
        .style('stroke', 'none');
    
    

        const nodesMap = new Map<string, DependencyNode>();
        const links: DependencyLink[] = [];

        function processDependencies(dep: GraphDependency, parent?: DependencyNode) {
            const nodeId = `${dep.name}@${dep.version}`;
            let node = nodesMap.get(nodeId);
            if (!node) {
                node = { id: nodeId, color: parent ? '#69b3a2' : 'red' };
                nodesMap.set(nodeId, node);
            }
            if (parent) {
                links.push({ source: parent, target: node });
            }
            if (dep.dependencies) {
                dep.dependencies.forEach(subDep => processDependencies(subDep, node));
            }
        }

        processDependencies(graphDependencies);

        const nodes = Array.from(nodesMap.values());

        const simulation = d3.forceSimulation<DependencyNode>(nodes)
        .force('link', d3.forceLink<DependencyNode, DependencyLink>(links).id(d => d.id).distance(100)) // 增加距离
        .force('charge', d3.forceManyBody().strength(-500)) // 增加排斥力
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(50)); // 增加碰撞半径

            const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke-width', 2)
            .attr('stroke', '#333')
            .attr('marker-end', 'url(#arrowhead)'); // 确保引用正确

        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', 15)
            .attr('fill', d => d.color)
            .attr('stroke', '#333')
            .attr('stroke-width', 1.5)
            .on('click', (event, d) => {
                const [name, version] = d.id.split('@');
                router.push(`/programs/${name}/${version}`);
            })
            .call(d3.drag<SVGCircleElement, DependencyNode>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        node.append('title')
            .text(d => d.id);

        const labels = svg.append('g')
            .attr('class', 'labels')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('dy', '.35em')
            .attr('x', d => d.x! + 10)
            .attr('y', d => d.y!)
            .text(d => d.id);

        simulation
            .nodes(nodes)
            .on('tick', ticked);

        (simulation.force('link') as d3.ForceLink<DependencyNode, DependencyLink>).links(links);

        function ticked() {
            link
                .attr('x1', d => (d.source as DependencyNode).x!)
                .attr('y1', d => (d.source as DependencyNode).y!)
                .attr('x2', d => (d.target as DependencyNode).x!)
                .attr('y2', d => (d.target as DependencyNode).y!);

            node
                .attr('cx', d => d.x = Math.max(10, Math.min(width - 10, d.x!)))
                .attr('cy', d => d.y = Math.max(10, Math.min(height - 10, d.y!)));

            labels
                .attr('x', d => d.x! + 10)
                .attr('y', d => d.y!);
        }

        function dragstarted(event: d3.D3DragEvent<SVGCircleElement, DependencyNode, DependencyNode>, d: DependencyNode) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: d3.D3DragEvent<SVGCircleElement, DependencyNode, DependencyNode>, d: DependencyNode) {
            d.fx = Math.max(10, Math.min(width - 10, event.x));
            d.fy = Math.max(10, Math.min(height - 10, event.y));
        }

        function dragended(event: d3.D3DragEvent<SVGCircleElement, DependencyNode, DependencyNode>, d: DependencyNode) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }, [graphDependencies, router]);

    return (
        <div className="bg-white p-4 mb-2 shadow-lg rounded-lg">
            <div ref={d3Container} style={{ width: '100%', height: '400px' }} />
        </div>
    );
};

export default DependencyGraph;
