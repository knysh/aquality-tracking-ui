import { Directive, ElementRef, AfterViewChecked, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[disabledInline]'
})
export class DisabledInlineDerective implements AfterViewChecked {
  @Input() disabledInline: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngAfterViewChecked() {
    const element: HTMLElement = this.el.nativeElement;
    if (this.disabledInline && element.tagName.toLowerCase() === 'inline-editor') {
      this.setDisabledClass(element);
    }
  }

  setDisabledClass(element: HTMLElement) {
    if (!element.classList.contains('disabled-inline-input')) {
      element.classList.add('disabled-inline-input');
    }
  }
}
