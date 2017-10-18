import { Output, EventEmitter, ComponentRef, ViewChild, ElementRef } from "@angular/core";
import { ControlComponentRefCollection } from "./control-collection";

interface IStyleOwner {}
interface IControlComponent {}

export class Draggable {
    @Output() public dragStart = new EventEmitter<DragEvent>();
    @Output() public dragEnd = new EventEmitter<DragEvent>();
     
    private draggingStarted(e: DragEvent) {
        this.dragStart.emit(e);
    }
    private draggingEnded(e: DragEvent) {
        this.dragEnd.emit(e);
    }
}

export class ControlComponentBase extends Draggable implements IControlComponent {
    private owner: ControlComponentBase;
    private controlsCollection: ControlComponentRefCollection = null;
    constructor(private mainElement:ElementRef) {
        super();
    }
    public get Owner() { return this.owner; }
    public get ControlsCollection() { return this.controlsCollection; }
    
    getMainElement(): HTMLElement {
        return this.mainElement.nativeElement;
    }
}
export class LayoutControlComponent extends ControlComponentBase {
}
