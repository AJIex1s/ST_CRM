import {
    Component,
    OnInit,
    ComponentRef,
    ViewChild,
    ComponentFactoryResolver,
    ViewContainerRef
} from '@angular/core';
import { ControlsFactory, HtmlInputType, HtmlPosition } from '../classes';
import { BaseFormComponent, TextFieldComponent } from '../components/index';


@Component({
    moduleId: module.id.toString(),
    selector: 'toolbox',
    templateUrl: 'toolbox.component.html',
    styleUrls: ['toolbox.component.css']
})
export class ToolboxComponent implements OnInit {
    @ViewChild('textField', { read: ViewContainerRef }) textField: ViewContainerRef;
    public formComponents: Map<ViewContainerRef, ComponentRef<BaseFormComponent>>;

    constructor(private controlsFactory: ControlsFactory) {
        this.formComponents = new Map<ViewContainerRef, ComponentRef<BaseFormComponent>>();
    }

    ngOnInit(): void {
        this.initToolboxControls();
        this.renderToolboxControls();
    }
    private initToolboxControls() {
        let textFieldRef = this.controlsFactory.createTextFieldControl();
        textFieldRef.instance.ref = textFieldRef;
        this.formComponents.set(this.textField, textFieldRef);
    }
    private renderToolboxControls() {
        let keysIterator = this.formComponents.keys();
        let viewContainer: ViewContainerRef = null;
        while (viewContainer = keysIterator.next().value) {
            viewContainer.insert(this.formComponents.get(viewContainer).hostView);
        }
    }
}