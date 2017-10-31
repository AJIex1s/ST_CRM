import { ComponentRef } from "@angular/core";

class Control {

}
class ToolBox {
    controls: ComponentRef<Control>[];
}
class Editor {}

class Designer {
    toolbox: ToolBox;
    editor: Editor;

    controls: ComponentRef<Control>[];
    
    constructor() {}

    subscribeForControlDragEvetns(component:  ComponentRef<Control>) {}

    dragStart(target: ComponentRef<Control>, evt: DragEvent) {}
    dragEnd(target: ComponentRef<Control>, evt: DragEvent) {}
}

// html.dragEnd(evt) -> component.dragEnd(evt) -> designer.dragEnd(component, evt) ->
// if overEditor then -> editor.dragEnd(component, evt) -> 
// editor.getInsertPosition(component) -> editor.insertComponent(component, index)   