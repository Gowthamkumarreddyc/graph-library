import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { MarginType } from '../interfaces/margin.interface';
import { AreaDensityType } from '../interfaces/area-density.interface';

@Injectable({
  providedIn: 'root'
})
export class AreaDensityService {

  private margin: MarginType = { left: 30, right: 30, top: 10, bottom: 30 };
  private width!: number;
  private height!: number;

  constructor() { }

  public createAreadDensityChart(
    elementHtml: HTMLElement,
    data: Array<AreaDensityType>
  ) {

    this.width = (d3 as any).select(elementHtml).node().getBoundingClientRect().width - this.margin.right - this.margin.left;
    this.height = (d3 as any).select(elementHtml).node().getBoundingClientRect().height || this.width;

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

    const gradientColor = `
    <linearGradient id="density-gradient" gradientTransform="rotate(90)">
      <stop class="stop1" offset="40%" />
      <stop class="stop2" offset="80%" />
      <stop class="stop3" offset="99%" />
    </linearGradient>
    <style>
      <![CDATA[
              .stop1 { stop-color: rgba(2,167,131,0.7); }
              .stop2 { stop-color: rgba(2,167,131,0.5); }
              .stop3 { stop-color: rgba(2,167,131,0.1); }
            ]]>
    </style>`;
    svg.append('defs').html(gradientColor);

    // add the x Axis
    const x = d3.scaleLinear().domain([-10, 15]).range([0, this.width]);
    svg
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .classed('x axis', true)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text')
      .attr('y', '10px')
      .style('font-family', 'Poppins, sans-serif')
      .style('letter-spacing', '1px');

    // add the y Axis
    const y = d3.scaleLinear().range([this.height, 0]).domain([0, 0.12]);
    svg.append('g').classed('y axis', true).call(d3.axisLeft(y));

    svg.selectAll('.y').remove();

    // To remove y axis
    svg.selectAll('.y').remove();


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
          `translate(0, ${i * (this.height / (y.ticks().length - 1))})`
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

    // Compute kernel density estimation
    const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(60));
    const density1 = kde(
      data
        .filter(function (d: any) {
          return d.type === 'variable 1';
        })
        .map(function (d: any) {
          return d.value;
        })
    );

    // Plot the area
    svg
      .append('path')
      .attr('class', 'mypath')
      .datum(density1)
      .attr('fill', 'url(#density-gradient)')
      .attr('opacity', '1')
      .attr('stroke', 'teal')
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveBasis)
          .x(function (d) {
            return x(d[0]);
          })
          .y(function (d) {
            return y(d[1]);
          })
      );


    // Configure the data for dot labels
    const dotsData: Array<any> = [...density1];
    const dotsDataLength: number = dotsData.length;
    const percentage: Array<any> = [0.15, 0.25, 0.52, 0.63];
    let mappedData = percentage.map((val: any, i: number) => {
      let index: number = Math.round(val * dotsDataLength);
      let indexAccess: Array<any> = density1[index];
      return { text: `${percentage[i] * 100}%`, type: indexAccess[0], value: indexAccess[1] };
    });

    // Plot the dots labels
    const dots = svg.append('g');
    dots
      .selectAll('dot')
      .data(mappedData)
      .enter()
      .text('15%')
      .append('circle')
      .attr('cx', (d: any) => x(d.type))
      .attr('cy', (d: any) => y(d.value))
      .attr('r', 3)
      .style('opacity', 1)
      .style('fill', 'none')
      .style('stroke', 'green');

    dots
      .selectAll('text')
      .data(mappedData)
      .enter()
      .append('text')
      .text((d: any) => d.text)
      .attr('x', (d: any) => {
        const midpoint = x.range()[1] / 2; // Calculate the midpoint of the x-axis
        return x(d.type) < midpoint ? x(d.type) - 32 : x(d.type) + 10; // Position text left or right based on x-coordinate
      })
      .attr('y', (d: any) => y(d.value))
      .attr('font-size', '0.6rem');


    // Function to compute density
    function kernelDensityEstimator(kernel: any, X: any) {
      return function (V: any) {
        return X.map(function (x: any) {
          return [
            x,
            d3.mean(V, function (v: any) {
              return kernel(x - v);
            }),
          ];
        });
      };
    }

    function kernelEpanechnikov(k: any) {
      return function (v: any) {
        return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
      };
    }
  }
}
