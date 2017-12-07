import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ModalController, NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'page-events',
    templateUrl: 'events.html',
})
export class EventsPage {
    eventSource;
    viewTitle;
    data;
    selectedDate;
    isToday: boolean;
    calendar = {
        mode: 'month',
        currentDate: new Date()
    };
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad EventsPage');
    }
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }
    onEventSelected(event) {
        console.log(event);

    }
    changeMode(mode) {
        this.calendar.mode = mode;
    }
    today() {
        this.calendar.currentDate = new Date();
    }
    onTimeSelected(ev) {
        this.selectedDate = ev;
    }
    onCurrentDateChanged(event: Date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }
    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }
    markDisabled = (date: Date) => {
        var current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    };


}
