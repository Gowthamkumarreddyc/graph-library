import { Component, ElementRef, Input } from '@angular/core';
import { HalfpieNeedleService } from '../../services/halfpie-needle.service';

@Component({
  selector: 'wi-halfpie-needle-chart',
  standalone: true,
  imports: [],
  templateUrl: './halfpie-needle-chart.component.html',
  styleUrl: './halfpie-needle-chart.component.css'
})
export class HalfpieNeedleChartComponent {

  private element!: HTMLElement;
  @Input() content!: any;
  @Input() header!: string;
  @Input() footer!: string;

  constructor(private elementRef: ElementRef, private gaugeService: HalfpieNeedleService) { }

  ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement.querySelector('.chart');
    this.gaugeService.createHalfPieNeedleChart(this.element, this.content);
  }
}
