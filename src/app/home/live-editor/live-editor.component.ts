import {
    Component,
    ViewChild,
    ViewContainerRef,
    ComponentRef,
    Type,
    Output,
    EventEmitter
} from '@angular/core';
import { TextFieldComponent, BaseControl, ControlParams, ControlDragEventArgs, InputFormControl, InputFormControlParams } from '../components/index';
import { ControlsFactory, HtmlInputType, HtmlPosition } from '../classes';

@Component({
    moduleId: module.id.toString(),
    selector: 'live-editor',
    templateUrl: 'live-editor.component.html',
    styleUrls: ['live-editor.component.css']
})
export class LiveEditorComponent {
    @ViewChild('workArea', { read: ViewContainerRef }) private workArea: ViewContainerRef;
    controlOverWorkArea: boolean = false;

    controls: ComponentRef<BaseControl>[] = [];

    constructor(private controlsFactory: ControlsFactory) {
        if (this.controls.length > 0)
            this.controls.forEach(c => this.subscribeForControlDragEvents(c));
    }
    getEditorAreaElement(): HTMLElement {
        return (this.workArea.element.nativeElement as HTMLElement).parentElement.parentElement;
    }

    addControl(type: Type<BaseControl>, params: ControlParams) {
        if (type == TextFieldComponent || type == InputFormControl) {
            let paramsT: InputFormControlParams = (params as InputFormControlParams);
            paramsT.placeholder += Math.floor(Math.random() % 20 * 100);
            params = paramsT;
        }
        let controlRef = this.controlsFactory.createControl(type, params);
        this.workArea.insert(controlRef.hostView);
        this.controls.push(controlRef);
        this.subscribeForControlDragEvents(controlRef);
    }
    removeControl(control: ComponentRef<BaseControl>) {
        let index = this.controls.indexOf(control);

        if (index > -1) {
            this.controls = this.controls.splice(index, 1);
            this.workArea.remove(index);
        }
    }

    private subscribeForControlDragEvents(control: ComponentRef<BaseControl>) {
        control.instance.dragStart.subscribe((eArgs: ControlDragEventArgs) => this.controlDragStart(eArgs));
        control.instance.dragEnd.subscribe((eArgs: ControlDragEventArgs) => this.controlDragEnd(eArgs));
    }
    private controlDragStart(eArgs: ControlDragEventArgs) {
    }
    private controlDragEnd(eArgs: ControlDragEventArgs) {
        if (!this.controlOverWorkArea && this.controls.indexOf(eArgs.componentRef) > -1)
            this.removeControl(eArgs.componentRef);

        this.controlOverWorkArea = false;
    }

    private dragOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.controlOverWorkArea = true;
    }
    private dragLeave(e: DragEvent) {
        this.controlOverWorkArea = false;
    }
}