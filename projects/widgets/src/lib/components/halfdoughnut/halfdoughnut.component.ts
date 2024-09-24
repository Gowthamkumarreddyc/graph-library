import { Component, AfterViewInit, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { HalfdoughnutService } from '../../services/halfdoughnut.service';

@Component({
  selector: 'wi-halfdoughnut',
  standalone: true,
  imports: [],
  templateUrl: './halfdoughnut.component.html',
  styleUrl: './halfdoughnut.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HalfdoughnutComponent implements AfterViewInit {


  private element!: HTMLElement;
  @Input() content!: {value: number, list: Array<any>};
  @Input() header!: string;
  @Input() footer!: string;

  constructor(private elementRef: ElementRef, private halfdoughnutService: HalfdoughnutService) { }

  public ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement.querySelector('.chart');
    this.halfdoughnutService.createHalfdoughnutChart(this.element, this.content);
  }
}
