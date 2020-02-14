import { by, ElementFinder, Locator } from 'protractor';
import { BaseElement } from './base.element';
import { Input } from './input.element';

export class InlineEditor extends BaseElement {

    constructor(locatorOrElement: Locator | ElementFinder) {
        super(locatorOrElement);
    }

    private inlineForm: ElementFinder = this.element.element(by.css('.inlineEditForm'));
    private inlineFormSave: ElementFinder = this.element.element(by.css('#inline-editor-button-save'));
    private inlineInput: Input = new Input(this.element.element(by.css('input, textarea')));
    private link: ElementFinder = this.element.element(by.css('a'));

    public async openEditor() {
        if (!(await this.inlineForm.isDisplayed())) {
            return this.element.click();
        }
    }

    public async accept() {
        if (await this.inlineForm.isDisplayed()) {
            return this.inlineFormSave.click();
        }
    }

    public async typeText(value: string) {
        if (await this.inlineForm.isDisplayed()) {
            return this.inlineInput.typeText(value);
        }
    }

    public async isEnabled(): Promise<boolean> {
        await this.element.click();
        return this.inlineForm.isDisplayed();
    }

    public async changeAndSetValue(value: string) {
        await this.openEditor();
        await this.typeText(value);
        return this.accept();
    }

    public async getValue() {
        return this.link.getText();
    }
}
