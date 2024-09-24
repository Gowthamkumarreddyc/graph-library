import { Component, ElementRef, Input } from '@angular/core';
import { GaugeMeterService } from '../../services/gauge-meter.service';
import { GaugeMeterType } from '../../interfaces/gauge-meter.interface';

@Component({
  selector: 'wi-gauge-meter',
  standalone: true,
  imports: [],
  templateUrl: './gauge-meter.component.html',
  styleUrl: './gauge-meter.component.scss'
})
export class GaugeMeterComponent {

  private element!: HTMLElement;
  @Input() content!: GaugeMeterType;
  @Input() header: any = '';
  @Input() footer: any = '';

  constructor(public progressArcService: GaugeMeterService, private elementRef: ElementRef) { }

  public ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement.querySelector('.chart-progress-arc');
    this.progressArcService.createPorgressArcChart(this.element, this.content);
  }
}
