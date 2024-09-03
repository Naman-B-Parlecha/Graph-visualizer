import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import routerImage from "../assets/router.png";
import pcImage from "../assets/pc.png";
import serverImage from "../assets/server.png";

const NetworkGraph = ({ nodesData, linksData }) => {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: "" });

  useEffect(() => {
    const width = 1024;
    const height = 700;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodesData)
      .force("link", d3.forceLink(linksData).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(linksData)
      .join("line")
      .attr("stroke-width", 2)
      .attr("stroke", "#aaa");

    const node = svg.append("g")
      .selectAll("image")
      .data(nodesData)
      .join("image")
      .attr("xlink:href", d => {
        if (d.type === "router") return routerImage;
        if (d.type === "pc") return pcImage;
        if (d.type === "server") return serverImage;
      })
      .attr("width", 40)
      .attr("height", 40)
      .attr("x", d => d.x - 20)
      .attr("y", d => d.y - 20)
      .on("mouseover", (event, d) => {
        setTooltip({
          show: true,
          x: event.pageX,
          y: event.pageY,
          content: `ID: ${d.id}, Name: ${d.name}, Type: ${d.type}`
        });
      })
      .on("mouseout", () => {
        setTooltip(prev => ({ ...prev, show: false }));
      });

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("x", d => d.x - 20)
        .attr("y", d => d.y - 20);
    });

  }, [nodesData, linksData]);

  return (
    <div className="relative">
      <svg ref={svgRef}></svg>
      {tooltip.show && (
        <div
          className="absolute bg-gray-800 text-white p-2 rounded shadow-lg"
          style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default NetworkGraph;
