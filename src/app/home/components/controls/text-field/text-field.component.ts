import { Component, Injector } from '@angular/core';
import { InputFormControl, ControlDragEventArgs } from '../../base';

@Component({
    moduleId: module.id.toString(),
    selector: 'text-field',
    templateUrl: 'text-field.component.html',
    styleUrls: ['text-field.component.css']
})
export class TextFieldComponent extends InputFormControl {
    public draging: boolean = false;
    constructor(paramsInjector: Injector) {
        super(paramsInjector);
    }
    
    private draggingStarted(e: DragEvent) {
        this.draging = true;
        let args: ControlDragEventArgs = { event: e, componentRef: this.ref };
        this.dragStart.emit(args);
    }
    private draggingEnded(e: DragEvent) {
        let args: ControlDragEventArgs = { event: e, componentRef: this.ref };
        this.dragEnd.emit(args);
        this.draging = false;
    }
}