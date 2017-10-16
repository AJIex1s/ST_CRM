import {
    Component,
    Type,
    ComponentRef,
    OnInit,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    ComponentFactoryResolver,
    ReflectiveInjector
} from '@angular/core';
import { MdSidenav } from '@angular/material'

import { User } from '../models/index';
import { UserService } from '../services/index';

import { TextFieldComponent, BaseFormComponent, ComponentDragEventArgs, ComponentParams } from './components/index';
import { ControlsFactory, HtmlInputType, HtmlPosition } from './classes';
import { InputFormComponentParams } from './components/base'
import { ToolboxComponent } from './toolbox/toolbox.component';
import { LiveEditorComponent } from './live-editor/live-editor.component';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    entryComponents: [TextFieldComponent]
})
export class HomeComponent implements AfterViewInit {
    private controlDraging: boolean = false;

    @ViewChild('liveEditor', { read: LiveEditorComponent }) liveEditor: LiveEditorComponent;
    @ViewChild('toolbox', { read: ToolboxComponent }) toolbox: ToolboxComponent;

    isMobileView: boolean;
    components: any[] = [];
    formWidth: string = "450px";

    constructor() { }
    ngAfterViewInit() {
        let iterator = this.toolbox.formComponents.values();
        let component: ComponentRef<BaseFormComponent> = null;
        while (component = iterator.next().value) {
            component.instance.dragEnd.subscribe(
                (evtArgs: ComponentDragEventArgs) => this.toolDragEnd(evtArgs.event, evtArgs.componentRef));

            component.instance.dragStart.subscribe(
                (evtArgs: ComponentDragEventArgs) => this.toolDragStart(evtArgs.event, evtArgs.componentRef));
        }
    }
    needToAddElementToEditor(elemX: number,
        elemY: number, elemWidth: number, elemHeight: number) {
        let workArea = this.liveEditor.getEditorAreaElement();
        let workAreaBoundingRect = workArea.getBoundingClientRect();
        return (elemX > workAreaBoundingRect.left &&
            elemY > workAreaBoundingRect.top &&
            elemX < workAreaBoundingRect.right &&
            elemY < workAreaBoundingRect.bottom);
    }

    private toolDragStart(evt: DragEvent, componentRef: ComponentRef<BaseFormComponent>) {
        //todo fix hack
        this.liveEditor.activeControl = componentRef;
    }
    
    private toolDragEnd(evt: DragEvent, componentRef: ComponentRef<BaseFormComponent>) {
        let isDragedToEditor = this.needToAddElementToEditor(evt.clientX,
            evt.clientY, evt.srcElement.clientWidth, evt.srcElement.clientHeight);
        let type: Type<BaseFormComponent>;
        let params: ComponentParams;

        if (this.liveEditor.controlOverWorkArea) {
            type = componentRef.componentType;
            params = componentRef.instance.getParams().clone();
            this.liveEditor.createControl(type, params);
        }
    }
}