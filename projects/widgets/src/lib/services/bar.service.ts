import { Injectable } from '@angular/core';
import { MarginType } from '../interfaces/margin.interface';
import { BarType } from '../interfaces/bar.interface';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class BarService {

  private highestValue: string = '';
  private svg!: any;
  private margin: MarginType = { left: 30, right: 30, top: 20, bottom: 20 };
  private width!: number;
  private height!: number;

  constructor() { }

  public createBarChart(elementHtml: HTMLElement, data: Array<BarType>) {
    const sizeOfTick: number = 0;
    const numberOfTick: number = 5;
    this.width = (d3 as any)
      .select(elementHtml)
      .node()
      .getBoundingClientRect().width - this.margin.left - this.margin.right;

    this.height = (d3 as any)
      .select(elementHtml)
      .node()
      .getBoundingClientRect().height || this.width;

    this.svg = d3
      .select(elementHtml)
      .append('svg')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        'viewBox',
        `0 0 ${this.width + this.margin.left * 2} ${this.height + this.margin.top * 2}`
      )
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');



    // Creating X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d: BarType) => d.name))
      .padding(0.3);

    // Drawing X-axis on the DOM
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .attr('class', 'x-axis-scale')
      .call(d3.axisBottom(x).tickSize(sizeOfTick))
      .selectAll('text')
      .attr('y', '10px')
      .style('text-anchor', 'center')
      .style('font-size', '10px')
      .style('font-family', 'Poppins');

    // Creaate Y-axis band scale
    const y = d3
      .scaleLinear()
      .domain([0, Number(this.highestValue) + 5])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg
      .append('g')
      .attr('class', 'y-axis-scale')
      .call(d3.axisLeft(y).tickSize(sizeOfTick).ticks(numberOfTick))
      .selectAll('text')
      .attr('x', '-5px')
      .style('font-size', '10px');

    // Draw Gridlines
    // X-Axis Grid lines
    const xAxisGrid = d3
      .axisBottom(x)
      .tickSize(sizeOfTick)
      .tickFormat(() => '');


    this.svg
      .selectAll('g.gridline')
      .data(y.ticks())
      .enter()
      .append('g')
      .attr(
        'transform',
        (d: any, i: number) =>
          `translate(0, ${i * (this.height / (y.ticks(numberOfTick).length - 1))})`
      )
      .attr('class', 'x-axis-grid')
      .attr('stroke', '2')
      .call(xAxisGrid);

    // Create and fill the bars
    this.svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: BarType) => x(d.name))
      .attr('y', (d: BarType) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: BarType) =>
        y(d.value) < this.height ? this.height - y(d.value) : this.height
      ) // this.height
      .attr('fill', (d: BarType) => {
        return d.color ? d.color : "steelblue";
      });
  }
}
