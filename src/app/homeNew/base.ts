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