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

    components: ComponentRef<BaseControl>[] = [];

    constructor(private componentFactory: FormControlComponentsFactory) {}

    
    addControl(type: Type<BaseControl>, params: ControlParams) {
        let control = this.componentFactory.createComponent(type, params);
        this.workArea.insert(control.hostView);
        this.components.push(control);
    }
    removeControl(controlComponent: ComponentRef<BaseControl>) {
        let index = this.components.indexOf(controlComponent);

        if(index > -1) {
            this.components = this.components.splice(index, 1);
            this.workArea.remove(index);
        }
    }
    getWorkAreaElement(): HTMLElement {
        return (this.workArea.element.nativeElement as HTMLElement).parentElement.parentElement;
    }

    private dragingOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
}