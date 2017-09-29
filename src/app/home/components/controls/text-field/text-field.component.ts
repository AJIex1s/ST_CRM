import { Component, Injector } from '@angular/core';
import { InputFormControl, FormControlDragEventArgs } from '../base';

@Component({
    moduleId: module.id.toString(),
    selector: 'text-field',
    templateUrl: 'text-field.component.html',
    styleUrls: ['text-field.component.css']
})
export class TextFieldComponent extends InputFormControl {
    constructor(paramsInjector: Injector) {
        super(paramsInjector);
    }
    draggingStarted(e: DragEvent) {
        let args: FormControlDragEventArgs = { event: e, componentRef: this.componentRef };
        this.dragStart.emit(args);
    }
    draggingEnded(e: DragEvent) {
        let args: FormControlDragEventArgs = { event: e, componentRef: this.componentRef };
        this.dragEnd.emit(args);
    }
}