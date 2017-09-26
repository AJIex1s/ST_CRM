import { Component, Input, Injector, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InputFormControl } from '../classes';

@Component({
    moduleId: module.id.toString(),
    selector: 'text-field',
    templateUrl: 'text-field.component.html',
    styleUrls: ['text-field.component.css']
})
export class TextFieldComponent extends InputFormControl implements OnInit {
    private placeholder: string = "";
    private type: string = "text";

    constructor(paramsInjector: Injector) {
        super(paramsInjector);

        this.type = paramsInjector.get('type');
        this.placeholder = paramsInjector.get('placeholder');

        if (this.width > 100 || this.width < 0)
            throw 'Width must be specified in range from 0 to 100';
    }
    ngOnInit() {

    }
}