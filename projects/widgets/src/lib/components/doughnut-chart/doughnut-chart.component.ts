import { Component, ElementRef, Input } from '@angular/core';
import { DoughnutService } from '../../services/doughnut.service';

@Component({
  selector: 'wi-doughnut-chart',
  standalone: true,
  imports: [],
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.css'
})
export class DoughnutChartComponent {

  private element!: HTMLElement;
  @Input() content!: Array<any>;
  @Input() header!: any;
  @Input() footer!: any;

  constructor(private doughnutService: DoughnutService, private elmentRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.element = this.elmentRef.nativeElement.querySelector('.chart');
    this.doughnutService.createDoughnutChart(this.element, this.content);
  }

}
