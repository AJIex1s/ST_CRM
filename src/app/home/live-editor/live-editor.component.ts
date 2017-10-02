import { Component,
    ViewChild,
    ViewContainerRef,
    ComponentRef,
    Type,
    Output,
    EventEmitter
 } from '@angular/core';
import { TextFieldComponent, BaseControl, ControlParams } from '../components/index';
import { FormControlComponentsFactory, HtmlInputType, HtmlPosition } from '../classes';

@Component({
    moduleId: module.id.toString(),
    selector: 'live-editor',
    templateUrl: 'live-editor.component.html',
    styleUrls: ['live-editor.component.css']
})
export class LiveEditorComponent {
    @ViewChild('workArea', { read: ViewContainerRef }) private workArea: ViewContainerRef;

    controls: ComponentRef<BaseControl>[] = [];

    constructor(private componentFactory: FormControlComponentsFactory) {}

    
    addControl(type: Type<BaseControl>, params: ControlParams) {
        let control = this.componentFactory.createComponent(type, params);
        this.workArea.insert(control.hostView);
        this.controls.push(control);
    }
    removeControl(control: ComponentRef<BaseControl>) {
        let index = this.controls.indexOf(control);

        if(index > -1) {
            this.controls = this.controls.splice(index, 1);
            this.workArea.remove(index);
        }
    }
    getWorkAreaElement(): HTMLElement {
        return (this.workArea.element.nativeElement as HTMLElement).parentElement.parentElement;
    }

    private dragOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
    private dragLeave(e: DragEvent) {
    }
}