import { Component, Injector } from '@angular/core';

@Component({
    moduleId: module.id.toString(),
    selector: 'designer',
    templateUrl: 'designer.component.html',
    styleUrls: ['designer.component.css']
})
export class DesignerComponent {
    isMobileView: boolean;
}