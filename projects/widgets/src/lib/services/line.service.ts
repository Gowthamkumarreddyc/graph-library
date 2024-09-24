import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { MultlineType } from '../interfaces/multiline.interface';
import { MarginType } from '../interfaces/margin.interface';

@Injectable({
  providedIn: 'root'
})
export class lineService {
  private width!: number;
  private height!: number;
  private margin: MarginType = { left: 50, right: 50, top: 50, bottom: 50 };

  constructor() { }

  public createMultilineChart(elementHtml: HTMLElement, data: Array<MultlineType>, groups: any) {

    this.width = (d3 as any).select(elementHtml).node()?.getBoundingClientRect().width - this.margin.left - this.margin.right;
    this.height = (d3 as any).select(elementHtml).node().getBoundingClientRect().height || this.width;

    // append the svg object to the body of the page
    const svg = d3
      .select(elementHtml)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr(
        'viewBox',
        `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom
        }`
      )
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // List of groups (here I have one group per column)
    const allGroup = Object.keys(groups);

    // Reformat the data: we need an array of arrays of {x, y} tuples
    const dataReady = allGroup.map(function (grpName: any) {
      // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.map(function (d: any) {
          return { axis: d.axis, value: +d[grpName] };
        }),
      };
    });

    // I strongly advise to have a look to dataReady with
    // console.log(dataReady)

    // A color scale: one color for each group
    let color = (d3 as any)
      .scaleOrdinal()
      .range(['#b75203', '#017e63', '#455A64', '#d9d9d9']);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear().domain([0, 11]).range([0, this.width]);

    const xAxis = d3.axisBottom(x)
      .tickSize(0)
      .tickFormat(function (d: any) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[d];
      });

    const xAxisGroup = svg
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .classed('x axis', true)
      .call(xAxis)
      .style('font-family', 'Poppins, sans-serif')

    xAxisGroup.selectAll('path').remove();  //remove the path line

    xAxisGroup.selectAll('text').attr('dy', '15px');  //add gap between label and x-axis

    // Add Y axis
    const y = d3.scaleLinear().domain([0, 20]).range([this.height, 0]);
    const yAxis = d3.axisLeft(y)
      .tickValues(d3.range(0, 21, 5));
    svg.append('g').classed('y axis', true).call(yAxis).style('font-family', 'Poppins, sans-serif');

    // Grid Lines
    // ------------------------------------
    // X-Axis Grid lines
    const xAxisGrid = d3
      .axisBottom(x)
      .tickSize(0)
      .tickFormat(() => '');

    svg
      .selectAll('g.gridline')
      .data([0, 5, 10, 15, 20])
      .enter()
      .append('g')
      .attr(
        'transform',
        (d: any) => `translate(0, ${y(d)})`
      )
      .attr('class', 'x-axis-grid')
      .attr('stroke', '2')
      .call(xAxisGrid);


    // Y-Axis Grid lines
    const x_partitions = x.ticks().length;
    const yAxisGrid = d3
      .axisLeft(y)
      .tickSize(0)
      .tickFormat(() => '');
    svg
      .selectAll('g.gridline')
      .data(new Array(x_partitions).fill(this.width / x_partitions))
      .enter()
      .append('g')
      .attr(
        'transform',
        (d: any, i: number) => `translate(${d * (i + 1) - d / 2}, 0)`
      )
      .attr('class', 'y-axis-grid')
      .attr('stroke-dasharray', '5 5')
      .call(yAxisGrid);
    // ------------------------------------

    // Add the lines
    const line = d3
      .line()
      .x((d: any) => x(+d.axis))
      .y((d: any) => y(+d.value));
    svg
      .selectAll('myLines')
      .data(dataReady)
      .join('path')
      .attr('d', (d: any) => line(d.values))
      .attr('stroke', (d: any) => color(d))
      .style('stroke-width', 2)
      .style('fill', 'none');

    // Add the points
    svg
      // First we need to enter in a group
      .selectAll('myDots')
      .data(dataReady)
      .join('g')
      .style('fill', (d: any) => color(d))
      // Second we need to enter in the 'values' part of this group
      .selectAll('myPoints')
      .data((d: any) => d.values)
      .join('circle')
      .attr('cx', (d: any) => x(d.axis))
      .attr('cy', (d: any) => y(d.value))
      .attr('r', 3)
    // .attr('stroke', 'white');

    // Add legend
    const legendOffset = -20; // offset from the left side of the chart
    const maxLegendsPerLine: number = 3;
    const legendSpacing: number = 120;
    const lineHeight: number = 20;
    const legendsLabel = svg.selectAll("legend")
      .data(allGroup)
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
      .style("fill", (d: any) => color(d))
      .attr("cx", 0);

    legendsLabel.append("text")
      .attr('class', 'legends-text')
      .text(function (d: any) { return d; })
      .attr("x", 10)
      .attr("y", 0)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style('font-size', '0.6rem')
      .style('font-family', 'Poppins, sans-serif');


    const totalLines = Math.ceil(allGroup.length / maxLegendsPerLine);
    const legendHeight = lineHeight * totalLines;
    if (legendHeight < this.height) {
      legendsLabel.attr("transform", function (d: any, i: any) {
        const x = i % maxLegendsPerLine;
        const y = Math.floor(i / maxLegendsPerLine) + totalLines - Math.ceil(allGroup.length / maxLegendsPerLine);
        return "translate(" + (x * legendSpacing + legendOffset) + "," + (y * lineHeight - 40) + ")";
      });

    }

  }
}
