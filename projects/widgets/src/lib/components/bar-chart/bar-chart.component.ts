import { Component, ElementRef, Input } from '@angular/core';
import { BarService } from '../../services/bar.service';

@Component({
  selector: 'wi-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent {

  private element!: HTMLElement;
  @Input() data!: Array<any>;
  @Input() header!: any;
  @Input() footer!: any;

  constructor(private barService: BarService, private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement.querySelector('.chart');
    this.barService.createBarChart(this.element, this.data);
  }
}
