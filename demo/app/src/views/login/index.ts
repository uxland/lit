import {APPNAME} from '@demo/core';
import {html, LitElement, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

@customElement(`${APPNAME.toLowerCase()}-login`)
export default class Login extends LitElement {
  render(): TemplateResult {
    return html`login!`;
  }
}
