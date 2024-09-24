import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { MarginType } from '../interfaces/margin.interface';

@Injectable({
  providedIn: 'root'
})
export class HorizontalstakedbarService {

  constructor() { }

  public stackedHorizontalColumnChart(elementHtml: HTMLElement, data: Array<any>, subgroupsObj: any) {
    const margin: MarginType = { left: 50, right: 50, top: 30, bottom: 20 };
    const width = (d3 as any).select(elementHtml).node().getBoundingClientRect().width;
    const height = (d3 as any).select(elementHtml).node().getBoundingClientRect().height || width;

    // append the svg object to the body of the page
    const svg = d3
      .select(elementHtml)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom
        }`
      )
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = data.map((d: any) => d.axis);
    const subgroups = Object.keys(subgroupsObj);
    // Add X axis
    const x = d3
      .scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.3] as any);

    const xAxisGroup = svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .classed('x axis', true)
      .call(d3.axisBottom(x).tickSize(0))
      .style('font-family', 'Poppins, sans-serif')
      .style('letter-spacing', '1px');

    xAxisGroup.selectAll('text').attr('dy', '10px');
    xAxisGroup.selectAll('path').remove();

    // Add left-Y axis
    const maxValue: any = () => {
      let tempMax: number = 0;
      data.map((d: any) => {
        subgroups.map((col: any) => {
          let v = parseInt(d[col], 10);
          tempMax = tempMax < v ? v : tempMax;
        });
      });
      return tempMax;
    };

    const y = d3.scaleLinear().domain([0, maxValue()]).range([height, 0]);
    svg
      .append('g')
      .classed('y axis', true)
      .call(d3.axisLeft(y))
      .style('font-family', 'Poppins, sans-serif')
      .style('letter-spacing', '1px');

    // Add right-y axis
    const rightY = d3.scaleLinear().domain([0, maxValue()]).range([height, 0]);
    const rightYAxisGroup = svg
      .append('g')
      .classed('righty axis', true)
      .attr('transform', `translate(${height + 10},0)`)
      .call(d3.axisRight(rightY).tickSize(0))
      .style('font-family', 'Poppins, sans-serif')
      .style('letter-spacing', '1px');

    rightYAxisGroup.selectAll('path').remove();

    // Draw gridlines
    // X-Axis Grid lines
    const xAxisGrid = d3
      .axisBottom(x)
      .tickSize(0)
      .tickFormat(() => '');

    svg
      .selectAll('g.gridline')
      .data(y.ticks())
      .enter()
      .append('g')
      .attr(
        'transform',
        (d: any, i: number) =>
          `translate(0, ${i * (height / (y.ticks().length - 1))})`
      )
      .attr('class', 'x-axis-grid')
      .attr('stroke', '2')
      .call(xAxisGrid);

    // Another scale for subgroup position?
    const xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.2] as any);

    // color palette = one color per subgroup
    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range([
        '#D9D9D9',
        '#02A783',
        '#FF7900',
        '#031A6B',
        '#087CA7',
        '#93867F',
        '#7D70BA',
        '#28231C',
        '#655356',
        '#7E007B',
        '#792359',
        '#048A81',
        '#B3C2F2',
        '#41292C',
        '#93B7BE',
      ]);

    // Show the bars
    svg
      .append('g')
      .selectAll('g')
      // Enter in data = loop group per group
      .data(data)
      .join('g')
      .attr('transform', (d: any) => `translate(${x(d.axis)}, 0)`)
      .selectAll('rect')
      .data(function (d: any) {
        return subgroups.map(function (key: any) {
          return { key: key, value: d[key] };
        });
      })
      .join('rect')
      .attr('x', (d: any) => xSubgroup(d.key) as any)
      .attr('y', (d: any) => y(d.value))
      .attr('width', xSubgroup.bandwidth())
      .attr('height', (d: any) => height - y(d.value))
      .attr('fill', (d: any) => color(d.key) as any);


    // Add top legends
    const legendOffset = -20; // offset from the left side of the chart
    const maxLegendsPerLine: number = 2;
    const legendSpacing: number = 160;
    const lineHeight: number = 20;
    const legendColor = ['#02a783', '#d9d9d9'];
    const legendsLabel = svg.selectAll("legend")
      .data(subgroups)
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        const x = i % maxLegendsPerLine; // get the horizontal position of the legend label
        const y = Math.floor(i / maxLegendsPerLine); // get the vertical position of the legend label
        return "translate(" + (x * legendSpacing + legendOffset) + "," + (y * 25 + 100) + ")";
      });

    legendsLabel.append("circle")
      .attr('class', 'legends-dot')
      .attr("r", 7)
      .style("fill", (d: any, i: any): any => legendColor[i])
      .attr("cx", 0);

    legendsLabel.append("text")
      .attr('class', 'legends-text')
      .text(function (d: any) { return d; })
      .attr("x", 10)
      .attr("y", 0)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style('font-size', '0.8rem')
      .style('font-family', 'Poppins, sans-serif')
      .style('letter-spacing', '1px');


    const totalLines = Math.ceil(subgroups.length / maxLegendsPerLine);
    const legendHeight = lineHeight * totalLines;
    if (legendHeight < height) {
      legendsLabel.attr("transform", function (d: any, i: any) {
        const x = i % maxLegendsPerLine;
        const y = Math.floor(i / maxLegendsPerLine) + totalLines - Math.ceil(subgroups.length / maxLegendsPerLine);
        return "translate(" + (x * legendSpacing + legendOffset) + "," + (y * lineHeight - 20) + ")";
      });

    }

    // Add left legend
    const leftLegendArray: Array<string> = ['Tons'];
    const leftLegend = svg
      .selectAll('left-legend')
      .data(leftLegendArray)
      .enter()
      .append('g')
      // .attr('transform', `translate(0,0)`);

    leftLegend
      .append('text')
      .attr("x", 220)
      .attr("y", 160)
      .style("text-anchor", "start")
      .style('font-size', '0.8rem')
      .style('font-family', 'Poppins, sans-serif')
      .style('letter-spacing', '1px');
  }
}
