import { by, Locator } from 'protractor';
import { BaseElement } from './base.element';

export class UiSwitch extends BaseElement {
    constructor(locator: Locator) {
        super(locator);
    }

    async switchOn() {
        if (!(await this.isOn())) {
            return this.element.click();
        }
    }

    async isOn() {
        const elementClass = await this.element.element(by.tagName('span')).getAttribute('class');
        return elementClass.includes('checked');
    }

    async switchOff() {
        if ((await this.isOn())) {
            return this.element.click();
        }
    }

    async setState(state: boolean) {
        if ((await this.isOn()) !== state) {
            return this.element.click();
        }
    }

    async isEnabled() {
        const elementClass = await this.element.element(by.tagName('span')).getAttribute('class');
        return !elementClass.includes('disabled');
    }
}
