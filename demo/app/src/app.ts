import '@uxland/uxl-content-switcher';
import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';
import {AppBase} from './app-base';

@customElement('demo-app')
export default class DemoApp extends AppBase {
  render(): TemplateResult {
    return html`<uxl-content-switcher
      id="pages"
      attrForSelected="name"
      selected=${this.currentView}
    >
      <monorepo-login name="login"></monorepo-login>
      <monorepo-shell name="shell"></monorepo-shell>
    </uxl-content-switcher>`;
  }
}
