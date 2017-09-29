import { 
    Component,
    OnInit,
    ComponentRef,
    ViewChild,
    ComponentFactoryResolver,
    ViewContainerRef
} from '@angular/core';
import { 
    FormControlComponentsFactory,
    FormControlParams,
    InputFormControlParams,
    HtmlInputType, 
    HtmlPosition
} from '../classes';
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

    constructor(private componentFactory: FormControlComponentsFactory) {
        this.toolComponentControls = new Map<ViewContainerRef, ComponentRef<BaseFormControl>>();
    }
    
    ngOnInit(): void {        
        this.initToolboxControls();
        this.renderToolboxControls();
    }
    private initToolboxControls() {
        let textFieldControl = this.componentFactory.createTextFieldComponent();
        textFieldControl.instance.componentRef = textFieldControl;
        this.toolComponentControls.set(this.textField, textFieldControl);
    }
    private renderToolboxControls() {
        let keysIterator = this.toolComponentControls.keys();
        let viewContainer: ViewContainerRef = null;
        while(viewContainer = keysIterator.next().value) {
            viewContainer.insert(this.toolComponentControls.get(viewContainer).hostView);
        }
    }
}