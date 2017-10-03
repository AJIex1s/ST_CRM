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
    dragingControl: ComponentRef<BaseControl> = null;

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

    moveControl(control: ComponentRef<BaseControl>) {

    }

    removeControl(control: ComponentRef<BaseControl>) {
        let index = this.controls.indexOf(control);

        if (index > -1) {
            this.controls = this.controls.splice(index, 1);
            this.workArea.remove(index);
            console.log('remove');
        }
    }

    private subscribeForControlDragEvents(control: ComponentRef<BaseControl>) {
        control.instance.dragStart.subscribe((eArgs: ControlDragEventArgs) => this.controlDragStart(eArgs));
        control.instance.dragEnd.subscribe((eArgs: ControlDragEventArgs) => this.controlDragEnd(eArgs));
    }
    private controlDragStart(eArgs: ControlDragEventArgs) {
        this.dragingControl = eArgs.componentRef;
    }
    private controlDragEnd(eArgs: ControlDragEventArgs) {
        if (!this.controlOverWorkArea && this.controls.indexOf(eArgs.componentRef) > -1)
            this.removeControl(eArgs.componentRef);

        this.controlOverWorkArea = false;
    }
    private getControlMinDistanceToPoint(control: ComponentRef<BaseControl>,
        point: { x: number, y: number }) {
        let dXLeft = Math.abs(control.instance.getMainElementBounds().left - point.x);
        let dXRight = Math.abs(control.instance.getMainElementBounds().right - point.x);

        let dYTop = Math.abs(control.instance.getMainElementBounds().top - point.y);
        let dYBottom = Math.abs(control.instance.getMainElementBounds().bottom - point.y);

        let minDy = dYTop >= dYBottom ? dYBottom : dYTop;
        let minDx = dXRight >= dXLeft ? dXRight : dXRight;

        let minDistance = minDx > minDy ? minDx : minDy;

        return minDistance;
    }
    private getAddingPosition() { }
    private dragOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.controlOverWorkArea = true;
        if (!this.dragingControl)
            return;
        let eX = e.clientX;
        let eY = e.clientY;
        console.log(eX, eY);
        let closestControl: ComponentRef<BaseControl> = null;
        let controlElem: HTMLElement;
        let controlDistanceMap: Map<ComponentRef<BaseControl>, number> =
            new Map<ComponentRef<BaseControl>, number>();

        this.controls.forEach(c => {
            let minDistance = this.getControlMinDistanceToPoint(c, { x: eX, y: eY });
            controlDistanceMap.set(c, minDistance);
        });
        let minVal = controlDistanceMap.values().next().value;
        controlDistanceMap.forEach((val, key) => {
            if (val < minVal) {
                minVal = val;
                closestControl = key;
            }
        });
        console.log(closestControl);
        if(!closestControl)
            return;
        if (closestControl.instance.getMainElementBounds().left <= eX ||
            closestControl.instance.getMainElementBounds().right >= eX) {
            if (closestControl.instance.getMainElementBounds().top <= eY) {
                closestControl.instance.getMainElement().style.borderTop = '3px dashed black';
                console.log('123');
            }
            else if (closestControl.instance.getMainElementBounds().bottom >= eY) {
                closestControl.instance.getMainElement().style.borderBottom = '3px dashed black';
            }
        }
        if (closestControl.instance.getMainElementBounds().top <= eY ||
            closestControl.instance.getMainElementBounds().bottom >= eY) {

        }
    }
    private dragLeave(e: DragEvent) {
        this.controlOverWorkArea = false;
        console.log('dragleave');
    }
}