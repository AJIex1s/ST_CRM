import { Injector } from '@angular/core';
import { HtmlPosition, HtmlInputType } from '../../classes';

export class BaseFormControl {
    protected width: number = 100;
    protected height: number = 100;
    protected top: number = 0;
    protected left: number = 0;

    protected position: HtmlPosition = HtmlPosition.default;

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
}

export class InputFormControl extends BaseFormControl {
    protected placeholder: string = '';
    protected type: HtmlInputType = HtmlInputType.text;

    constructor(paramsInjector: Injector) {
        super(paramsInjector);
        this.type = paramsInjector.get('type');
        this.placeholder = paramsInjector.get('placeholder');

        if (this.width > 100 || this.width < 0)
            throw 'Width must be specified in range from 0 to 100';
    }
}
