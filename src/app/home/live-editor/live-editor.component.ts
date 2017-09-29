import { Component,
    ViewChild,
    ViewContainerRef,
    ComponentRef,
    Type
 } from '@angular/core';
import { TextFieldComponent, BaseFormControl } from '../components/index';
import {
    InputFormControlParams,
    FormControlComponentsFactory,
    HtmlInputType,
    HtmlPosition,
    FormControlParams
} from '../classes';

@Component({
    moduleId: module.id.toString(),
    selector: 'live-editor',
    templateUrl: 'live-editor.component.html',
    styleUrls: ['live-editor.component.css']
})
export class LiveEditorComponent {
    @ViewChild('workArea', { read: ViewContainerRef }) private workArea: ViewContainerRef;
    components: ComponentRef<BaseFormControl>[] = [];

    constructor(private componentFactory: FormControlComponentsFactory) {}

    
    addControl(controlComponentType: Type<BaseFormControl>, controlParams: FormControlParams) {
        let controlComponent = this.componentFactory.createComponent(controlComponentType, controlParams);
        this.workArea.insert(controlComponent.hostView);
        this.components.push(controlComponent);
    }
    removeControl(controlComponent: ComponentRef<BaseFormControl>) {
        let index = this.components.indexOf(controlComponent);

        if(index > -1) {
            this.components = this.components.splice(index, 1);
            this.workArea.remove(index);
        }
    }
    getWorkAreaElement(): HTMLElement {
        return (this.workArea.element.nativeElement as HTMLElement).parentElement.parentElement;
    }
}