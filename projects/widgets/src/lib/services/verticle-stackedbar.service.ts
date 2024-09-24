import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class VerticleStackedbarService {
  private data!: Array<any>;
  private elementHTML!: HTMLElement;
  private w: number = 400;
  private h: number = 350;
  private margin = { top: 50, right: 50, bottom: 20, left: 50 };
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
    '#D9D9D9',
    '#147d64',
    'darkorange',
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
    this.x = d3.scaleBand().rangeRound([0, this.width]).padding(0.5);

    const maxValue: any = () => {
      let tempMax: number = 0;
      this.data.map((d: any) => {
        this.subgroups.map((col: any) => {
          let v = parseInt(d[col], 10);
          tempMax = tempMax < v ? v : tempMax;
        });
      });
      return tempMax;
    };

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
      .call(d3.axisBottom(this.x).tickSize(0))
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
      .call(d3.axisLeft(this.y).ticks(3))
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
          `translate(0, ${i * (this.height / (this.y.ticks().length - 1))})`
      )
      .attr('class', 'x-axis-grid')
      .attr('stroke', '2')
      .call(xAxisGrid);

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
      });

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
        return this.y(d[0]) - this.y(d[1]);
      });


    // Add legend
    const legendOffset = 20; // offset from the left side of the chart
    const maxLegendsPerLine: number = 3;
    const legendSpacing: number = 150;
    const lineHeight: number = 20;
    const legendColor = d3.scaleOrdinal().range(['#d9d9d9', '#147d64', 'darkorange']);
    const legendsLabel = this.svg.selectAll("legend")
      .data(this.subgroups)
      .enter()
      .append("g")
      .attr("transform", function (d: any, i: any) {
        const x = i % maxLegendsPerLine; // get the horizontal position of the legend label
        const y = Math.floor(i / maxLegendsPerLine); // get the vertical position of the legend label
        return "translate(" + (x * legendSpacing + legendOffset) + "," + (y * 25 + 100) + ")";
      });

    legendsLabel.append("circle")
      .attr('class', 'legends-dot')
      .attr("r", 7)
      .style("fill", (d: any) => legendColor(d))
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


    const totalLines = Math.ceil(this.subgroups.length / maxLegendsPerLine);
    const legendHeight = lineHeight * totalLines;
    if (legendHeight < this.height) {
      legendsLabel.attr("transform", ((d: any, i: any) => {
        const x = i % maxLegendsPerLine;
        const y = Math.floor(i / maxLegendsPerLine) + totalLines - Math.ceil(this.subgroups.length / maxLegendsPerLine);
        return "translate(" + (x * legendSpacing + legendOffset) + "," + (y * lineHeight + 10) + ")";
      }));

    }
  }
}
