import { Injector, Injectable, Output, EventEmitter, Type, ComponentRef } from '@angular/core';
import { HtmlPosition, HtmlInputType } from '../classes';

export class ControlParams {
    constructor(
        public width: number = null,
        public height: number = null,
        public top: number = null,
        public left: number = null,
        public position: HtmlPosition = HtmlPosition.static,
        public isEnabled: boolean = false) { }
    public getProvidersToInject() {
        //todo refactor
        return Object.keys(this)
            .map(paramName => { return { provide: paramName, useValue: this[paramName] }; });
    }
    public clone(): ControlParams {
        let clone = new ControlParams();
        Object.keys(this).forEach(param => {
            clone[param] = this[param];
        });
        return clone;
    }

}
export class InputFormControlParams extends ControlParams {

    constructor(
        public type: HtmlInputType = HtmlInputType.text,
        public placeholder: string = '',
        width: number = null,
        height: number = null,
        top: number = null,
        left: number = null,
        position: HtmlPosition = HtmlPosition.default,
        isEnabled: boolean = false) {

        super(width, height, top, left, position);
    }
    static instantiateFromBaseParams(params: ControlParams, type: HtmlInputType, placeholder: string) {
        let inst = params as InputFormControlParams;
        inst.placeholder = placeholder;
        inst.type = type;
        return inst;
    }
}

export interface ControlDragEventArgs {
    event: DragEvent;
    componentRef: ComponentRef<BaseControl>;
}
export enum RelativePosition {
    left,
    right,
    top,
    bottom
}
export class BaseControl {
    protected baseParams: ControlParams;

    protected get width(): number { return this.baseParams.width || 100; }
    protected set width(val: number) { this.baseParams.width = val }

    protected get height(): number { return this.baseParams.height || 100; }
    protected set height(val: number) { this.baseParams.height = val || 100; }

    protected get top(): number { return this.baseParams.top || 0; }
    protected set top(val: number) { this.baseParams.top = val || 0; }

    protected get left(): number { return this.baseParams.left || 0; }
    protected set left(val: number) { this.baseParams.left = val || 0; }

    protected get isEnabled(): boolean { return this.baseParams.isEnabled; };
    protected set isEnabled(val: boolean) { this.baseParams.isEnabled = val; };

    protected get position(): HtmlPosition { return this.baseParams.position || HtmlPosition.default; };
    protected set position(val: HtmlPosition) { this.baseParams.position = val || HtmlPosition.default; };

    @Output() public dragStart = new EventEmitter<ControlDragEventArgs>();
    @Output() public dragEnd = new EventEmitter<ControlDragEventArgs>();
    public ref: ComponentRef<BaseControl> = null;

    constructor(protected paramsInjector: Injector) {
        try {
            this.baseParams = new ControlParams(
                paramsInjector.get('width'),
                paramsInjector.get('height'),
                paramsInjector.get('top'),
                paramsInjector.get('left'),
                paramsInjector.get('position'),
                paramsInjector.get('isEnabled'),
            );
        } catch (e) {
            console.error('param isn`t specified or specified incorrectly: ', e.toString());
        }
        if (this.width > 100 || this.width < 0)
            throw 'Width must be specified in range from 0 to 100';
    }
    public getMainElement() {
        return this.ref.location.nativeElement as HTMLElement;
    }
    public getMainElementBounds() {
        return this.getMainElement().getBoundingClientRect();
    }
    public getClosestBorderDistanceToPoint(x: number, y: number) {
        let mainElementBounds = this.getMainElementBounds();
        let resultPosition = RelativePosition.bottom;
        let resultDistance = -1;

        let leftDx = Math.abs(mainElementBounds.left - x);
        let rightDx = Math.abs(mainElementBounds.right - x);

        let topDy = Math.abs(mainElementBounds.top - y);
        let bottomDy = Math.abs(mainElementBounds.bottom - y);

        let minDy = topDy >= bottomDy ? bottomDy : topDy;
        let minDx = rightDx >= leftDx ? rightDx : rightDx;

        if(minDx < minDy) {
            resultDistance = minDx;
            if(leftDx < rightDx)
                resultPosition = RelativePosition.left;
            else
                resultPosition = RelativePosition.right;    
        } else {
            resultDistance = minDy;
            if(topDy < bottomDy)
                resultPosition = RelativePosition.top;
            else
                resultPosition = RelativePosition.bottom;
        }


        return { position: resultPosition, distance: resultDistance };
    }
    public getPositionString(): string {
        return this.position != HtmlPosition.default && this.position != HtmlPosition.static ?
            HtmlPosition[this.position] : '';
    }
    public getParams(): ControlParams {
        return this.baseParams;
    }
    public static getParamsType(): Type<ControlParams> {
        return ControlParams;
    }
}

export class InputFormControl extends BaseControl {
    private ownParams: InputFormControlParams;

    protected get placeholder(): string { return this.ownParams.placeholder; }
    protected set placeholder(val: string) { this.ownParams.placeholder = val; }

    protected get type(): HtmlInputType { return this.ownParams.type; }
    protected set type(val: HtmlInputType) { this.ownParams.type = val; }

    constructor(paramsInjector: Injector) {
        super(paramsInjector);
        this.ownParams = InputFormControlParams.instantiateFromBaseParams(
            this.baseParams,
            paramsInjector.get('type'),
            paramsInjector.get('placeholder')
        );

    }
    getParams(): ControlParams {
        return this.ownParams;
    }
    static getParamsType(): Type<ControlParams> {
        return InputFormControlParams;
    }
}
