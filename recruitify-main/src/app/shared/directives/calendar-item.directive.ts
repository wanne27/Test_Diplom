import { CalendarPageFacade } from './../pages/calendar-page/calendar-page.facade';
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCalendarItem]',
})
export class CalendarItemDirective {
  isMouseDown = false;
  today = new Date();
  clickedItemDay!: Date;

  constructor(
    private el: ElementRef,
    private render: Renderer2,
    private calendarPageFacade: CalendarPageFacade
  ) {
    calendarPageFacade.clickedDay$.subscribe(
      (response) => (this.clickedItemDay = response)
    );
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: Event | any) {
    const isFuture = this.clickedItemDay >= this.today;
    const isNotChecked = !event.target.style.background;
    // const isItem = event.target.classList.contains('time-grid_item');
    const isItem = event.target.className === 'time-grid_item';
    if (event.which === 1 && isNotChecked && isItem && isFuture) {
      this.render.setStyle(event.target, 'background', '#CADDC0');
      this.isMouseDown = true;
      this.calendarPageFacade.isMouseDown$.next(true);
      this.calendarPageFacade.isSaveBtnVisible$.next(true);
    }
  }

  @HostListener('mouseup') onMouseUp() {
    this.isMouseDown = false;
    this.calendarPageFacade.isMouseDown$.next(false);
  }

  @HostListener('mouseover', ['$event.target']) onMouseEnter(
    event: HTMLElement
  ) {
    let isItem = event.classList.contains('time-grid_item');
    if (isItem) {
      this.isMouseDown
        ? this.render.setStyle(event, 'background', '#CADDC0')
        : null;
    }
  }

  @HostListener('contextmenu', ['$event']) onRightClick(event: Event) {
    event.preventDefault();
    this.render.setStyle(event.target, 'background', '');
  }
}
