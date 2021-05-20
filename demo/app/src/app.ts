import {AppBase} from '@demo/core';
import '@uxland/uxl-content-switcher';
import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';
(() => import('./views/login'))();
(() => import('./views/shell'))();

@customElement('demo-app')
export default class DemoApp extends AppBase {
  render(): TemplateResult {
    return html`<uxl-content-switcher
      id="pages"
      attrForSelected="name"
      selected=${this.currentView}
    >
      <demo-login name="login"></demo-login>
      <demo-shell name="shell"></demo-shell>
    </uxl-content-switcher>`;
  }
}
