import { Component, Injector } from '@angular/core';
import { InputFormComponent, ControlDragEventArgs, FormLayoutLine } from '../../base';

@Component({
    moduleId: module.id.toString(),
    selector: 'text-field',
    templateUrl: 'text-field.component.html',
    styleUrls: ['text-field.component.css']
})
export class TextFieldComponent extends FormLayoutLine {
    public draging: boolean = false;
    
}