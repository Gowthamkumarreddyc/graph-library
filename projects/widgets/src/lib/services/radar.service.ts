import { Injectable } from '@angular/core';
import { MarginType } from '../interfaces/margin.interface';
import * as d3 from 'd3';
import { RadarType } from '../interfaces/radar.interface';

@Injectable({
  providedIn: 'root'
})
export class RadarService {

  private width: any;
  private height: any;
  private margin: MarginType = { left: 50, right: 50, top: 50, bottom: 50 };

  constructor() { }

  public createRadarChart(elementHTML: HTMLElement, data: Array<RadarType>, options: any, scaleType: any = 'x') {
    let cfg: any = {
      maxValue: 0,
      labelFactor: 1.25,
      wrapWidth: 60,
      opacityArea: 0.35,
      dotRadius: 2,
      opacityCircles: 0.1,
      strokeWidth: 1,
    };

    this.width = (d3 as any).select(elementHTML).node().getBoundingClientRect().width - this.margin.left - this.margin.right;
    this.height = this.width;

    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
      for (let i in options) {
        if ('undefined' !== typeof options[i]) {
          cfg[i] = options[i];
        }
      } //for i
    } //if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    let maxValue: any = Math.max(
      cfg.maxValue,
      (d3 as any).max(data, function (i: any) {
        // console.log([i]);
        return d3.max(
          [i].map(function (o: any) {
            return o.value;
          })
        );
      })
    );

    let allAxis: any = data.map(function (i: any, j: any) {
      return i.axis;
    }), //Names of each axis
      total = allAxis.length, //The number of different axes
      radius = Math.min(this.width / 2, this.height / 2), //Radius of the outermost circle
      Format = d3.format('0.0%'),
      angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

    //Scale for the radius
    let rScale: any = (d3 as any)
      .scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    //Remove whatever chart with the same id/class was present before
    d3.select(elementHTML).select('svg').remove();

    //Initiate the radar chart SVG
    let svg = d3
      .select(elementHTML)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr(
        'viewBox',
        `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom
        }`
      )
      .attr('class', 'radar' + elementHTML);
    //Append a g element
    let g = svg
      .append('g')
      .attr(
        'transform',
        'translate(' +
        (this.width / 2 + this.margin.left) +
        ',' +
        (this.height / 2 + this.margin.top) +
        ')'
      );

    //Filter for the outside glow
    let filter = g.append('defs').append('filter').attr('id', 'glow'),
      feGaussianBlur = filter
        .append('feGaussianBlur')
        .attr('stdDeviation', '2.5')
        .attr('result', 'coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    //Wrapper for the grid & axes
    let axisGrid = g.append('g').attr('class', 'axisWrapper');

    //Draw the background circles
    axisGrid
      .selectAll('.levels')
      .data(d3.range(1, cfg.levels + 1).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', function (d, i) {
        return (radius / cfg.levels) * d;
      })
      //.style('fill', '#CDCDCD')
      .style('fill', '#FFF')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', cfg.opacityCircles)
      .style('filter', 'url(#glow)');

    //Text indicating at what % each level is
    const axisLabel = axisGrid
      .selectAll('.axisLabel')
      .data(d3.range(1, cfg.levels + 1).reverse())
      .enter()
      .append('text')
      .attr('class', 'axisLabel');

    if (scaleType === 'x') {
      axisLabel
        .attr('y', 4)
        .attr('x', function (d) {
          return (d * radius) / cfg.levels;
        })
        .attr('dy', '0.7em');
    } else {
      axisLabel
        .attr('x', 4)
        .attr('y', function (d) {
          return (-d * radius) / cfg.levels;
        })
        .attr('dy', '0.4em');
    }

    axisLabel
      .style('font-size', '10px')
      .attr('fill', '#737373')
      .text(function (d, i) {
        return Format((maxValue * d) / cfg.levels);
      });

    //Create the straight lines radiating outward from the center
    let axis = axisGrid
      .selectAll('.axis')
      .data(allAxis)
      .enter()
      .append('g')
      .attr('class', 'axis');
    //Append the lines
    axis
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', function (d, i) {
        return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr('y2', function (d, i) {
        return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .attr('class', 'line')
      .style('stroke-dasharray', function (d, i) {
        let axisIdentifier = Math.sin(angleSlice * i - Math.PI / 2);
        if ((axisIdentifier === 0 && scaleType === "x") || (axisIdentifier === -1 && scaleType === "y")) {
          return '0';
        } else {
          return '5 5';
        }
      })
      .style('stroke', function (d, i) {
        let axisIdentifier = Math.sin(angleSlice * i - Math.PI / 2);
        if ((axisIdentifier === 0 && scaleType === "x") || (axisIdentifier === -1 && scaleType === "y")) {
          return '#000';
        } else {
          return '#CDCDCD';
        }
      }
      )


      .style('stroke-width', '1.5px');

    //Append the labels at each axis
    axis
      .append('text')
      .attr('class', 'legend')
      .style('font-size', '0.6rem')
      .attr('text-align', 'justify')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', function (d, i) {
        return (
          rScale(maxValue * cfg.labelFactor) *
          Math.cos(angleSlice * i - Math.PI / 2)
        );
      })
      .attr('y', function (d, i) {
        return (
          rScale(maxValue * cfg.labelFactor) *
          Math.sin(angleSlice * i - Math.PI / 2)
        );
      })
      .text(function (d: any) {
        return d;
      })
      .call(wrap, cfg.wrapWidth);

    //The radial line function
    let radarLine = (d3 as any)
      .lineRadial()
      .curve(d3.curveLinearClosed)
      .radius(function (d: any) {
        return rScale(d.value);
      })
      .angle(function (d: any, i: any) {
        return i * angleSlice;
      });

    if (cfg.roundStrokes) {
      // radarLine.curve(d3.curveCardinalClosed);
    }

    //Create a wrapper for the blobs
    let blobWrapper = g
      .selectAll('.radarWrapper')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'radarWrapper');

    //Append the backgrounds
    blobWrapper
      .append('path')
      .attr('class', 'radarArea')
      .attr('d', function (d, i) {
        return radarLine(d);
      })
      .style('fill', function (d, i) {
        return cfg.color(i);
      })
      .style('fill-opacity', 0);

    //Create the outlines
    blobWrapper
      .append('path')
      .attr('class', 'radarStroke')
      .attr('d', function (d, i) {
        return radarLine(d);
      })
      .style('stroke-width', cfg.strokeWidth + 'px')
      .style('stroke', function (d, i) {
        return cfg.color(i);
      })
      .style('fill', 'none')
      .style('filter', 'url(#glow)');

    //Append the circles
    blobWrapper
      .selectAll('.radarCircle')
      .data(function (d: any, i: any) {
        return d;
      })
      .enter()
      .append('circle')
      .attr('class', 'radarCircle')
      .attr('r', cfg.dotRadius)
      .attr('cx', function (d: any, i: any) {
        return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr('cy', function (d: any, i: any) {
        return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .style('fill', function (d: any, i: any, j: any) {
        return cfg.color(j);
      })
      .style('fill-opacity', 0.8);

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g
      .selectAll('.radarCircleWrapper')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'radarCircleWrapper');

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper
      .selectAll('.radarInvisibleCircle')
      .data(function (d: any, i: any) {
        return d;
      })
      .enter()
      .append('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', cfg.dotRadius * 1.5)
      .attr('cx', function (d: any, i: any) {
        return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr('cy', function (d: any, i: any) {
        return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function (node: any, d: any) {
        let newX = parseFloat(d3.select(this).attr('cx')) - 10;
        let newY = parseFloat(d3.select(this).attr('cy')) - 10;
        tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text(Format(d.value))
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
      });

    //Set up the small tooltip for when you hover over a circle
    let tooltip = g.append('text').attr('class', 'tooltip').style('opacity', 0);

    //Wraps SVG text
    function wrap(text: any, width: any) {
      text.each(function (d: any, idx: any, nodes: any) {
        let text = d3.select(nodes[idx]),
          words = text.text().split(/\s+/).reverse(),
          word,
          line: any = [],
          lineNumber = 0,
          lineHeight = 1.4, // ems
          y = text.attr('y'),
          x = text.attr('x'),
          dy = parseFloat(text.attr('dy')),
          tspan: any = text
            .text(null)
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', dy + 'em');

        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text
              .append('tspan')
              .attr('x', x)
              .attr('y', y)
              .attr('dy', ++lineNumber * lineHeight + dy + 'em')
              .text(word);
          }
        }
      });
    }
  }
}
