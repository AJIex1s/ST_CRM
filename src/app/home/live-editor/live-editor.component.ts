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
        this.createControl(TextFieldComponent, new InputFormControlParams());
    }
    getEditorAreaElement(): HTMLElement {
        return (this.workArea.element.nativeElement as HTMLElement).parentElement.parentElement;
    }
    
    addControl(controlRef: ComponentRef<BaseControl>) {
        if (this.controls.indexOf(controlRef) === -1)
            this.controls.push(controlRef);
        if (this.whereToInsert && this.whereToInsert.control)
            this.insertControl(controlRef);
        else {
            this.workArea.insert(controlRef.hostView);
            this.controls.push(controlRef);
        }
    }
    createControl(type: Type<BaseControl>, params: ControlParams) {
        if (type == TextFieldComponent || type == InputFormControl) {
            let paramsT: InputFormControlParams = (params as InputFormControlParams);
            paramsT.placeholder += Math.floor(Math.random() % 20 * 100);
            params = paramsT;
        }
        let controlRef = this.controlsFactory.createControl(type, params);
        this.addControl(controlRef);
        this.subscribeForControlDragEvents(controlRef);
    }

    moveControl(controlRef: ComponentRef<BaseControl>) {
        //auto coord calculating 
        this.addControl(controlRef);
    }

    removeControl(control: ComponentRef<BaseControl>) {
        let index = this.controls.indexOf(control);

        if (index > -1) {
            this.controls = this.controls.splice(index, 1);
            this.workArea.remove(index);
            console.log('remove');
        }
    }
    private insertControl(controlRef: ComponentRef<BaseControl>) {
        let i = this.workArea.indexOf(this.whereToInsert.control.hostView);
        let insertionIndex = null;
        if (this.whereToInsert.position == RelativePosition.top ||
            this.whereToInsert.position == RelativePosition.left)
            insertionIndex = i - 1;
        else if (this.whereToInsert.position == RelativePosition.bottom ||
            this.whereToInsert.position == RelativePosition.right)
            insertionIndex = i + 1;

        let whereToInsertMainElement = this.whereToInsert.control.instance.getMainElement();
        if (this.whereToInsert.position == RelativePosition.left ||
            this.whereToInsert.position == RelativePosition.right) {
            whereToInsertMainElement.style.width = "50%";
            whereToInsertMainElement.style.display = 'inline-block';
            controlRef.instance.getMainElement().style.width = '50%';
            controlRef.instance.getMainElement().style.display = 'inline-block';

        } else if (this.whereToInsert.position == RelativePosition.top ||
            this.whereToInsert.position == RelativePosition.bottom) {
                whereToInsertMainElement.style.width = "100%";
                whereToInsertMainElement.style.display = 'block';
                controlRef.instance.getMainElement().style.width = '100%';
                controlRef.instance.getMainElement().style.display = 'block';    
        }
        this.workArea.insert(controlRef.hostView, insertionIndex);
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
        if (this.whereToInsert && this.whereToInsert.control && this.activeControl)
            this.addControl(this.activeControl);
            
        this.resetInsertionMarkers();
        this.controlOverWorkArea = false;
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
            control.instance.getMainElement().style.borderLeft = 'none';
            control.instance.getMainElement().style.borderRight = 'none';
            control.instance.getMainElement().style.borderTop = 'none';
            control.instance.getMainElement().style.borderBottom = 'none';
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