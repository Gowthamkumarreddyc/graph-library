import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root',
})
export class AreaStackedBarService {
  constructor() { }

  public createAreaStackedBarChart(
    elementHtml: HTMLElement,
    inputData: Array<any>,
    areaColumns: Array<any>,
    stackedColumns: Array<any>
  ) {
    var parentWidth = (d3 as any)
      .select(elementHtml)
      .node()
      .getBoundingClientRect().width;

    var parentHeight =
      (d3 as any).select(elementHtml).node().getBoundingClientRect().height ||
      parentWidth;

    //  newly added
    let adjustCol = { ...inputData[0] };
    adjustCol.axis = '';
    inputData.unshift(adjustCol);

    const margin: any = { top: 20, right: 20, bottom: 30, left: 30 };
    const width = parentWidth - margin.left - margin.right;
    const height = parentHeight;

    const svg = d3
      .select(elementHtml)
      .append('svg:svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom
        }`
      )
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    var color = d3
      .scaleOrdinal()
      .domain(areaColumns)
      .range([
        'rgba(249, 208, 87, 0.2)',
        'rgba(54, 174, 175, 0.2)',
        'rgba(249, 174, 115, 0.2)',
        'rgba(175, 208, 115, 0.2)',
        'rgba(208, 174, 87, 0.2)',
        'rgba(29, 87, 208, 0.2)',
      ]);

    const maxValue = () => {
      let tempMax = 0;
      inputData.map((d: any) => {
        [...areaColumns, ...stackedColumns].map((col) => {
          let v = parseInt(d[col], 10);
          tempMax = tempMax < v ? v : tempMax;
        });
      });
      return tempMax;
    };

    const x_domain = inputData.map(function (d: any) {
      return d.axis;
    });
    var x = d3.scaleBand().domain(x_domain).range([0, width]),
      y = d3.scaleLinear().domain([0, maxValue()]).range([height, 0]),
      z = color;

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
        (d, i) =>
          `translate(${margin.left}, ${i * (height / (y.ticks().length - 1)) - margin.bottom
          })`
      )
      .attr('class', 'x-axis-grid')
      .attr('stroke', '2')
      .call(xAxisGrid);

    var area = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x(function (d: any): any {
        return x(d.axis);
      })
      .y0(y(0))
      .y1(function (d: any) {
        return y(d.value);
      });

    var sources = areaColumns.map(function (id: any) {
      return {
        id: id,
        values: inputData.map(function (d: any) {
          return { axis: d.axis, value: d[id] };
        }),
      };
    });


    z.domain(
      sources.map(function (c: any) {
        return c.id;
      })
    );

    inputData.splice(0, 1);  // new line added....
    let adjustBarLeft = -(width / x_domain.length);

    svg
      .append('g')
      .attr('transform', `translate(${adjustBarLeft}, ${height})`)
      .attr('class', 'axis axis--x')
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text')
      .attr('y', '10px')
      .style('font-family', 'Poppins, sans-serif')
      .style('font-weight', '500')
      .style('letter-spacing', '1px');

    svg
      .append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll('text')
      .attr('x', '-10px')
      .style('font-family', 'Poppins, sans-serif')
      .style('font-weight', '500')
      .style('letter-spacing', '1px');

    var source = svg
      .selectAll('.area')
      .data(sources)
      .enter()
      .append('g')
      .attr('class', function (d: any) {
        return `area ${d.id}`;
      });

    source
      .append('path')
      .attr('d', function (d: any) {
        return area(d.values);
      })
      .style('fill', function (d: any): any {
        return z(d.id);
      });

    // Start Stacked Bar Charts-------------------------------------------
    const groups = x.domain(); // X - Axis
    const colorBar = d3
      .scaleOrdinal()
      .domain(stackedColumns)
      .range([
        '#02A783',
        '#D9D9D9',
        '#FF7900',
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
      ]);

    const xSubgroup = d3
      .scaleBand()
      .domain(stackedColumns)
      .range([0, x.bandwidth()])
      .padding([0.3] as any);

    svg
      .selectAll('g.bars')
      .data(inputData)
      .enter()
      .append('g')
      .attr(
        'transform',
        (d: any) =>
          `translate(${(x(d.axis) as any) + adjustBarLeft})`
      )
      .selectAll('.rect')
      .data(function (d: any) {
        return stackedColumns.map(function (key: any) {
          return { key: key, value: d[key] };
        });
      })
      .enter()
      .append('rect')
      .attr('x', (d: any): any => xSubgroup(d.key))
      .attr('y', (d: any) => y(d.value))
      .attr('width', xSubgroup.bandwidth() - 1)
      .attr('height', (d: any) => {
        let v = height - y(d.value);
        return v ? v : 0;
      })
      .attr('fill', (d: any): any => colorBar(d.key));
    // End Stacked Bar Charts -------------------------------------------
  }
}
