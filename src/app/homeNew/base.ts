import { EventEmitter, Output, ComponentRef, ComponentFactoryResolver, ReflectiveInjector, Type, Injectable, ViewRef, ViewContainerRef } from "@angular/core";


class Guid {
    static newGuid() {
        return 'xx4xx-yxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export interface IStylesOwner {
    getStyleSheet(): CSSStyleSheet;
    getCssPrefix(): string;
    getBaseStyleText(): string;
}

export class Style {
    private styles: CSSRule = null;
    private name: string = '';


    constructor(private owner: IStylesOwner) { }

    get styleSheet() { return this.owner.getStyleSheet(); }

    init() {
        this.createCssRule();
    }
    getName() {
        return this.name;
    }
    private generateUniqueStyleName() {
        let name = '';
        while (true) {
            name = Guid.newGuid();
            if (this.styleSheet.cssText.indexOf(name) > -1)
                break;
        }
        return this.owner.getCssPrefix() + name;
    }

    private createCssRule() {
        this.name = this.generateUniqueStyleName();
        let index = this.styleSheet.insertRule(
            '#' + this.name +
            '{' + this.owner.getBaseStyleText() + '}'
        );
        this.styles = this.styleSheet.rules.item(index);
    }
}

export class FormLayout implements IStylesOwner {
    private styleSheet: CSSStyleSheet;
    private items: FormLayoutItem[];
    private hostView: ViewContainerRef;
    private resolver: ComponentFactoryResolver;

    constructor(hostView: ViewContainerRef, styleSheet: CSSStyleSheet,
        resolver: ComponentFactoryResolver) {
        this.styleSheet = styleSheet;
        this.hostView = hostView;
        this.resolver = resolver;
    }
    getStyleSheet(): CSSStyleSheet {
        return this.styleSheet;
    }
    getCssPrefix(): string {
        return 'fl';
    }
    getBaseStyleText(): string {
        return '';
    }

    createHierarchy() {
        this.items.forEach(layoutItem => {
            layoutItem.create(this.resolver);
        });
    }
    render() {
        this.items.forEach(layoutItem => {
            layoutItem.render(this.hostView);
        });
    }

}

export class FormLayoutItem implements IStylesOwner {
    private owner: FormLayout;
    private style: Style;
    private controls: FormLayoutControl[] = [];

    constructor(owner: FormLayout) {
        this.owner = owner;
    }

    getStyleSheet(): CSSStyleSheet {
        return this.owner.getStyleSheet();
    }
    getCssPrefix(): string {
        return 'flItem';
    }
    getBaseStyleText(): string {
        let width = 'width: 100%;';
        let height = 'height: 70px;';
        let textAlign = 'text-align: left;';

        let styles = width + '\n\r' +
            height + '\n\r' +
            textAlign + '\n\r';

        return styles;
    }
    create(resolver: ComponentFactoryResolver) {
        this.createControls(resolver)
    }

    render(viewRef: ViewContainerRef) {
        this.renderControls(viewRef);
    }

    private renderControls(viewRef: ViewContainerRef) {
        this.controls.forEach(control => {
            control.render(viewRef);
        });
    }

    private createControls(resolver: ComponentFactoryResolver) {
        this.controls.forEach(control => {
            control.create(resolver);
        });
    }
}

export interface IDraggable {
    dragStart(evt: DragEvent): void;
    dragEnd(evt: DragEvent): void;
}

export class Draggable implements IDraggable {
    @Output() dragStartEmitter = new EventEmitter<DragEvent>();
    @Output() dragEndEmitter = new EventEmitter<DragEvent>();

    constructor() {
    }

    dragStart(evt: DragEvent): void {
        this.dragStartEmitter.emit(evt);
    }
    dragEnd(evt: DragEvent): void {
        this.dragEndEmitter.emit(evt);
    }
}


export class FormLayoutControl extends Draggable implements IStylesOwner {
    private style: Style;
    private componentRef: ComponentRef<FormLayoutControl>;

    constructor(private owner: FormLayoutItem) {
        super();
    }
    public get name() { return this.style.getName(); }
    getStyleSheet(): CSSStyleSheet {
        return this.owner.getStyleSheet()
    }
    getCssPrefix(): string {
        return 'flControl';
    }
    getBaseStyleText(): string {
        let width = 'width: 100%;';
        return width + '\n\r';
    }

    create(resolver: ComponentFactoryResolver) {
        let paramProviders = [{ provide: 'className', useValue: this.name }];
        let resolvedParams = ReflectiveInjector.resolve(paramProviders);
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedParams);

        let factory = resolver.resolveComponentFactory(FormLayoutControl);

        this.componentRef = factory.create(injector);
    }

    render(viewRef: ViewContainerRef) {
        viewRef.insert(this.componentRef.hostView);
    }
}