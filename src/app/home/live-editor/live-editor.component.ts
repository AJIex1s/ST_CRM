import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { DesignerDraggingArea, ControlDropZone } from '../classes/dragging-area';

@Component({
    moduleId: module.id.toString(),
    selector: 'live-editor',
    templateUrl: 'live-editor.component.html',
    styleUrls: ['live-editor.component.css']
})
export class LiveEditorComponent extends ControlDropZone {
    @ViewChild('areaView', { read: ViewContainerRef }) areaView: ViewContainerRef;
}