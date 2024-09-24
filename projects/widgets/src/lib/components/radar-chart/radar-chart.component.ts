import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { RadarService } from '../../services/radar.service';
import { RadarType } from '../../interfaces/radar.interface';
import * as d3 from 'd3';

@Component({
  selector: 'wi-radar-chart',
  standalone: true,
  imports: [],
  templateUrl: './radar-chart.component.html',
  styleUrl: './radar-chart.component.css'
})
export class RadarChartComponent implements AfterViewInit {

  private element!: HTMLElement;
  @Input() content!: { scaleType: string, list: Array<RadarType> };
  @Input() header!: any;
  @Input() footer!: any;


  constructor(private radarService: RadarService, private elementRef: ElementRef) { }

  public ngAfterViewInit(): void {
    let color = (d3 as any)
      .scaleOrdinal()
      .range(['#EDC951', '#CC333F', '#00A0B0']);

    let radarChartOptions = {
      maxValue: 0.5,
      levels: 3,
      roundStrokes: true,
      color: color,
    };

    this.element = this.elementRef.nativeElement.querySelector('.chart');
    this.radarService.createRadarChart(this.element, this.content.list, radarChartOptions, this.content.scaleType);
  }
}
