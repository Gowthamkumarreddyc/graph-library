import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { VerticleStackedbarService } from '../../services/verticle-stackedbar.service';
@Component({
  selector: 'wi-verticle-stackedbar',
  standalone: true,
  imports: [],
  templateUrl: './verticle-stackedbar.component.html',
  styleUrl: './verticle-stackedbar.component.scss'
})
export class VerticleStackedbarComponent implements OnInit {
  private element!: HTMLElement;

  @Input() content!: { list: Array<any>, subgroups: any };
  @Input() header!: any;
  @Input() footer!: any;

  constructor(private stackedVertical: VerticleStackedbarService, private elementRef: ElementRef) { }


  ngOnInit(): void {
    this.element = this.elementRef.nativeElement.querySelector('.chart');
    this.stackedVertical.createVerticalStackedColumnChart(this.element, this.content.list, this.content.subgroups);
  }
}
