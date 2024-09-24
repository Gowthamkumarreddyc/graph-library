import { Component, ElementRef, Input } from '@angular/core';
import { ViolinType } from '../../interfaces/violin.interface';
import { ViolinService } from '../../services/violin.service';

@Component({
  selector: 'wi-violin-chart',
  standalone: true,
  imports: [],
  templateUrl: './violin-chart.component.html',
  styleUrl: './violin-chart.component.css'
})
export class ViolinChartComponent {

  private element!: HTMLElement;

  @Input() content!: { list: Array<ViolinType>, subgroups: any[] };
  @Input() header!: any;
  @Input() footer!: any;


  constructor(private elementRef: ElementRef, private violinServices: ViolinService) { }

  ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement.querySelector('.chart');
    this.violinServices.createViolinChart(this.element, this.content.list, this.content.subgroups);
  }
}
