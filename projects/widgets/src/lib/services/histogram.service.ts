import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class HistogramService {

  private data!: Array<any>;
  private elementHTML!: HTMLElement;
  private w: number = 400;
  private h: number = 350;
  private margin = { top: 50, right: 50, bottom: 40, left: 50 };
  private width = this.w - this.margin.left - this.margin.right;
  private height = this.h - this.margin.top - this.margin.bottom;
  private x: any;
  private y: any;
  private svg: any;
  private stack: any;
  private chart: any;
  private layersBarArea: any;
  private layersBar: any;
  private xAxis: any;
  private yAxis: any;
  private stackedSeries: any;
  private xTitle: any;
  private yTitle: any;
  private subgroups!: any[];
  private colors = [
    'steelblue',
    'white',
  ];

  constructor() { }

  public createVerticalStackedColumnChart(elementHtml: HTMLElement, data: Array<any>, subgroupsObj: any) {
    this.data = data;
    this.subgroups = Object.keys(subgroupsObj);
    this.elementHTML = elementHtml;
    this.stack = d3.stack().keys(this.subgroups);
    this.initialize();
  }

  private initialize() {
    this.initScales();
    this.initSvg();
    this.drawGridLines();
    this.createStack(this.data);
    this.drawAxis();

  }

  private initScales() {
    this.x = d3.scaleBand().rangeRound([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);

  }

  private initSvg() {
    this.svg = d3
      .select(this.elementHTML)
      .append('svg')
      .attr('class', 'chart')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${this.w} ${this.h}`);

    this.chart = this.svg
      .append('g')
      .classed('chart-contents', true)
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

  }

  private drawAxis() {
    this.xAxis = this.chart
      .append('g')
      .classed('x axis', true)
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(this.x).tickSize(0).ticks(5))
      .style('font-family', 'Poppins, sans-serif')
      .selectAll('path')
      .remove();

    this.chart
      .append('text')
      .attr('y', this.height + 40)
      .attr('x', this.width / 2)
      .classed('axis-title', true)
      .style('text-anchor', 'middle')
      .style('stroke', 'none')
      .text(this.xTitle);

    this.yAxis = this.chart
      .append('g')
      .classed('y axis', true)
      .call(d3.axisLeft(this.y).ticks(3).tickSize(0))
      .style('font-family', 'Poppins, sans-serif');


    this.chart
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - 60)
      .attr('x', 0 - this.height / 2)
      .style('text-anchor', 'middle')
      .style('stroke', 'none')
      .classed('axis-title', true)
      .text(this.yTitle);
  }

  private drawGridLines() {
    // X-Axis Grid lines
    const xAxisGrid = d3
      .axisBottom(this.x)
      .tickSize(0)
      .tickFormat(() => '');

    this.chart
      .selectAll('g.gridline')
      .data(this.y.ticks())
      .enter()
      .append('g')
      .attr(
        'transform',
        (d: any, i: number) =>
          `translate(0, ${i * (this.height / (this.y.ticks(3).length - 1))})`
      )
      .attr('class', 'x-axis-grid')
      .attr('stroke', '2')
      .call(xAxisGrid);


    const yAxisGrid = d3
      .axisLeft(this.y)
      .tickSize(0)
      .tickFormat(() => '');

    this.svg
      .selectAll('g.gridline')
      .data(this.x.domain())
      .enter()
      .append('g')
      .attr(
        'transform',
        (d: any, i: number) => `translate(${d * (i + 1) - d / 2}, 0)`
      )
      .attr('class', 'y-axis-grid')
      .attr('stroke', '5')
      .call(yAxisGrid);

  }

  private createStack(stackData: any) {
    this.stackedSeries = this.stack(stackData);
    // console.log(this.stackedSeries);
    this.drawChart(this.stackedSeries);
  }

  private drawChart(data: any) {
    this.layersBarArea = this.chart.append('g').classed('layers', true);
    this.layersBar = this.layersBarArea
      .selectAll('.layer')
      .data(data)
      .enter()
      .append('g')
      .classed('layer', true)
      .style('fill', (d: any, i: any) => {
        return this.colors[i];
      })
      .attr('stroke', 'black')
      .attr('stroke-width', '1');

    this.x.domain(
      this.data.map((d: any) => {
        return d.axis;
      })
    );

    this.y.domain([
      0,
      +(d3 as any).max(this.stackedSeries, function (d: any) {
        return d3.max(d, (d: any) => {
          return d[1];
        });
      }),
    ]);

    this.layersBar
      .selectAll('rect')
      .data((d: any) => {
        return d;
      })
      .enter()
      .append('rect')
      .attr('y', (d: any) => {
        return this.y(d[1]);
      })
      .attr('x', (d: any, i: any) => {
        return this.x(d.data.axis);
      })
      .attr('width', this.x.bandwidth())
      .attr('height', (d: any, i: any) => {
        console.log(d, i)
        return this.y(d[0]) - this.y(d[1]);
      });

    //   // Add the lable below the x-axis
    const labelText: string = "Inlet Volumetric Flow (m3/s)";
    const labelY: number = this.height + this.margin.bottom + 40;

    this.svg.append("text")
      .attr("class", "legend")
      .attr("x", this.width / 2)
      .attr("y", labelY)
      .attr("text-anchor", "middle")
      .text(labelText)
      .style('font-size', '0.8rem')
      .style('letter-spacing', '1px');
  }

}
