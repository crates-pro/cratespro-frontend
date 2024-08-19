import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SimulationNodeDatum, SimulationLinkDatum, D3DragEvent } from 'd3';

interface Dependency {
    name: string;
    version: string;
    dependencies?: Dependency[];
}

interface DependencyNode extends SimulationNodeDatum {
    id: string;
}

interface DependencyLink extends SimulationLinkDatum<DependencyNode> {
    source: DependencyNode;
    target: DependencyNode;
}

const DependencyGraph: React.FC<{ dependencies: Dependency[] }> = ({ dependencies }) => {
    const d3Container = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (dependencies.length === 0 || d3Container.current === null) return;

        const width = 800;
        const height = 600;

        // 清除之前的 SVG 元素
        d3.select(d3Container.current).select('svg').remove();

        const svg = d3.select(d3Container.current).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        const nodesMap = new Map<string, DependencyNode>();
        const links: DependencyLink[] = [];

        function processDependencies(depArray: Dependency[], parent?: DependencyNode) {
            for (const dep of depArray) {
                let node = nodesMap.get(dep.name);
                if (!node) {
                    node = { id: dep.name };
                    nodesMap.set(dep.name, node);
                }
                if (parent) {
                    links.push({ source: parent, target: node });
                }
                if (dep.dependencies) {
                    processDependencies(dep.dependencies, node);
                }
            }
        }

        processDependencies(dependencies);

        const nodes = Array.from(nodesMap.values());

        const simulation = d3.forceSimulation<DependencyNode>(nodes)
            .force('link', d3.forceLink<DependencyNode, DependencyLink>(links).id(d => d.id).distance(50))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide().radius(20));

        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke-width', 1.5)
            .attr('stroke', '#999');

        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', 5)
            .attr('fill', '#69b3a2')
            .call(d3.drag<SVGCircleElement, DependencyNode>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        node.append('title')
            .text(d => d.id);

        // 添加文本标签
        const labels = svg.append('g')
            .attr('class', 'labels')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('dy', '.35em') // 将文本向上偏移，使其在节点的中心
            .attr('x', d => d.x! + 10) // 从节点右侧稍微偏移
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

            // 更新文本标签的位置
            labels
                .attr('x', d => d.x! + 10) // 更新文本位置，保持从节点右侧稍微偏移
                .attr('y', d => d.y!);
        }

        function dragstarted(event: D3DragEvent<SVGCircleElement, DependencyNode, DependencyNode>, d: DependencyNode) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: D3DragEvent<SVGCircleElement, DependencyNode, DependencyNode>, d: DependencyNode) {
            d.fx = Math.max(10, Math.min(width - 10, event.x));
            d.fy = Math.max(10, Math.min(height - 10, event.y));
        }

        function dragended(event: D3DragEvent<SVGCircleElement, DependencyNode, DependencyNode>, d: DependencyNode) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }, [dependencies]);

    return (
        <div className="bg-white p-4 mb-2 shadow-lg rounded-lg">
            <div ref={d3Container} style={{ width: '100%', height: '400px' }} />
        </div>
    );
};

export default DependencyGraph;
