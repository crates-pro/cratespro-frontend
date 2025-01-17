import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useParams } from "next/navigation";

export interface GraphDependency {
    name_and_version: string;
    cve_count: number;
    direct_dependency?: GraphDependency[];
}

interface DependencyNode extends d3.SimulationNodeDatum {
    id: string;
    color: string;
}

interface DependencyLink extends d3.SimulationLinkDatum<DependencyNode> {
    source: DependencyNode;
    target: DependencyNode;
}

const DependencyGraph: React.FC = () => {
    const [graphDependencies, setGraphDependencies] = useState<GraphDependency | null>(null);
    const d3Container = useRef<HTMLDivElement | null>(null);
    const params = useParams();

    useEffect(() => {
        const fetchDependencyGraph = async () => {
            try {
                const response = await fetch(`/api/crates/${params.nsfront}/${params.nsbehind}/${params.name}/${params.version}/dependencies/graphpage`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data: GraphDependency = await response.json();
                console.log('data in graphhhhhhhhhhhhh', data);
                setGraphDependencies(data);
            } catch (error) {
                console.error('Error fetching dependency graph:', error);
            }
        };

        fetchDependencyGraph();
    }, [params.nsfront, params.nsbehind, params.name, params.version]);

    useEffect(() => {
        if (!graphDependencies || d3Container.current === null) return;

        const containerWidth = Math.max(d3Container.current.clientWidth, 1200);
        const containerHeight = Math.max(d3Container.current.clientHeight, 800);
        const width = containerWidth * 1.5;
        const height = containerHeight * 1.5;

        d3.select(d3Container.current).select('svg').remove();

        const svg = d3.select(d3Container.current).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 17)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .append('path')
            .attr('d', 'M 0,-5 L 10,0 L 0,5')
            .attr('fill', '#333')
            .style('stroke', 'none');

        const nodesMap = new Map<string, DependencyNode>();
        const links: DependencyLink[] = [];

        function processDependencies(dep: GraphDependency, parent?: DependencyNode) {
            const nodeId = `${dep.name_and_version}`;
            let node = nodesMap.get(nodeId);
            if (!node) {
                node = { id: nodeId, color: parent ? '#5c6470' : '#32e0c4' };
                nodesMap.set(nodeId, node);
            }
            if (parent) {
                links.push({ source: parent, target: node });
            }
            if (dep.direct_dependency) {
                dep.direct_dependency.forEach(subDep => processDependencies(subDep, node));
            }
        }

        processDependencies(graphDependencies);

        const nodes = Array.from(nodesMap.values());

        const simulation = d3.forceSimulation<DependencyNode>(nodes)
            .force('link', d3.forceLink<DependencyNode, DependencyLink>(links).id(d => d.id).distance(80))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide().radius(10));

        const g = svg.append('g');

        const link = g.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke-width', 1.5)
            .attr('stroke', '#333')
            .attr('marker-end', 'url(#arrowhead)');

        const node = g.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', 5)
            .attr('fill', d => d.color)
            .attr('stroke', '#333')
            .attr('stroke-width', 1.5)
            .call(d3.drag<SVGCircleElement, DependencyNode>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        node.append('title')
            .text(d => d.id);

        const labels = g.append('g')
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
                .attr('cx', d => d.x!)
                .attr('cy', d => d.y!);

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
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: d3.D3DragEvent<SVGCircleElement, DependencyNode, DependencyNode>, d: DependencyNode) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 20])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);
        const initialScale = 0.6;
        svg.call(
            zoom.transform,
            d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(initialScale)
                .translate(-width / 2, -height / 2)
        );

    }, [graphDependencies]);

    return (
        <div ref={d3Container} style={{
            width: '100%',
            height: '90vh',
            minHeight: '800px'
        }} />
    );
};

export default DependencyGraph;