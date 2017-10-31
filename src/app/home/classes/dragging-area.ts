import { ControlComponentBase, LayoutControlComponent } from "./control-component";
import { ComponentRef, ViewContainerRef } from "@angular/core";
import { ControlComponentRefCollection } from "./control-collection";

export class ControlDragEventArgs {
    event: DragEvent;
    draggingControl: ControlComponentBase;
    get clientX(): number { return this.event.clientX; }
    get clientY(): number { return this.event.clientY; }
    static createArgs(event: DragEvent, control: ControlComponentBase): ControlDragEventArgs {
        let inst = new ControlDragEventArgs();
        inst.draggingControl = control;
        inst.event = event;
        return inst;
    }
}
export abstract class ControlDragAndDropZone {
    protected controlsCollection: ControlComponentRefCollection = null;
    protected dropZone: ControlDropZone;
    
    constructor() {
        this.initDragEvents();
    }
    
    protected get dropZoneViewContainer(): ViewContainerRef { 
        return this.dropZone.dropZoneViewContainer; 
    };

    public addControlToDropZone(controlComponent: ComponentRef<ControlComponentBase>) {
        this.controlsCollection.add(controlComponent);
        this.initControlDragEvents(controlComponent);
        this.dropZoneViewContainer.insert(controlComponent.hostView);
    }

    public insertControlIntoDropZone(controlComponent: ComponentRef<ControlComponentBase>, index: number) {
        this.controlsCollection.insertAt(controlComponent, index);
        this.initControlDragEvents(controlComponent);
        this.dropZoneViewContainer.insert(controlComponent.hostView, index);
    }

    protected abstract dragStartCore(event: ControlDragEventArgs): void;
    protected abstract dragEndCore(event: ControlDragEventArgs): void;
    protected abstract dragOver(args: ControlDragEventArgs): void;
    protected abstract dragLeave(args: ControlDragEventArgs): void;

    private initDragEvents() {
        if (this.controlsCollection && this.controlsCollection.length > 0)
            this.controlsCollection.forEach(controlComponent => {
                this.initControlDragEvents(controlComponent);
            });
    }
    private initControlDragEvents(controlComponent: ComponentRef<ControlComponentBase>) {
        controlComponent.instance.dragEnd.subscribe((args: ControlDragEventArgs) => this.dragEndCore(args));
        controlComponent.instance.dragStart.subscribe((args: ControlDragEventArgs) => this.dragStartCore(args));
    }
}

export abstract class ControlDropZone extends ControlDragAndDropZone {
    protected controlsCollection: ControlComponentRefCollection;
    private mouseOverArea: boolean = false;

    constructor() {
        super();
        this.dropZone = this;
    }
    public forceDragStart(args:ControlDragEventArgs) {
        this.dragStartCore(args);
    }
    public forceDragEnd(args:ControlDragEventArgs) {
        this.dragStartCore(args);
    }
    protected dragOver(args: ControlDragEventArgs): void {
        this.mouseOverArea = true;
    }
    protected dragLeave(args: ControlDragEventArgs): void {
        this.mouseOverArea = false;
    }

    protected dragStartCore(args: ControlDragEventArgs): void {
    }

    protected dragEndCore(args: ControlDragEventArgs): void {
        let draggingControlRef: ComponentRef<ControlComponentBase> =
            this.controlsCollection.tryGetItemByInstance(args.draggingControl);

        if (!this.mouseOverArea)
            return;
            
        if(!draggingControlRef) {

        }

        this.dropZoneViewContainer.insert(draggingControlRef.hostView);
    }
    
}

export abstract class DesignerDraggingArea extends ControlDragAndDropZone {
    private mouseOverDropZone: boolean = false;
    constructor() {
        super();
        this.populateControlCollection();
        this.initDropZone();
    }
    protected abstract populateControlCollection(): void;
    protected abstract initDropZone(): void;

    protected dragStartCore(args: ControlDragEventArgs): void {
    }
    protected dragEndCore(args: ControlDragEventArgs): void {
        this.dropZone.forceDragEnd(args);
    }
    protected dragOver(args: ControlDragEventArgs): void {
        this.mouseOverDropZone = true;
    }
    protected dragLeave(args: ControlDragEventArgs): void {
        this.mouseOverDropZone = false;
    }
}