import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { GaugeMeterType } from '../interfaces/gauge-meter.interface';

@Injectable({
  providedIn: 'root'
})
export class GaugeMeterService {

  constructor() { }

  public createPorgressArcChart(elementHTML: HTMLElement, data: GaugeMeterType) {
    let gaugeMaxValue = 100;
    let percentValue = data.value / gaugeMaxValue;
    let el = d3.select(elementHTML) as any;
    let barWidth,
      chart: any,
      chartInset: any,
      degToRad: any,
      repaintGauge: any,
      height,
      margin,
      numSections,
      padRad: any,
      percToDeg: any,
      percToRad: any,
      percent: any,
      radius,
      svg,
      totalPercent: any,
      width: any;
    percent = percentValue;
    numSections = 1;
    padRad = 0.001;
    chartInset = 10;
    totalPercent = 0.75;
    margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 20,
    };

    width = el.node().offsetWidth - margin.left - margin.right;
    height = width;
    radius = Math.min(width, height) / 2;
    barWidth = (40 * width) / 300;

    //Utility methods

    percToDeg = function (perc: any) {
      return perc * 360;
    };

    percToRad = function (perc: any) {
      return degToRad(percToDeg(perc));
    };

    degToRad = function (deg: any) {
      return (deg * Math.PI) / 180;
    };

    // Create SVG element
    svg = el
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    // Add layer for the panel
    chart = svg
      .append('g')
      .attr(
        'transform',
        'translate(' +
        (width + margin.left) / 2 +
        ', ' +
        (height + margin.top) / 2 +
        ')'
      );

    chart.append('path').attr('class', 'arc chart-first');
    chart.append('path').attr('class', 'arc chart-second');

    let arc1 = d3
      .arc()
      .outerRadius(radius - chartInset)
      .innerRadius(radius - chartInset - barWidth);

    let arc2 = d3
      .arc()
      .outerRadius(radius - chartInset)
      .innerRadius(radius - chartInset - barWidth);

    repaintGauge = function () {
      let rest_percent = 1 - percent;
      let perc = 0.5;
      let next_start = totalPercent;
      let arcStartRad = percToRad(next_start);
      let arcEndRad = arcStartRad + percToRad(perc * percent);
      next_start += perc * percent;

      arc1.startAngle(arcStartRad).endAngle(arcEndRad);

      arcStartRad = percToRad(next_start);
      arcEndRad = arcStartRad + percToRad(perc * rest_percent);
      next_start += perc * rest_percent;

      arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

      arcStartRad = percToRad(next_start);
      arcEndRad = arcStartRad + percToRad(perc * rest_percent);

      chart.select('.chart-first').attr('d', arc1);
      chart.select('.chart-second').attr('d', arc2);
    };

    // legend Created
    let legend = el.append('div').classed('legend', true);
    legend.append('div').classed('title', true).text(data.name);
    legend
      .append('div')
      .classed('percentile', true)
      .text(data.value + '% ' + data.sub_title);

    // Scale Created
    var texts = svg
      .selectAll('text')
      .data([{ metric: data.name, value: data.value }])
      .enter();

    texts
      .append('text')
      .text(function () {
        return 0;
      })
      .attr('id', 'scale0')
      .attr(
        'transform',
        'translate(' +
        (width + margin.left) / 100 +
        ', ' +
        (height + margin.top) / 2 +
        ')'
      )
      .attr('font-size', 15)
      .style('fill', '#000000');

    texts
      .append('text')
      .text(function () {
        return gaugeMaxValue / 2;
      })
      .attr('id', 'scale10')
      .attr(
        'transform',
        'translate(' +
        (width + margin.left) / 2.15 +
        ', ' +
        (height + margin.top) / 15 +
        ')'
      )
      .attr('font-size', 15)
      .style('fill', '#000000');

    texts
      .append('text')
      .text(function () {
        return gaugeMaxValue;
      })
      .attr('id', 'scale20')
      .attr(
        'transform',
        'translate(' +
        (width + margin.left) / 1.03 +
        ', ' +
        (height + margin.top) / 2 +
        ')'
      )
      .attr('font-size', 15)
      .style('fill', '#000000');

    let Needle = (function (): any {
      function Needle(el: any) {
        let self: any = Needle.prototype;
        self.el = el;
        self.len = width / 2.5;
        self.radius = self.len / 8;
      }

      Needle.prototype.render = function () {
        this.el.append('path').attr('class', 'needle');
        return this.el;
      };

      Needle.prototype.moveTo = function (perc: any) {
        var oldValue = this.perc || 0;
        this.perc = perc;

        // Reset pointer position
        this.el
          .transition()
          .delay(100)
          .duration(200)
          .select('.needle')
          .tween('reset-progress', function () {
            return function (percentOfPercent: any) {
              var progress = (1 - percentOfPercent) * oldValue;
              repaintGauge(progress);
            };
          });
      };

      return Needle;
    })();

    let needle = new Needle(chart);
    needle.render();
    needle.moveTo(percent);
  }
}
