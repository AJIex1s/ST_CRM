import { Injector, Output, EventEmitter, Type, ComponentRef } from '@angular/core';
import { HtmlPosition, HtmlInputType, FormControlParams, InputFormControlParams } from '../../classes';

export interface FormControlDragEventArgs {
    event: DragEvent;
    componentRef: ComponentRef<BaseFormControl>;
}

export class BaseFormControl {
    @Output() dragStart = new EventEmitter<FormControlDragEventArgs>();
    @Output() dragEnd = new EventEmitter<FormControlDragEventArgs>();
    protected width: number = 100;
    protected height: number = 100;
    protected top: number = 0;
    protected left: number = 0;
    protected isEnabled: boolean = false;
    protected position: HtmlPosition = HtmlPosition.default;
    public componentRef: ComponentRef<BaseFormControl> = null;
    
    constructor(protected paramsInjector: Injector) {
        try {
            this.width = paramsInjector.get('width');
            this.height = paramsInjector.get('height');
            this.top = paramsInjector.get('top');
            this.left = paramsInjector.get('left');
            this.isEnabled = paramsInjector.get('isEnabled');            
            this.position = paramsInjector.get('position');
        } catch (e) {
            console.error('param isn`t specified or specified incorrectly: ', e.toString());
        }
        if (this.width > 100 || this.width < 0)
            throw 'Width must be specified in range from 0 to 100';
    }
    getPositionString(): string {
        return this.position != HtmlPosition.default && this.position != HtmlPosition.static  ?
            HtmlPosition[this.position] : '';
    }
    getParams(): FormControlParams {
        return new FormControlParams(this.width,
             this.height, this.top, this.left, this.position, this.isEnabled);
    }
    static getParamsType(): Type<FormControlParams> {
        return FormControlParams;
    }
}

export class InputFormControl extends BaseFormControl {
    protected placeholder: string = '';
    protected type: HtmlInputType = HtmlInputType.text;

    constructor(paramsInjector: Injector) {
        super(paramsInjector);
        this.type = paramsInjector.get('type');
        this.placeholder = paramsInjector.get('placeholder');
        
    }
    getParams(): FormControlParams {
        return new InputFormControlParams(this.type, this.placeholder, this.position,
            this.width, this.height, this.top, this.left, this.isEnabled);
    }
    static getParamsType(): Type<FormControlParams> {
        return InputFormControlParams;
    }
}
