import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { AreaStackedBarService } from '../../services/area-stacked-bar.service';

@Component({
  selector: 'wi-area-stacked-bar',
  standalone: true,
  imports: [],
  templateUrl: './area-stacked-bar.component.html',
  styleUrl: './area-stacked-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AreaStackedBarComponent implements AfterViewInit {
  
  @Input() content!: any;
  @Input() header!: any;
  @Input() footer!: any;

  private element!: HTMLElement;
  public areaStackedData!: Array<any>;
  public areaColumns!: Array<string>;
  public stackedColumns!: Array<string>;

  constructor(
    private areaStackedBarService: AreaStackedBarService,
    private elementRef: ElementRef
  ) {}

  ngAfterViewInit(): void {
    // #TODO: $header, $footer, $widget_id must be dynamic here from API too
    this.element = this.elementRef.nativeElement.querySelector('.chart');
    this.areaStackedData = this.content.areaStackedData;
    this.areaColumns = this.content.areaColumns;
    this.stackedColumns = this.content.stackedColumns;
    
    this.areaStackedBarService.createAreaStackedBarChart(
      this.element,
      this.areaStackedData,
      this.areaColumns,
      this.stackedColumns
    );
  }
}
