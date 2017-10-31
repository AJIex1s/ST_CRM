import { Component, Injector, ElementRef } from '@angular/core';
import { ControlComponentBase } from '../../../classes/control-component';

@Component({
    moduleId: module.id.toString(),
    selector: 'text-field',
    templateUrl: 'text-field.component.html',
    styleUrls: ['text-field.component.css']
})
export class TextFieldComponent extends ControlComponentBase {
    private placeholder = "Text Field";
    public draging: boolean = false;
    constructor(paramsInjector: Injector, mainElement: ElementRef) {
        super(mainElement);
    }
}