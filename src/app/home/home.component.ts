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

import { TextFieldComponent, BaseFormControl, FormControlDragEventArgs } from './components/index';
import {
    InputFormControlParams,
    FormControlComponentsFactory,
    HtmlInputType,
    HtmlPosition
} from './classes';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { LiveEditorComponent } from './live-editor/live-editor.component';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    entryComponents: [TextFieldComponent]
})
export class HomeComponent implements AfterViewInit {
    @ViewChild('liveEditor', { read: LiveEditorComponent }) liveEditor: LiveEditorComponent;
    @ViewChild('toolbox', { read: ToolboxComponent }) toolbox: ToolboxComponent;

    isMobileView: boolean;
    components: any[] = [];
    formWidth: string = "450px";

    constructor() { }
    ngAfterViewInit() {
        let iterator = this.toolbox.toolComponentControls.values();
        let formControl: ComponentRef<BaseFormControl> = null;
        while (formControl = iterator.next().value) {
            formControl.instance.dragEnd.subscribe(
                (evtArgs: FormControlDragEventArgs) => this.toolDragEnd(evtArgs.event, evtArgs.componentRef));
        }
    }
    needToAddElementToEditor(elemX: number,
        elemY: number, elemWidth: number, elemHeight: number) {
        let workArea = this.liveEditor.getWorkAreaElement();
        let workAreaBoundingRect = workArea.getBoundingClientRect();
        return (elemX > workAreaBoundingRect.left &&
            elemY > workAreaBoundingRect.top &&
            elemX < workAreaBoundingRect.right &&
            elemY < workAreaBoundingRect.bottom);
    }
    toolDragEnd(evt: DragEvent, componentRef: ComponentRef<BaseFormControl>) {
        let needToAddElementToEditor = this.needToAddElementToEditor(evt.clientX,
            evt.clientY, evt.srcElement.clientWidth, evt.srcElement.clientHeight);
        if (needToAddElementToEditor)
            this.liveEditor.addControl(componentRef.componentType, componentRef.instance.getParams());
    }
}