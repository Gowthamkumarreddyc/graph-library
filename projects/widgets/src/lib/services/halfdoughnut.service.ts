import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class HalfdoughnutService {

  private width !: number;
  private height!: number;
  private radius!: number;
  private margin:any= { left: 10, right: 10, top: 10, bottom: 10 };

  constructor() { }

  public createHalfdoughnutChart(elementHtml: HTMLElement, data: { value: number, list: Array<any> }) {
    this.width = (d3 as any).select(elementHtml).node().getBoundingClientRect().width - this.margin.left - this.margin.right;
    this.height = this.width;
    this.radius = Math.min(this.width, this.height) / 2;

    let labelr = this.radius + 30;
    let color = (d3 as any)
      .scaleOrdinal()
      .range(['#ff3e41', '#ff917e', '#b75203', '#017e63', '#1E88E5', '#455A64']);


    let innerRadius = 35;
    let vis = d3
      .select(elementHtml)
      .append('svg') //create the SVG element inside the <body>
      .data([data.list])
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr(
        'viewBox',
        `0 0 ${this.width + this.margin.left + this.margin.right} ${(this.height * 3 / 4) + this.margin.top + this.margin.bottom}`
      )
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')'); //move the center of the pie chart from 0, 0 to radius, radius

    // ----- .svg
    let arc = (d3 as any)
      .arc() //this will create <path> elements for us using arc data
      .innerRadius(innerRadius)
      //  								.outerRadius(radius);
      .outerRadius(this.radius - 10); // full height semi pie
    //.innerRadius(0);

    // ---- .layout
    let pie = (d3 as any)
      .pie() //this will create arc data for us given a list of values
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180))
      .padAngle(0) // some space between slices
      .sort(null) //No! we don't want to order it by size
      .value(function (d: any) {
        return d.value;
      }); //we must tell it out to access the value of each element in our data array

    let arcs = vis
      .selectAll('g.slice') //this selects all <g> elements with class slice (there aren't any yet)
      .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
      .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
      .append('svg:g') //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
      .attr('class', 'slice'); //allow us to style things in the slices (like text)

    arcs
      .append('svg:path')
      .attr('fill', function (d, i) {
        return color(i);
      }) //set the color for each slice to be chosen from the color function defined above
      .attr('d', arc); //this creates the actual SVG path using the associated data (pie) with the arc drawing function

    const centerLabel = arcs.append('g');
    centerLabel.append('circle').attr('class', 'center-circle').attr('r', '35');
    centerLabel
      .append('text')
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .attr('class', 'center-text')
      .text(function (d) {
        return data.value;
      })
      .style('color', 'black');

    const textEl = arcs
      .append('svg:text')
      .attr('class', 'labels') //add a label to each slice
      .attr('fill', 'grey')
      .attr('transform', function (d) {
        let c = arc.centroid(d),
          xp = c[0],
          yp = c[1],
          // pythagorean theorem for hypotenuse
          hp = Math.sqrt(xp * xp + yp * yp);
        return 'translate(' + (xp / hp) * labelr + ',' + (yp / hp) * labelr + ')';
      })
      .attr('text-anchor', 'middle'); //center the text on it's origin

    // textEl.append('tspan').text(function (d, i) {
    //   return data[i].label;
    // });

    // textEl
    //   .append('tspan')
    //   .text(function (d, i) {
    //     return data[i].value;
    //   })
    //   .attr('x', '0')
    //   .attr('dy', '1.2em');

    const legendsArray: Array<string> = ['Leakages', 'Filters', 'Actuation/Mechanical', 'Instr. Failure', 'Lubrication', 'Other'];
    const legendOffset = -150; // offset from the left side of the chart
    const maxLegendsPerLine: number = 3;
    const legendSpacing: number = 90;
    const lineHeight: number = 25;
    const legendsLabel = vis.selectAll("legend")
      .data(data.list)
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
      .style("fill", function (d) { return color(d); })
      .attr("cx", 0);

    legendsLabel.append("text")
      .attr('class', 'legends-text')
      .text(function (d) { return d.label; })
      .attr("x", 10)
      .attr("y", 0)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style('font-size', '0.7rem')
      .style('font-family', 'Poppins, sans-serif');


    const totalLines = Math.ceil(data.list.length / maxLegendsPerLine);
    const legendHeight = lineHeight * totalLines;
    if (legendHeight < this.height) {
      legendsLabel.attr("transform", ((d, i) => {
        const x = i % maxLegendsPerLine;
        const y = Math.floor(i / maxLegendsPerLine) + totalLines - Math.ceil(data.list.length / maxLegendsPerLine);
        return "translate(" + (x * legendSpacing + legendOffset) + "," + (y * lineHeight + 60) + ")";
      }));

    }
  }
}
