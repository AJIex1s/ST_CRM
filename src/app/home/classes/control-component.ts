import { Output, EventEmitter, ComponentRef, ViewChild, ElementRef } from "@angular/core";
import { ControlComponentRefCollection } from "./control-collection";
import { ControlDragEventArgs } from "./dragging-area";

interface IStyleOwner { }
interface IControlComponent { }
interface IDraggable { }

export class ControlComponentBase implements IControlComponent, IDraggable {
    private readonly HTML_POSITION = "";
    private isEnabled = false;
    private owner: ControlComponentBase = null;
    private controlsCollection: ControlComponentRefCollection = null;

    @Output() public dragStart = new EventEmitter<ControlDragEventArgs>();
    @Output() public dragEnd = new EventEmitter<ControlDragEventArgs>();
    public ref: ComponentRef<ControlComponentBase>;

    constructor(private mainElement: ElementRef) {}

    public get Owner() { return this.owner; }
    public get ControlsCollection() { return this.controlsCollection; }

    
    getMainElement(): HTMLElement {
        return this.mainElement.nativeElement;
    }

    private draggingStarted(e: DragEvent) {
        let args = ControlDragEventArgs.createArgs(e, this);
        this.dragStart.emit(args);
    }
    private draggingEnded(e: DragEvent) {
        let args = ControlDragEventArgs.createArgs(e, this);
        this.dragEnd.emit(args);
    }
}
export class LayoutControlComponent extends ControlComponentBase {
}
