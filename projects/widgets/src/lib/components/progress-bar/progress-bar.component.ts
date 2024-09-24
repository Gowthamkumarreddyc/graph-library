import { Component, ElementRef, Input } from '@angular/core';
import { ProgressBarService } from '../../services/progress-bar.service';
@Component({
  selector: 'wi-progress-bar',
  standalone: true,
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  private element!: HTMLElement;

  @Input() data!: Array<any>;
  @Input() header!: any;
  @Input() footer!: any;

  constructor(public multiProgressBarService: ProgressBarService, private elementRef: ElementRef) {

  }

  public ngOnInit(): void {
    this.element = this.elementRef.nativeElement.querySelector('.chart-progress-bar');
    this.multiProgressBarService.createMultiPorgressBarChart(this.element, this.data);
  }
}
