import { Component, ViewContainerRef, ViewChild } from '@angular/core';

@Component({
    moduleId: module.id.toString(),
    selector: 'layout-item',
    templateUrl: 'layout-item.component.html',
    styleUrls: ['layout-item.component.css']
})
export class LayoutItemComponent {
    @ViewChild('itemContent', { read: ViewContainerRef }) contentContainer: ViewContainerRef;
}