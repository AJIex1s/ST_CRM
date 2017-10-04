import {
    Component,
    ViewChild,
    ViewContainerRef,
    ComponentRef,
    Type,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';
import {
    TextFieldComponent,
    BaseControl,
    ControlParams,
    ControlDragEventArgs,
    InputFormControl,
    InputFormControlParams,
    RelativePosition
} from '../components/index';
import { ControlsFactory, HtmlInputType, HtmlPosition } from '../classes';

@Component({
    moduleId: module.id.toString(),
    selector: 'live-editor',
    templateUrl: 'live-editor.component.html',
    styleUrls: ['live-editor.component.css']
})
export class LiveEditorComponent implements OnInit {
    @ViewChild('workArea', { read: ViewContainerRef }) private workArea: ViewContainerRef;
    controlOverWorkArea: boolean = false;

    controls: ComponentRef<BaseControl>[] = [];
    activeControl: ComponentRef<BaseControl> = null;
    whereToInsert: { control: ComponentRef<BaseControl>, position: RelativePosition };

    constructor(private controlsFactory: ControlsFactory) {
        if (this.controls.length > 0)
            this.controls.forEach(c => this.subscribeForControlDragEvents(c));
        this.whereToInsert = { control: null, position: RelativePosition.bottom };
    }
    ngOnInit() {
        this.addControl(TextFieldComponent, new InputFormControlParams());
        this.addControl(TextFieldComponent, new InputFormControlParams());
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
        this.activeControl = eArgs.componentRef;
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

        let minDistance = minDx > minDy ? minDy : minDx;

        return minDistance;
    }
    private getAddingPosition() { }
    private dragOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.controlOverWorkArea = true;
        if (!this.activeControl || this.controls.length < 1 || this.controls.some(c => !c.instance))
            return;
        let eX = e.clientX;
        let eY = e.clientY;

        let closestControlBorderDistance = this.controls[0].instance.getClosestBorderDistanceToPoint(eX, eY);
        this.whereToInsert.control = this.controls[0];
        this.whereToInsert.position = closestControlBorderDistance.position;

        this.controls.forEach(c => {
            let cBorderDistance = c.instance.getClosestBorderDistanceToPoint(eX, eY);
            if (cBorderDistance.distance < closestControlBorderDistance.distance) {
                closestControlBorderDistance = cBorderDistance;
                this.whereToInsert.control = c;
                this.whereToInsert.position = cBorderDistance.position;
            }
        });
        this.resetInsertionMarkers();
        this.drawMarkerWhereToInsert();
    }
    private resetInsertionMarkers() {
        this.controls.forEach(control => {
            control.instance.getMainElement().style.borderLeft = '';
            control.instance.getMainElement().style.borderRight = '';
            control.instance.getMainElement().style.borderTop = '';
            control.instance.getMainElement().style.borderBottom = '';
        });
    }
    private drawMarkerWhereToInsert() {
        let control = this.whereToInsert.control;
        if (this.whereToInsert.position == RelativePosition.top)
            control.instance.getMainElement().style.borderTop = '3px dashed black';
        if (this.whereToInsert.position == RelativePosition.bottom)
            control.instance.getMainElement().style.borderBottom = '3px dashed black';
        if (this.whereToInsert.position == RelativePosition.left)
            control.instance.getMainElement().style.borderLeft = '3px dashed black';
        if (this.whereToInsert.position == RelativePosition.right)
            control.instance.getMainElement().style.borderRight = '3px dashed black';
    }

    private isElementEditorChild(elem: Node) {
        let editorArea = this.getEditorAreaElement();
        return editorArea.contains(elem);
    }
    private dragLeave(e: DragEvent) {
        if (this.isElementEditorChild(e.fromElement))
            return;

        this.resetInsertionMarkers();
        this.controlOverWorkArea = false;
        console.log(e);
    }
}