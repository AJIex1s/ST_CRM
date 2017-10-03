import {
    Component,
    Type,
    ComponentRef,
    ReflectiveInjector,
    Injectable,
    ComponentFactoryResolver } from '@angular/core';

import { 
    TextFieldComponent,
    BaseControl, 
    ControlParams, 
    InputFormControlParams 
} from './components/index';

export enum HtmlPosition {
    absolute,
    relative,
    static,
    default
}

export enum HtmlInputType {
    text,
    password
}

@Injectable()
export class ControlsFactory {
    constructor(private resolver: ComponentFactoryResolver) { }
    
    createControl(componentType: Type<BaseControl>,
        params: ControlParams): ComponentRef<BaseControl> {

        if(!params || !componentType)
            return null;

        let paramProviders = params.getProvidersToInject(); 
        
        let resolvedParams = ReflectiveInjector.resolve(paramProviders);

        // We create an injector out of the data we want to pass down and this components injector
        // add parent injector if needed, workArea.parentInjector);
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedParams);

        // We create a factory out of the component we want to create
        let factory = this.resolver.resolveComponentFactory(componentType);

        let componentRef = factory.create(injector) as ComponentRef<BaseControl>;

        componentRef.instance.ref = componentRef;

        return componentRef;
    }
    createTextFieldControl(): ComponentRef<TextFieldComponent> {
        let params = new InputFormControlParams(HtmlInputType.text, "Text Field");
        return this.createControl(TextFieldComponent, params) as ComponentRef<TextFieldComponent>;
    }
}
