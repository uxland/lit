import {APPNAME} from '@demo/core';
import {disconnect} from '@uxland/prism/disconnect';
import {html, LitElement, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

@customElement(`${APPNAME.toLowerCase()}-shell`)
export default class Shell extends LitElement {
  render(): TemplateResult {
    return html`shell! <button @click=${this.logout}>Logout</button>`;
  }
  logout() {
    disconnect();
  }
}
