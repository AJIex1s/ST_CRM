import { Component, Input, Injector, OnInit, ViewChild, ElementRef } from '@angular/core';
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
}