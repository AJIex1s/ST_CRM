import { Injector } from '@angular/core';
import { FormControl } from '@angular/forms';

const enum HtmlPosition {
    absolute = 'absolute',
    relative = 'relative',
    static = 'static',
    default = 'static'
}
const enum HtmlInputType {
    text = 'text',
    password = 'password'
}
export class FormControlParams {
    constructor(
        public width: number = 0,
        public height: number = 0,
        public top: number = 0,
        public left: number = 0,
        public position: HtmlPosition = HtmlPosition.default) { }
}
export class InputFormControlParams extends FormControlParams {
    
    constructor(
        public type: HtmlInputType = HtmlInputType.text,
        public placeholder: string = '',
        width: number = 0,
        height: number = 0,
        top: number = 0,
        left: number = 0,
        position: HtmlPosition = HtmlPosition.default) {

        super(width, height, top, left, position);
    }
}

export class BaseFormControl {
    public width: number = 100;
    public height: number = 100;
    public top: number = 0;
    public left: number = 0;

    public position: HtmlPosition = HtmlPosition.default;

    constructor(protected paramsInjector: Injector) {
        try {
            this.width = paramsInjector.get('width');
            this.height = paramsInjector.get('height');
            this.top = paramsInjector.get('top');
            this.left = paramsInjector.get('left');
            this.position = paramsInjector.get('position');
        } catch (e) {
            console.error('param isn`t specified or specified incorrectly: ', e.toString());
        }
    }

    getPercentageWidth(): string {
        return this.width + '%';
    }
    getPercentageHeight(): string {
        return this.height + '%';
    }
    getTopCoordinate(): string {
        return this.top + 'px';
    }
    getLeftCoordinate(): string {
        return this.left + 'px';
    }
    getHtmlPositionValue(): string {
        return this.position;
    }

}

export class InputFormControl extends BaseFormControl implements InputFormControlParams {
    public placeholder: string;
    public type: HtmlInputType = HtmlInputType.text;

    constructor(paramsInjector: Injector) {
        super(paramsInjector);
        this.type = paramsInjector.get('type');        
        this.placeholder = paramsInjector.get('placeholder');
    }
}
