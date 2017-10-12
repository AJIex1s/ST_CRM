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
    componentRef: ComponentRef<BaseFormComoponent>;
}
export enum RelativePosition {
    Left,
    Right,
    Top,
    Bottom
}
export class BaseFormComoponent {
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
    public ref: ComponentRef<BaseFormComoponent> = null;

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
    public getParams(): ControlParams {
        return this.baseParams;
    }
    public static getParamsType(): Type<ControlParams> {
        return ControlParams;
    }
}

export class InputFormComponent extends BaseFormComoponent {
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

export class FormLayoutItemBaseRules {

}
export class FormLayoutItem {
    private owner: FormLayout;
    private itemName: string;
    private cssRule: CSSRule;

    private getBasestyles() {
        let width = 'width: 100%;';
        let height = 'height: 70px;';
        let textAlign = 'text-align: left;';

        let styles = width + '\n\r' +
            height + '\n\r' +
            textAlign + '\n\r';

        return styles;
    }
    
    @Output() public dragStart = new EventEmitter<ControlDragEventArgs>();
    @Output() public dragEnd = new EventEmitter<ControlDragEventArgs>();
    constructor(owner: FormLayout) {
        this.owner = owner;
        this.createCssRule();
    }

    private createCssRule() {
        let index = this.owner.styleSheet.insertRule(
            '#' + this.itemName + '{' + this.getBasestyles() + '}'
        );
        this.cssRule = this.owner.styleSheet.rules.item(index);
    }
    changeCssStyle(newStyles: string) {
        this.cssRule.cssText = '#' + this.itemName + '{' + newStyles + '}';
    }
}

export class FormLayoutLine extends FormLayoutItem {

}

export class FormLayout {
    styleSheet: CSSStyleSheet;
    constructor(styleSheet: CSSStyleSheet) {
        this.styleSheet = styleSheet;
    }
}