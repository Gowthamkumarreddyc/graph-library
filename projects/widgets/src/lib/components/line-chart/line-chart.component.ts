import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { lineService } from '../../services/line.service';
import { MultlineType } from '../../interfaces/multiline.interface';
@Component({
  selector: 'wi-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent implements AfterViewInit {
  private element!: HTMLElement;


  @Input() content!: { list: Array<MultlineType>, subgroups: any};
  @Input() header!: any;
  @Input() footer!: any;

  constructor(private lineService: lineService, private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement.querySelector('.chart');
    this.lineService.createMultilineChart(this.element, this.content.list, this.content.subgroups);
  }
}
