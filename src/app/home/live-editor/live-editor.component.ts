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
    BaseFormComoponent,
    ControlParams,
    ControlDragEventArgs,
    InputFormComponent,
    InputFormControlParams,
    RelativePosition
} from '../components/index';
import { ControlsFactory, HtmlInputType, HtmlPosition } from '../classes';

export interface RelatvePositionData {
    point: ComponentRef<BaseFormComoponent>;
    relativePosition: RelativePosition;
}

@Component({
    moduleId: module.id.toString(),
    selector: 'live-editor',
    templateUrl: 'live-editor.component.html',
    styleUrls: ['live-editor.component.css']
})
export class LiveEditorComponent implements OnInit {
    @ViewChild('workArea', { read: ViewContainerRef }) private workArea: ViewContainerRef;
    controlOverWorkArea: boolean = false;

    controls: ComponentRef<BaseFormComoponent>[] = [];
    activeControl: ComponentRef<BaseFormComoponent> = null;
    whereToInsert: { point: ComponentRef<BaseFormComoponent>, relativePosition: RelativePosition };

    constructor(private controlsFactory: ControlsFactory) {
        if (this.controls.length > 0)
            this.controls.forEach(c => this.subscribeForControlDragEvents(c));
        this.whereToInsert = { point: null, relativePosition: RelativePosition.bottom };
    }
    ngOnInit() {
        this.createControl(TextFieldComponent, new InputFormControlParams());
    }

    public getEditorAreaElement(): HTMLElement {
        return (this.workArea.element.nativeElement as HTMLElement).parentElement.parentElement;
    }

    public removeControl(control: ComponentRef<BaseFormComoponent>) {
        let index = this.controls.indexOf(control);

        if (index > -1) {
            this.controls = this.controls.splice(index, 1);
            this.workArea.remove(index);
            console.log('remove');
        }
    }
    public createControl(type: Type<BaseFormComoponent>, params: ControlParams) {
        if (type == TextFieldComponent || type == InputFormComponent) {
            let paramsT: InputFormControlParams = (params as InputFormControlParams);
            paramsT.placeholder += Math.floor(Math.random() % 20 * 100);
            params = paramsT;
        }
        let controlRef = this.controlsFactory.createControl(type, params);
        this.addControl(controlRef);
        this.subscribeForControlDragEvents(controlRef);

        this.controlOverWorkArea = false;
        this.resetInsertionMarkers();
    }
    public resetInsertionMarkers() {
        this.controls.forEach(control => {
            control.instance.getMainElement().style.borderLeft = 'none';
            control.instance.getMainElement().style.borderRight = 'none';
            control.instance.getMainElement().style.borderTop = 'none';
            control.instance.getMainElement().style.borderBottom = 'none';
        });
    }

    private addControl(controlRef: ComponentRef<BaseFormComoponent>) {
        if (this.controls.indexOf(controlRef) === -1)
            this.controls.push(controlRef);
        if (this.whereToInsert && this.whereToInsert.point)
            this.addControlCore(controlRef);
        else {
            this.workArea.insert(controlRef.hostView);
            this.controls.push(controlRef);
        }
    }

    private addControlCore(controlRef: ComponentRef<BaseFormComoponent>) {
        let i = this.workArea.indexOf(this.whereToInsert.point.hostView);
        let insertionIndex = null;

        if (this.whereToInsert.relativePosition == RelativePosition.top ||
            this.whereToInsert.relativePosition == RelativePosition.left)
            insertionIndex = i - 1;

        else if (this.whereToInsert.relativePosition == RelativePosition.bottom ||
            this.whereToInsert.relativePosition == RelativePosition.right)
            insertionIndex = i + 1;

        let whereToInsertMainElement = this.whereToInsert.point.instance.getMainElement();
        if (this.whereToInsert.relativePosition == RelativePosition.left ||
            this.whereToInsert.relativePosition == RelativePosition.right) {

            if (this.whereToInsert.relativePosition == RelativePosition.left) {
                whereToInsertMainElement.classList.add('last-in-line');
            }
            else {
                controlRef.instance.getMainElement().classList.add('last-in-line');
            }

            whereToInsertMainElement.classList.add('col-2');
            controlRef.instance.getMainElement().classList.add('col-2');


        } else if (this.whereToInsert.relativePosition == RelativePosition.top ||
            this.whereToInsert.relativePosition == RelativePosition.bottom) {
            whereToInsertMainElement.classList.remove('col-2');
            whereToInsertMainElement.classList.remove('last-in-line');
            controlRef.instance.getMainElement().classList.remove('col-2');
            controlRef.instance.getMainElement().classList.remove('last-in-line');
        }
        this.workArea.insert(controlRef.hostView, insertionIndex);
    }
    private subscribeForControlDragEvents(control: ComponentRef<BaseFormComoponent>) {
        control.instance.dragStart.subscribe((eArgs: ControlDragEventArgs) => this.controlDragStart(eArgs));
        control.instance.dragEnd.subscribe((eArgs: ControlDragEventArgs) => this.controlDragEnd(eArgs));
    }

    private calculateInsertPositionData(mouseX: number, mouseY: number): RelatvePositionData {
        let result: RelatvePositionData = { point: null, relativePosition: null };

        let closestBorderPositionAndDistance = this.controls[0].instance
            .calcClosestBorderPositionAndNormalDistance(mouseX, mouseY);
        let minDistance = closestBorderPositionAndDistance.distance;

        result.point = this.controls[0];
        result.relativePosition = closestBorderPositionAndDistance.position;

        this.controls.forEach(control => {
            closestBorderPositionAndDistance =
                control.instance.calcClosestBorderPositionAndNormalDistance(mouseX, mouseY);

            if (closestBorderPositionAndDistance.distance < minDistance) {
                minDistance = closestBorderPositionAndDistance.distance;
                result.point = control;
                result.relativePosition = closestBorderPositionAndDistance.position;
            }

        });

        return result;
    }

    private drawMarkerWhereToInsert() {
        let control = this.whereToInsert.point;
        if (this.whereToInsert.relativePosition == RelativePosition.top)
            control.instance.getMainElement().style.borderTop = '3px dashed black';
        if (this.whereToInsert.relativePosition == RelativePosition.bottom)
            control.instance.getMainElement().style.borderBottom = '3px dashed black';
        if (this.whereToInsert.relativePosition == RelativePosition.left)
            control.instance.getMainElement().style.borderLeft = '3px dashed black';
        if (this.whereToInsert.relativePosition == RelativePosition.right)
            control.instance.getMainElement().style.borderRight = '3px dashed black';
    }

    private isElementEditorChild(elem: Node) {
        let editorArea = this.getEditorAreaElement();
        return editorArea.contains(elem);
    }
    //event listeners
    private controlDragStart(eArgs: ControlDragEventArgs) {
        this.activeControl = eArgs.componentRef;
    }
    private controlDragEnd(eArgs: ControlDragEventArgs) {
        this.resetInsertionMarkers();

        if (!this.controlOverWorkArea && this.controls.indexOf(eArgs.componentRef) > -1)
            this.removeControl(eArgs.componentRef);

        if (this.whereToInsert && this.whereToInsert.point && this.activeControl)
            this.addControl(this.activeControl);

        this.controlOverWorkArea = false;
    }
    private dragOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.controlOverWorkArea = true;
        if (!this.activeControl || this.controls.length < 1 || this.controls.some(c => !c.instance))
            return;
        let eX = e.clientX;
        let eY = e.clientY;

        this.whereToInsert = this.calculateInsertPositionData(eX, eY);

        this.resetInsertionMarkers();
        this.drawMarkerWhereToInsert();
    }
    private dragLeave(e: DragEvent) {
        this.resetInsertionMarkers();

        if (this.isElementEditorChild(e.fromElement))
            return;

        this.controlOverWorkArea = false;
    }
}