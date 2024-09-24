import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { AreaDensityService } from '../../services/area-density.service';
import { AreaDensityType } from '../../interfaces/area-density.interface';

@Component({
  selector: 'wi-area-density-chart',
  standalone: true,
  imports: [],
  templateUrl: './area-density-chart.component.html',
  styleUrl: './area-density-chart.component.css'
})
export class AreaDensityChartComponent implements AfterViewInit {

  private element!: HTMLElement;
  @Input() content!: Array<AreaDensityType>;
  @Input() header!: any;
  @Input() footer!: any;

  constructor(private areaDensityService: AreaDensityService, private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement.querySelector('.chart');
    this.areaDensityService.createAreadDensityChart(this.element, this.content);
  }
}
