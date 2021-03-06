import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TransformationsService } from '../../services/transformations.service';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface A1qaLookup {
  placeholder: string;
  allowEmptyValue: boolean;
  propertiesToShow: string[];
  array: any[];
  model: any[] | any;
  disabled: boolean;
  modelChange: EventEmitter<any>;

  toggle(): void;
  toggleOff(): void;
  onFocusOut(): void;
  select(item): void;
  itemUpdate($event): void;
  textToShow(item): string;
  toggleOn(): void;
  sort(): void;
}

@Component({
  template: '',
  providers: [
    TransformationsService
  ]
})
export class BaseLookupComponent implements OnInit, OnChanges, A1qaLookup {

  constructor(
    public transformations: TransformationsService,
    public datepipe: DatePipe
  ) { }

  hidden = true;
  filteredArray: any[];

  @Input() inline = false;
  @Input() enableSort = true;
  @Input() small: boolean;
  @Input() cutLongText = false;
  @Input() placeholder = 'None';
  @Input() allowEmptyValue: boolean;
  @Input() emptyForFilter: boolean;
  @Input() propertiesToShow: string[];
  @Input() array: any[];
  @Input() model: any;
  @Input() disabled: boolean;
  @Input() sortBy: { property: string, order: string };
  @Input() addAction = false;
  @Output() modelChange = new EventEmitter();
  @Output() actionClick = new EventEmitter<any>();
  selectedItemText: string;
  emptyValue = undefined;
  emptyValueForFilter = {
    id: 0,
    findEmpty: true
  };
  icons = {
    faCaretDown
  };

  toggle() {
    this.hidden = !this.hidden;
  }

  toggleOn() {
    if (this.hidden) {
      this.hidden = false;
    }
  }

  toggleOff() {
    this.hidden = true;
    this.selectedItemText = this.model ? this.textToShow(this.model) : this.placeholder;
  }

  onFocusOut() {
    this.toggleOff();
  }

  onClickedOutside($event: Event) {
    this.toggleOff();
  }

  onActionClick(item: any) {
    this.actionClick.emit(item);
  }

  select(item: any) {
    this.model = item;
    this.selectedItemText = this.textToShow(item);
    this.itemUpdate(item);
    this.toggleOff();
  }

  ngOnChanges() {
    this.selectedItemText = this.model ? this.textToShow(this.model) : this.placeholder;
    this.filteredArray = this.array;
    this.sort();
  }

  ngOnInit() {
    this.selectedItemText = this.model ? this.textToShow(this.model) : this.placeholder;
    this.filteredArray = this.array;
    this.sort();
  }

  itemUpdate($event: {}) {
    this.modelChange.emit($event);
  }

  textToShow(item: any): string {
    if (item && item.findEmpty) {
      return 'Not Assigned';
    }
    if (item) {
      let textToShow = '';
      if (this.propertiesToShow) {
        this.propertiesToShow.forEach(property => {
          const props = property.split('.');
          let itemValue = item;
          props.forEach(prop => {
            if (!itemValue) {
              return '';
            }
            itemValue = itemValue[prop];
          });
          if (typeof itemValue === 'number' && itemValue.toString().length < 14 && itemValue.toString().length > 9) {
            itemValue = this.datepipe.transform(new Date(itemValue), 'yyyy-MM-dd hh:mm:ss a');
          }
          textToShow = `${textToShow} ${itemValue}`;
        });
      } else {
        textToShow = item;
      }
      return textToShow.trim();
    }
    return this.placeholder;
  }

  sort() {
    if (this.enableSort) {
      if (this.filteredArray && !this.sortBy) {
        this.filteredArray.sort((a, b) => {
          if (this.textToShow(a).toLowerCase() > this.textToShow(b).toLowerCase()) {
            return 1;
          }
          if (this.textToShow(a).toLowerCase() < this.textToShow(b).toLowerCase()) {
            return -1;
          }
          return 0;
        });
      } else if (this.filteredArray && !this.sortBy) {
        this.transformations.sort(this.filteredArray, this.sortBy);
      }
    }
  }
}
