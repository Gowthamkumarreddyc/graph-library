import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  constructor() {}

  public createMultiPorgressBarChart(
    elementHTML: HTMLElement,
    data: Array<any>
  ) {
    var colorScale = d3
      .scaleOrdinal()
      .domain([0, 10] as any)
      .range(['#017e63', '#EF9A9A', '#80CBC4', '#9775fa', '#ff8787']);

    var table = d3.select(elementHTML).append('table').attr('width', '100%');

    // tr
    var tr = table
      .append('tbody')
      .selectAll('tr')
      .data(data)
      .enter()
      .append('tr');

    // td - 1
    tr.append('td')
      .classed('title', true)
      .text(function (d: any) {
        return d.key;
      });

    tr.append('td')
      .attr('width', '99%')
      .append('div')
      .classed('progress-container', true)
      .append('div')
      .classed('bar', true)
      .style('width', function (d: any) {
        return d.value + '%';
      })
      .style('background', ((d: any): any => {
        return d.color;
      }))
      .text('.');

    tr.append('td')
      .classed('count', true)
      .text(function (d: any) {
        return d.value;
      });
  }
}
