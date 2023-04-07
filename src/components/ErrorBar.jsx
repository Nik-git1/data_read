import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ErrorBar = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length > 0) {

      data.unshift({ concentration: '0.0', OD: 0, minOD: 0, maxOD: 0 });

      const cleanedData = data.map((d) => ({
        concentration: d.concentration.replace(/[^\d.-]/g, ""),
        OD: d.OD,
        minOD: d.minOD,
        maxOD: d.maxOD,
      }));
    
      const svg = d3.select(svgRef.current);

      const width = 800;
      const height = 700;
      const margin = 40;

      const x = d3
        .scaleLinear()
        .domain(d3.extent(cleanedData, (d) => parseFloat(d.concentration)))
        .range([margin, width - margin]);

        const y = d3.scaleLinear()
        .domain([d3.min(cleanedData, d => d.minOD), d3.max(cleanedData, d => d.maxOD)])
        .range([height - margin, margin])
        .nice();
      
      const line = d3
        .line()
        .x((d) => x(parseFloat(d.concentration)))
        .y((d) => y(parseFloat(d.OD)));

        const firstNonZeroIndex = d3.scan(cleanedData, (a, b) => {
          return parseFloat(a.concentration) === 0 ? 1 : parseFloat(a.concentration) - parseFloat(b.concentration);
        });
      svg
        .selectAll(".dot")
        .data(cleanedData)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", (d) => x(parseFloat(d.concentration)))
        .attr("cy", (d) => y(parseFloat(d.OD)))
        .attr("r", 3)
        .attr("fill", "steelblue");

      svg
        .append("path")
        .datum(cleanedData.slice(firstNonZeroIndex))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Draw vertical lines on the data points
      svg
        .selectAll(".min-point-lines")
        .data(cleanedData)
        .enter()
        .append("line")
        .attr("class", "min-point-lines")
        .attr("x1", (d) => x(parseFloat(d.concentration)))
        .attr("y1", (d) => y(parseFloat(d.OD)))
        .attr("x2", (d) => x(parseFloat(d.concentration)))
        .attr("y2", (d) => y(parseFloat(d.minOD)))
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1);

      svg
        .selectAll(".max-point-lines")
        .data(cleanedData)
        .enter()
        .append("line")
        .attr("class", "max-point-lines")
        .attr("x1", (d) => x(parseFloat(d.concentration)))
        .attr("y1", (d) => y(parseFloat(d.OD)))
        .attr("x2", (d) => x(parseFloat(d.concentration)))
        .attr("y2", (d) => y(parseFloat(d.maxOD)))
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1);
      
      
     var whiskerWidth=height/12;
      svg
        .selectAll("whisker")
        .data(cleanedData)
        .enter()
        .append("line")
        .attr("class", "whisker")
        .attr("x1", (d) => x(d.concentration) - whiskerWidth / 2)
        .attr("y1", (d) => y(d.minOD))
        .attr("x2", (d) => x(d.concentration) + whiskerWidth / 2)
        .attr("y2", (d) => y(d.minOD))
        .attr("stroke", "black");

      svg
        .selectAll("whisker")
        .data(cleanedData)
        .enter()
        .append("line")
        .attr("class", "whisker")
        .attr("x1", (d) => x(d.concentration) - whiskerWidth / 2)
        .attr("y1", (d) => y(d.maxOD))
        .attr("x2", (d) => x(d.concentration) + whiskerWidth / 2)
        .attr("y2", (d) => y(d.maxOD))
        .attr("stroke", "black");

      svg
        .append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(d3.axisBottom(x))
        .append("text")
        .attr("fill", "#000")
        .attr("x", width / 2)
        .attr("y", margin - 10)
        .text("Concentration");

      svg
        .append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", margin - 35)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .text("OD");
    }
  }, [data]);

  return <svg ref={svgRef} width="800" height="700" margin="100" />;
};

export default ErrorBar;
