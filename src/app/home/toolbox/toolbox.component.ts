import { Component } from '@angular/core';
import { ControlToolboxBase } from '../classes/toolbox';

@Component({
    moduleId: module.id.toString(),
    selector: 'toolbox',
    templateUrl: 'toolbox.component.html',
    styleUrls: ['toolbox.component.css']
})
export class ToolboxComponent extends ControlToolboxBase{
    constructor() {
        super();
    }

}