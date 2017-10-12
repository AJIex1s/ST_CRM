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

export class RelativePositionData {
    target: ComponentRef<BaseFormComoponent>;
    position: RelativePosition;
    constructor() { }
}
export class LiveEditor {
    @ViewChild('workArea', { read: ViewContainerRef }) private workArea: ViewContainerRef;
    formComponents: Array<Array<ComponentRef<BaseFormComoponent>>>; 

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
    whereToInsert: RelativePositionData;

    constructor(private controlsFactory: ControlsFactory) {
        if (this.controls.length > 0)
            this.controls.forEach(c => this.subscribeForControlDragEvents(c));
        this.whereToInsert = new RelativePositionData();
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
            control.instance.getMainElement().classList.remove('left-marker');
            control.instance.getMainElement().classList.remove('right-marker');
            control.instance.getMainElement().classList.remove('top-marker');
            control.instance.getMainElement().classList.remove('bottom-marker');
        });
    }

    private addControl(controlRef: ComponentRef<BaseFormComoponent>) {
        if (this.controls.indexOf(controlRef) === -1)
            this.controls.push(controlRef);
        if (this.whereToInsert && this.whereToInsert.target)
            this.insertComponentCore(controlRef, this.whereToInsert);
        else {
            this.workArea.insert(controlRef.hostView);
            this.controls.push(controlRef);
        }
    }
    addMultiColumnClasses(...components: Array<ComponentRef<BaseFormComoponent>>) {
        components.forEach(component =>
            component.instance.getMainElement().classList.add('col-2'));
    }
    removeMultiColumnClasses(...components: Array<ComponentRef<BaseFormComoponent>>) {
        components.forEach(component => {
            component.instance.getMainElement().classList.remove('col-2');
            component.instance.getMainElement().classList.remove('last-in-line');
        });
    }

    private insertLeft(target: ComponentRef<BaseFormComoponent>,
        insertion: ComponentRef<BaseFormComoponent>) {
        let insertionIndex = this.workArea.indexOf(target.hostView) - 1;
        this.addMultiColumnClasses(target, insertion);
        target.instance.getMainElement().classList.add('last-in-line');

        this.workArea.insert(insertion.hostView, insertionIndex);
    }
    private insertRight(target: ComponentRef<BaseFormComoponent>,
        insertion: ComponentRef<BaseFormComoponent>) {
        let insertionIndex = this.workArea.indexOf(target.hostView) + 1;
        this.addMultiColumnClasses(target, insertion);
        insertion.instance.getMainElement().classList.add('last-in-line');

        this.workArea.insert(insertion.hostView, insertionIndex);
    }
    private insertTop(target: ComponentRef<BaseFormComoponent>,
        insertion: ComponentRef<BaseFormComoponent>) {
        let insertionIndex = this.workArea.indexOf(target.hostView) - 1;
        this.removeMultiColumnClasses(insertion);
        if (target.instance.getMainElement().classList.contains('col-2') &&
            target.instance.getMainElement().classList.contains('last-in-line'))
            insertionIndex--;

        this.workArea.insert(insertion.hostView, insertionIndex);
    }
    private insertBottom(target: ComponentRef<BaseFormComoponent>,
        insertion: ComponentRef<BaseFormComoponent>) {
        let insertionIndex = this.workArea.indexOf(target.hostView) + 1;
        if (target.instance.getMainElement().classList.contains('col-2') && 
            !target.instance.getMainElement().classList.contains('last-in-line'))
            insertionIndex++;
        this.removeMultiColumnClasses(insertion);

        this.workArea.insert(insertion.hostView, insertionIndex);
    }
    private insertComponentCore(insertion: ComponentRef<BaseFormComoponent>, whereToInsert: RelativePositionData) {
        switch (+whereToInsert.position) {
            case RelativePosition.Left:
                this.insertLeft(whereToInsert.target, insertion);
                break;
            case RelativePosition.Right:
                this.insertRight(whereToInsert.target, insertion);
                break;
            case RelativePosition.Top:
                this.insertTop(whereToInsert.target, insertion);
                break;
            case RelativePosition.Bottom:
                this.insertBottom(whereToInsert.target, insertion);
                break;
        }
    }

    private subscribeForControlDragEvents(control: ComponentRef<BaseFormComoponent>) {
        control.instance.dragStart.subscribe((eArgs: ControlDragEventArgs) => this.controlDragStart(eArgs));
        control.instance.dragEnd.subscribe((eArgs: ControlDragEventArgs) => this.controlDragEnd(eArgs));
    }

    private calcInsertPosition(mouseX: number, mouseY: number): RelativePositionData {
        let result: RelativePositionData = new RelativePositionData();

        let closestBorderPositionAndDistance = this.controls[0].instance
            .calcClosestBorderPositionAndNormalDistance(mouseX, mouseY);
        let minDistance = closestBorderPositionAndDistance.distance;

        result.target = this.controls[0];
        result.position = closestBorderPositionAndDistance.position;

        this.controls.forEach(control => {
            closestBorderPositionAndDistance =
                control.instance.calcClosestBorderPositionAndNormalDistance(mouseX, mouseY);

            if (closestBorderPositionAndDistance.distance < minDistance) {
                minDistance = closestBorderPositionAndDistance.distance;
                result.target = control;
                result.position = closestBorderPositionAndDistance.position;
            }

        });

        return result;
    }

    private drawMarkerWhereToInsert() {
        let mainElement = this.whereToInsert.target.instance.getMainElement();
        let markerClass: string = '';
        switch (+this.whereToInsert.position) {
            case RelativePosition.Left:
                markerClass = 'left-marker';
                break;
            case RelativePosition.Right:
                markerClass = 'right-marker';
                break;
            case RelativePosition.Top:
                markerClass = 'top-marker';
                break;
            case RelativePosition.Bottom:
                markerClass = 'bottom-marker';
                break;
        }
        mainElement.classList.add(markerClass);
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
        else if (this.whereToInsert && this.whereToInsert.target && this.activeControl)
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

        this.whereToInsert = this.calcInsertPosition(eX, eY);
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