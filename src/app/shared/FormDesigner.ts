export class Angular2Control {
    name: string;
    previewImgUri: string;
    
    html: string;
}

export class FormDesigner {
    private controls: Angular2Control[];

    addControlToForm(ctrl: Angular2Control) {
        this.controls.push(ctrl);
    }
}