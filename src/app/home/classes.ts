
export const enum HtmlPosition {
    absolute = 'absolute',
    relative = 'relative',
    static = 'static',
    default = 'static'
}
export const enum HtmlInputType {
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

