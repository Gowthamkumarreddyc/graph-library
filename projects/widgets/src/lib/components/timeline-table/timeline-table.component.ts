import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'wi-timeline-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-table.component.html',
  styleUrl: './timeline-table.component.scss'
})
export class TimelineTableComponent implements AfterViewInit {
  @Input() content: any = [];
  @Input() header!: any;
  @Input() footer!: any;

  public chartId: string = 'chart';

  public calWidthStyle = {
    '--first-td-body-width': '100px',
    '--legend-width-y': '100px',
  };

  public xAxis: any[] = [];
  public yAxis: any[] = [];
  public seriesData: any[] = [];
  public legends: any[] = [
    {
      "legendColor": "rgb(240, 158, 7)",
      "legendText": "Maint_UNPL"
    },
    {
      "legendColor": "rgb(38, 65, 51)",
      "legendText": "Maint"
    },
    {
      "legendColor": "rgb(69, 7, 240)",
      "legendText": "In Operation"
    }
  ];

  public initWidth() {
    const timelineContainer: any = document.getElementById(this.chartId) as any;
    if(timelineContainer){
      const firstTdwidth =
        timelineContainer.querySelector(
          'table.table-sequence tbody tr:nth-child(2) td:nth-child(1)'
        ).clientWidth || 100;
      this.calWidthStyle = {
        '--first-td-body-width': firstTdwidth + 'px',
        '--legend-width-y': '100px',
      };
    }
  }

  ngOnInit(): void {
    this.seriesData = this.content;

    let minXaxis = 0, maxXAxis = 0;
    if (this.content.length > 0) {
      this.seriesData.map((row: any, i: number) => {
        if (!i) {
          minXaxis = row.xAxis;
          maxXAxis = row.xAxisTo;
        }

        if (minXaxis > row.xAxis) {
          minXaxis = row.xAxis;
        }

        if (maxXAxis < row.xAxisTo) {
          maxXAxis = row.xAxisTo;
        }

        if (this.yAxis.indexOf(row.yAxis) === -1) {
          this.yAxis.push(row.yAxis);
        }
      });

      this.yAxis.sort();
      for (let i = minXaxis; i <= maxXAxis; i++) {
        let xAxis = i + '';
        this.xAxis.push(xAxis);
      }

      // console.log( this.xAxis, this.yAxis );
      // this.xAxis = ['2013', '2014', '2015', '2016', '2017', '2018', '2019'];
      // this.yAxis = ['A123459', 'B123449', 'C123469'];


    }
  }

  /* TimeLine Range (xAxisTo - xAxis) */
  public getStepCount(xAxis: number, xAxisTo: number) {
    let startxAxis = parseInt(this.xAxis[0]);
    let endxAxis = parseInt(this.xAxis.slice(-1)[0]);
    return (
      (xAxisTo > endxAxis ? endxAxis : xAxisTo) -
      (xAxis > startxAxis ? xAxis : startxAxis)
    );
  }

  /* Get TimeLine in the grid */
  public getSeries(yAxis: string, xAxis: string) {
    return this.seriesData.find((row) => {
      return row.yAxis == yAxis && row.xAxis == parseInt(xAxis);
    });
  }

  ngAfterViewInit(): void {
    this.initWidth();
    window.addEventListener('resize', () => this.initWidth());
  }
}
