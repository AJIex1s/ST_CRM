import { Component, Input, Output, Injector, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { InputFormControl } from '../base';

@Component({
    moduleId: module.id.toString(),
    selector: 'text-field',
    templateUrl: 'text-field.component.html',
    styleUrls: ['text-field.component.css']
})
export class TextFieldComponent extends InputFormControl implements OnInit {
    constructor(paramsInjector: Injector) {
        super(paramsInjector);
    }
    ngOnInit() {
    }
    draggingStarted(e: DragEvent) {
        this.dragStart.emit(e);
    }
    draggingEnded(e: DragEvent) {
        this.dragEnd.emit(e);
    }
}