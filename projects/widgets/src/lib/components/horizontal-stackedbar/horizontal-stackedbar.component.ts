import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { HorizontalstakedbarService } from '../../services/horizontalstakedbar.service';
@Component({
  selector: 'wi-horizontal-stackedbar',
  standalone: true,
  imports: [],
  templateUrl: './horizontal-stackedbar.component.html',
  styleUrl: './horizontal-stackedbar.component.scss'
})
export class HorizontalStackedbarComponent {
  private element!: HTMLElement;

  @Input() content!: {list: Array<any>, subgroups: any};
  @Input() header!: any;
  @Input() footer!: any;

  constructor(private elementRef: ElementRef, private stackedHorizontal: HorizontalstakedbarService) { }

  ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement.querySelector('.chart');
    this.stackedHorizontal.stackedHorizontalColumnChart(this.element, this.content.list, this.content.subgroups);
  }
}
