import { LiveEditorComponent } from "../live-editor/live-editor.component";
import { ToolboxComponent } from "../toolbox/toolbox.component";
import { DesignerDraggingArea } from "./dragging-area";

export class Designer extends DesignerDraggingArea {
    editor: LiveEditorComponent;
    toolbox: ToolboxComponent;
    protected populateControlCollection(): void {
        this.toolbox.controlsCollection.forEach(controlComponentRef => 
            this.controlsCollection.add(controlComponentRef));
    }
    protected initDropZone(): void {
        this.dropZone = this.editor;
    }
}