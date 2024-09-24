import { Injectable } from '@angular/core';
import *as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class DoughnutService {

  private elementHTML!: HTMLElement;
  private margin = { left: 20, right: 20, top: 20, bottom: 20 };
  private width!: number;
  private height!: number;
  private svg: any;
  private colors: any;
  private radius!: number;
  private data!: Array<any>;
  // private radius = Math.min(this.width, this.height) / 2 - this.margin;

  constructor() {

  }

  public createDoughnutChart(elementHtml: HTMLElement, data: Array<any>) {
    this.elementHTML = elementHtml;
    this.data = data;
    this.createSvg();
    this.createColors(data);
    this.drawChart();
  }

  private createSvg(): void {
    this.width = parseInt(d3.select(this.elementHTML).style('width')) - this.margin.left - this.margin.right;
    this.height = parseInt(d3.select(this.elementHTML).style('height')) - this.margin.top - this.margin.bottom;
    this.svg = d3
      .select(this.elementHTML)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }

  private createColors(data: any): void {
    let index = 0;
    const defaultColors = [
      "#6773f1",
      "#32325d",
      "#6162b5",
      "#6586f6",
      "#8b6ced",
      "#1b1b1b",
      "#212121"
    ];
    const colorsRange: any = [];
    this.data.forEach((element: any) => {
      if (element.color) colorsRange.push(element.color);
      else {
        colorsRange.push(defaultColors[index]);
        index++;
      }
    });
    this.colors = d3
      .scaleOrdinal()
      .domain(data.map((d: any) => d.value.toString()))
      .range(colorsRange);
  }

  private drawChart(): void {
    this.width = parseInt(d3.select(this.elementHTML).style('width')) - this.margin.left - this.margin.right;
    this.height = parseInt(d3.select(this.elementHTML).style('height')) - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2 - this.margin.top - this.margin.bottom;
    // Compute the position of each group on the pie:
    let pie = d3
      .pie()
      .sort(null) // Do not sort group by size
      .value((d: any) => {
        return d.value;
      });
    let data_ready = pie(this.data);

    // The arc generator
    let arc = d3
      .arc()
      .innerRadius(this.radius * 0.5) // This is the size of the donut hole
      .outerRadius(this.radius * 0.8);

    // Another arc that won't be drawn. Just for labels positioning
    let outerArc: any = d3
      .arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    this.svg
      .selectAll("allSlices")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d: any) => this.colors(d.data.value))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    // Add the polylines between chart and labels:
    this.svg
      .selectAll("allPolylines")
      .data(data_ready)
      .enter()
      .append("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", (d: any) => {
        let posA = arc.centroid(d); // line insertion in the slice
        let posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        let posC = outerArc.centroid(d); // Label position = almost the same as posB
        let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = this.radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC];
      });

    // Add the polylines between chart and labels:
    this.svg
      .selectAll("allLabels")
      .data(data_ready)
      .enter()
      .append("text")
      .text((d: any) => {
        return d.data.name;
      })
      .attr("transform", (d: any) => {
        let pos = outerArc.centroid(d);
        let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = this.radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .style("text-anchor", (d: any) => {
        let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });
  }
}
