import { Component, Input, Injector, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MdFormField } from '@angular/material';

@Component({
    moduleId: module.id.toString(),
    selector: 'input-form-field',
    templateUrl: 'input-form-field.component.html',
    styleUrls: ['input-form-field.component.css']
})
export class InputFormFieldComponent implements OnInit {
    placeholder: string = "";
    type: string = "text";
    percentageWidth: number = 100;
    @ViewChild('formField') formField: MdFormField;

    constructor(private injector: Injector) {
        try {
            this.type = this.injector.get('type');
            this.placeholder = this.injector.get('placeholder');
            this.percentageWidth = this.injector.get('width');
        } catch(e) {
            alert('param isn`t specified');
        }
        
        if(this.percentageWidth > 100 || this.percentageWidth < 0)
            throw 'Width must be specified in range from 0 to 100';
    }

    ngOnInit() {
    }
}