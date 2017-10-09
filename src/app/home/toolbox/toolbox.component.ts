import {
    Component,
    OnInit,
    ComponentRef,
    ViewChild,
    ComponentFactoryResolver,
    ViewContainerRef
} from '@angular/core';
import { ControlsFactory, HtmlInputType, HtmlPosition } from '../classes';
import { BaseFormControl, TextFieldComponent } from '../components/index';


@Component({
    moduleId: module.id.toString(),
    selector: 'toolbox',
    templateUrl: 'toolbox.component.html',
    styleUrls: ['toolbox.component.css']
})
export class ToolboxComponent implements OnInit {
    @ViewChild('textField', { read: ViewContainerRef }) textField: ViewContainerRef;
    public toolComponentControls: Map<ViewContainerRef, ComponentRef<BaseFormControl>>;

    constructor(private controlsFactory: ControlsFactory) {
        this.toolComponentControls = new Map<ViewContainerRef, ComponentRef<BaseFormControl>>();
    }

    ngOnInit(): void {
        this.initToolboxControls();
        this.renderToolboxControls();
    }
    private initToolboxControls() {
        let textFieldRef = this.controlsFactory.createTextFieldControl();
        textFieldRef.instance.ref = textFieldRef;
        this.toolComponentControls.set(this.textField, textFieldRef);
    }
    private renderToolboxControls() {
        let keysIterator = this.toolComponentControls.keys();
        let viewContainer: ViewContainerRef = null;
        while (viewContainer = keysIterator.next().value) {
            viewContainer.insert(this.toolComponentControls.get(viewContainer).hostView);
        }
    }
}