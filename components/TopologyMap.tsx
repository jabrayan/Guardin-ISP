import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TOPOLOGY_DATA } from '../mockData';
import { TopologyNode, Link } from '../types';

const TopologyMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 600;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Add a container for zoom/pan
    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Simulation setup
    const simulation = d3.forceSimulation(TOPOLOGY_DATA.nodes as any)
      .force("link", d3.forceLink(TOPOLOGY_DATA.links as any).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    // Links
    const link = g.append("g")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(TOPOLOGY_DATA.links)
      .join("line")
      .attr("stroke-width", 2);

    // Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(TOPOLOGY_DATA.nodes)
      .join("g")
      .attr("cursor", "pointer")
      // Drag behavior
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Node Circles (Background)
    node.append("circle")
      .attr("r", 20)
      .attr("fill", "#1e293b")
      .attr("stroke", (d: any) => {
          if (d.status === 'DOWN') return '#ef4444';
          if (d.status === 'UNREACHABLE') return '#f97316';
          if (d.status === 'PENDING') return '#94a3b8';
          return '#3b82f6';
      })
      .attr("stroke-width", 3);

    // Node Icons (Using basic text for simplicity in D3 without foreignObject complexity)
    node.append("text")
      .text((d: any) => d.group === 1 ? "DB" : "SRV")
      .attr("x", 0)
      .attr("y", 4)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", "10px")
      .attr("font-family", "sans-serif");

    // Labels
    node.append("text")
      .text((d: any) => d.id)
      .attr("x", 0)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .attr("fill", "#cbd5e1")
      .attr("font-size", "12px")
      .attr("paint-order", "stroke")
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 3);

    // Simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Network Topology</h3>
        <div className="flex gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-blue-500 bg-slate-800"></span> UP
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-red-500 bg-slate-800"></span> DOWN
          </div>
        </div>
      </div>
      <div 
        ref={containerRef} 
        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner relative"
      >
        <svg ref={svgRef} className="w-full h-full"></svg>
        <div className="absolute bottom-4 left-4 bg-slate-950/80 p-3 rounded text-xs text-slate-400 backdrop-blur-sm border border-slate-800">
           <p>Drag nodes to rearrange.</p>
           <p>Scroll to zoom.</p>
        </div>
      </div>
    </div>
  );
};

export default TopologyMap;