import {expect, fixture, html as testHtml, waitUntil} from '@open-wc/testing';
import {html, LitElement} from 'lit';
import {regionHost, regionManager, regionView, region, IRegion} from '../../src/index';

class TestView extends regionView(LitElement) {
  activeCalls: Array<[boolean, boolean]> = [];
  activeChanged(current: boolean, previous: boolean) {
    this.activeCalls.push([current, previous]);
  }
  render() {
    return html`<span>view</span>`;
  }
}
customElements.define('test-region-view', TestView);

class TestHost extends regionHost(LitElement) {
  @region({name: 'smoke-region', targetId: 'content'})
  content: IRegion;
  render() {
    return html`<div id="content"></div>`;
  }
}
customElements.define('test-region-host', TestHost);

describe('Lit integration smoke test', () => {
  afterEach(() => regionManager.clear());

  it('regionView calls <prop>Changed when a reactive property changes', async () => {
    const el = await fixture<TestView>(testHtml`<test-region-view></test-region-view>`);
    el.active = true;
    await el.updateComplete;
    expect(el.activeCalls).to.deep.include([true, undefined]);
  });

  it('regionHost creates the region and renders registered views into the target', async () => {
    regionManager.registerViewWithRegion('smoke-region', 'v1', {htmlTag: 'test-region-view'});
    const host = await fixture<TestHost>(testHtml`<test-region-host></test-region-host>`);
    await waitUntil(() => !!host.content, 'region not created');
    const target = host.shadowRoot.querySelector('#content');
    await waitUntil(() => target.children.length === 1, 'view not added');
    const view = target.children[0] as TestView;
    expect(view.tagName.toLowerCase()).to.equal('test-region-view');
    await waitUntil(() => view.active === true, 'view not activated');
  });
});
