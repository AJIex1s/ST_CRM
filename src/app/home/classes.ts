import {
    Component,
    Type,
    ComponentRef,
    ReflectiveInjector,
    Injectable,
    ComponentFactoryResolver } from '@angular/core';

import { TextFieldComponent, BaseFormControl } from './components/index';
   
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
export class FormControlParams {
    constructor(
        public width: number = null,
        public height: number = null,
        public top: number = null,
        public left: number = null,
        public position: HtmlPosition = HtmlPosition.static,
        public isEnabled: boolean = false) { }
}
export class InputFormControlParams extends FormControlParams {

    constructor(
        public type: HtmlInputType = HtmlInputType.text,
        public placeholder: string = '',
        position: HtmlPosition = HtmlPosition.default,
        width: number = null,
        height: number = null,
        top: number = null,
        left: number = null,
        isEnabled: boolean = false) {

        super(width, height, top, left, position);
    }
}

@Injectable()
export class FormControlComponentsFactory {
    constructor(private resolver: ComponentFactoryResolver) { }
    
    createComponent(componentType: Type<BaseFormControl>,
        params: FormControlParams): ComponentRef<BaseFormControl> {

        if(!params || !componentType)
            return null;

        let paramProviders = Object
            .keys(params)
            .map(paramName => { return { provide: paramName, useValue: params[paramName] }; });

        let resolvedParams = ReflectiveInjector.resolve(paramProviders);

        // We create an injector out of the data we want to pass down and this components injector
        // add parent injector if needed, workArea.parentInjector);
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedParams);

        // We create a factory out of the component we want to create
        let factory = this.resolver.resolveComponentFactory(componentType);

        // We create the component using the factory and the injector
        return factory.create(injector) as ComponentRef<BaseFormControl>;
    }
    createTextFieldComponent(): ComponentRef<TextFieldComponent> {
        let params = new InputFormControlParams(HtmlInputType.text, "Text Field");
        return this.createComponent(TextFieldComponent, params) as ComponentRef<TextFieldComponent>;
    }
}
