import { Injector, Injectable, Output, EventEmitter, Type, ComponentRef } from '@angular/core';
import { HtmlPosition, HtmlInputType } from '../classes';

export class ComponentParams {
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
    public clone(): ComponentParams {
        let clone = new ComponentParams();
        Object.keys(this).forEach(param => {
            clone[param] = this[param];
        });
        return clone;
    }

}
export class InputFormComponentParams extends ComponentParams {

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
    static instantiateFromBaseParams(params: ComponentParams, type: HtmlInputType, placeholder: string) {
        let inst = params as InputFormComponentParams;
        inst.placeholder = placeholder;
        inst.type = type;
        return inst;
    }
}

export interface ComponentDragEventArgs {
    event: DragEvent;
    componentRef: ComponentRef<BaseFormComponent>;
}
export enum RelativePosition {
    Left,
    Right,
    Top,
    Bottom
}
export class BaseFormComponent {
    protected baseParams: ComponentParams;

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

    @Output() public dragStart = new EventEmitter<ComponentDragEventArgs>();
    @Output() public dragEnd = new EventEmitter<ComponentDragEventArgs>();
    public ref: ComponentRef<BaseFormComponent> = null;

    constructor(protected paramsInjector: Injector) {
        try {
            this.baseParams = new ComponentParams(
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

    public calcClosestBorderPositionAndNormalDistance(pointX: number, pointY: number) {
        let mainElementBounds = this.getMainElementBounds();
        let borderPosition = RelativePosition.Bottom;
        let distance = null;

        let leftDx = Math.abs(mainElementBounds.left - pointX);
        let rightDx = Math.abs(mainElementBounds.right - pointX);

        let topDy = Math.abs(mainElementBounds.top - pointY);
        let bottomDy = Math.abs(mainElementBounds.bottom - pointY);

        let minDy = topDy >= bottomDy ? bottomDy : topDy;
        let minDx = rightDx >= leftDx ? rightDx : rightDx;
        distance = minDx <= minDy ? minDx : minDy;

        if (pointY >= mainElementBounds.top &&
            pointY <= mainElementBounds.bottom &&
            (pointX <= mainElementBounds.left || pointX >= mainElementBounds.right)) {

            if (leftDx < rightDx)
                borderPosition = RelativePosition.Left;
            else
                borderPosition = RelativePosition.Right;

        } else {

            if (topDy < bottomDy)
                borderPosition = RelativePosition.Top;
            else
                borderPosition = RelativePosition.Bottom;
        }


        return { position: borderPosition, distance: distance };
    }
    public getPositionString(): string {
        return this.position != HtmlPosition.default && this.position != HtmlPosition.static ?
            HtmlPosition[this.position] : '';
    }
    public getParams(): ComponentParams {
        return this.baseParams;
    }
    public static getParamsType(): Type<ComponentParams> {
        return ComponentParams;
    }
}

export class InputFormComponent extends BaseFormComponent {
    private ownParams: InputFormComponentParams;

    protected get placeholder(): string { return this.ownParams.placeholder; }
    protected set placeholder(val: string) { this.ownParams.placeholder = val; }

    protected get type(): HtmlInputType { return this.ownParams.type; }
    protected set type(val: HtmlInputType) { this.ownParams.type = val; }

    constructor(paramsInjector: Injector) {
        super(paramsInjector);
        this.ownParams = InputFormComponentParams.instantiateFromBaseParams(
            this.baseParams,
            paramsInjector.get('type'),
            paramsInjector.get('placeholder')
        );

    }
    getParams(): ComponentParams {
        return this.ownParams;
    }
    static getParamsType(): Type<ComponentParams> {
        return InputFormComponentParams;
    }
}