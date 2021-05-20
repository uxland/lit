import {APPNAME} from '@demo/core';
import {html, LitElement, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

@customElement(`${APPNAME.toLowerCase()}-shell`)
export default class Shell extends LitElement {
  render(): TemplateResult {
    return html`shell!`;
  }
}
