import { ControlComponentBase, LayoutControlComponent } from "./control-component";
import { ComponentRef } from "@angular/core";
import { ControlComponentRefCollection } from "./control-collection";

export class ControlDragEventArgs {
    event: DragEvent;
    dragStartTarget: ComponentRef<ControlComponentBase>;
    dragEndTarget: ComponentRef<ControlComponentBase>;
    get clientX(): number { return this.event.clientX; }
    get clientY(): number { return this.event.clientY; }
}
interface IDraggingArea {
    dragOverCore(args: ControlDragEventArgs): void;
    dragLeaveCore(args: ControlDragEventArgs): void;
    dragStartCore(args: ControlDragEventArgs): void;
    dragEndCore(args: ControlDragEventArgs): void;

}

export class ControlDraggingArea implements IDraggingArea {
    private controlsCollection: ControlComponentRefCollection;
    private mouseOverArea: boolean = false;

    dragOverCore(args: ControlDragEventArgs): void {
        this.mouseOverArea = true;
    }
    dragLeaveCore(args: ControlDragEventArgs): void {
    }
    dragStartCore(args: ControlDragEventArgs): void {
    }
    dragEndCore(args: ControlDragEventArgs): void {
    }
}