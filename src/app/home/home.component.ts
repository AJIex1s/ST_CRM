import { Component } from '@angular/core';
import { DesignerDraggingArea } from './classes/dragging-area';



@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
})
export class HomeComponent {
    isMobileView: boolean;
    components: any[] = [];
    formWidth: string = "450px";
}