import {
    Component,
    Type,
    ComponentRef,
    ReflectiveInjector,
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
        public width: number = 0,
        public height: number = 0,
        public top: number = 0,
        public left: number = 0,
        public position: HtmlPosition = HtmlPosition.static) { }
}
export class InputFormControlParams extends FormControlParams {

    constructor(
        public type: HtmlInputType = HtmlInputType.text,
        public placeholder: string = '',
        position: HtmlPosition = HtmlPosition.default,
        width: number = 0,
        height: number = 0,
        top: number = 0,
        left: number = 0,) {

        super(width, height, top, left, position);
    }
}

export class FormControlComponentsFactory {
    constructor(private resolver: ComponentFactoryResolver) { }
    createComponent(componentType: Type<BaseFormControl>,
        params: FormControlParams): ComponentRef<BaseFormControl> {
            
        let data = { inputs: {} };
        let workArea: any = null;
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
}
