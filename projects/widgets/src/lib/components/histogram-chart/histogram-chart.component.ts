import { Component, ElementRef, Input } from '@angular/core';
import { HistogramService } from '../../services/histogram.service';

@Component({
  selector: 'wi-histogram-chart',
  standalone: true,
  imports: [],
  templateUrl: './histogram-chart.component.html',
  styleUrl: './histogram-chart.component.css'
})
export class HistogramChartComponent {
  private element!: HTMLElement;
  
  @Input() header!: string;
  @Input() footer!: string;

  @Input() content!: { list: Array<any>, subgroups: any };


  constructor(private elementRef: ElementRef, private histoService: HistogramService) { }

  public ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement.querySelector('.chart');
    this.histoService.createVerticalStackedColumnChart(this.element, this.content.list, this.content.subgroups);
  }
}
