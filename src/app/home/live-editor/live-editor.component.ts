import { Component,
    ViewChild,
    ViewContainerRef,
    ComponentRef,
    Type,
    Output,
    EventEmitter
 } from '@angular/core';
import { TextFieldComponent, BaseControl, ControlParams, ControlDragEventArgs } from '../components/index';
import { FormControlComponentsFactory, HtmlInputType, HtmlPosition } from '../classes';

@Component({
    moduleId: module.id.toString(),
    selector: 'live-editor',
    templateUrl: 'live-editor.component.html',
    styleUrls: ['live-editor.component.css']
})
export class LiveEditorComponent {
    @ViewChild('workArea', { read: ViewContainerRef }) private workArea: ViewContainerRef;
    dragedIn: boolean = false;
    dragedOut: boolean = false;

    controls: ComponentRef<BaseControl>[] = [];

    constructor(private componentFactory: FormControlComponentsFactory) {
        if(this.controls.length > 0)
            this.controls.forEach(ctrl=>{
                ctrl.instance.dragStart.subscribe((eArgs: ControlDragEventArgs) => this.controlDragStart(eArgs));
                ctrl.instance.dragEnd.subscribe((eArgs: ControlDragEventArgs) => this.controlDragEnd(eArgs));
            });
    }

    addControlDragingSubscription(control: ComponentRef<BaseControl>) {
        control.instance.dragStart.subscribe((eArgs: ControlDragEventArgs) => this.controlDragStart(eArgs));
        control.instance.dragEnd.subscribe((eArgs: ControlDragEventArgs) => this.controlDragEnd(eArgs));
    }
    addControl(type: Type<BaseControl>, params: ControlParams) {
        let control = this.componentFactory.createComponent(type, params);
        this.workArea.insert(control.hostView);
        this.addControlDragingSubscription(control);
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

    private controlDragStart(eArgs: ControlDragEventArgs) {
        
    }
    private controlDragEnd(eArgs: ControlDragEventArgs) {

    }
    
    private dragOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.dragedIn = true;
        this.dragedOut = false; 
    }
    private dragLeave(e: DragEvent) {
        this.dragedIn = false
        this.dragedOut = true;
    }
}