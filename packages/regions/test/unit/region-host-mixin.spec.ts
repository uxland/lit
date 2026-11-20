import {expect, fixture, html as testHtml, waitUntil} from '@open-wc/testing';
import {html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {spy} from 'sinon';
import {
  IRegion,
  RegionDefinitions,
  region,
  regionHost,
  regionManager,
  regionView,
  type IRegionBehavior,
  type RegionDefinition,
} from '../../src/index';

class SpecView extends regionView(LitElement) {
  render() {
    return html`<span>view</span>`;
  }
}
customElements.define('spec-view', SpecView);

/** Host whose regions depend on the instance, rendered in light DOM. */
class DynamicHost extends regionHost(LitElement) {
  @property()
  name = '';
  createdCalls: IRegion[][] = [];
  createRenderRoot() {
    return this;
  }
  get regionDefinitions(): RegionDefinitions {
    return this.name ? {region: {name: this.name, targetId: `${this.name}-target`}} : {};
  }
  regionsCreated(regions: IRegion[]) {
    this.createdCalls.push(regions);
  }
  render() {
    return this.name ? html`<div id=${`${this.name}-target`}></div>` : html``;
  }
}
customElements.define('dynamic-host', DynamicHost);

class ToggleHost extends regionHost(LitElement) {
  @property({type: Boolean})
  showTarget = true;
  @region({name: 'toggle-region', targetId: 'toggle-target'})
  toggle: IRegion;
  render() {
    return this.showTarget ? html`<div id="toggle-target"></div>` : html``;
  }
}
customElements.define('toggle-host', ToggleHost);

const regionOf = (host: any) => host.region as IRegion | undefined;

describe('regionHost', () => {
  afterEach(() => regionManager.clear());

  describe('with per-instance region definitions', () => {
    it('creates a different region for each instance, in light DOM', async () => {
      const a = await fixture<DynamicHost>(testHtml`<dynamic-host name="region-a"></dynamic-host>`);
      const b = await fixture<DynamicHost>(testHtml`<dynamic-host name="region-b"></dynamic-host>`);
      await waitUntil(() => regionOf(a) && regionOf(b), 'regions not created');
      expect(regionOf(a).name).to.equal('region-a');
      expect(regionOf(b).name).to.equal('region-b');
      expect(regionManager.getRegion('region-a')).to.equal(regionOf(a));
      expect(regionOf(a).host).to.equal(a.querySelector('#region-a-target'));
    });

    it('renders the views registered for the region', async () => {
      regionManager.registerViewWithRegion('region-views', 'v1', {htmlTag: 'spec-view'});
      const host = await fixture<DynamicHost>(
        testHtml`<dynamic-host name="region-views"></dynamic-host>`
      );
      await waitUntil(
        () => host.querySelector('#region-views-target spec-view'),
        'view not rendered'
      );
    });

    it('calls regionsCreated once, after the region exists, with the created regions', async () => {
      const host = await fixture<DynamicHost>(
        testHtml`<dynamic-host name="region-once"></dynamic-host>`
      );
      await waitUntil(() => host.createdCalls.length === 1, 'regionsCreated not called');
      host.requestUpdate();
      await host.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 20));
      expect(host.createdCalls).to.have.length(1);
      expect(host.createdCalls[0]).to.deep.equal([regionOf(host)]);
    });

    it('creates the region when the definitions appear later', async () => {
      const host = await fixture<DynamicHost>(testHtml`<dynamic-host></dynamic-host>`);
      expect(regionOf(host)).to.equal(undefined);
      host.name = 'region-late';
      await waitUntil(() => regionOf(host), 'region not created');
      expect(regionOf(host).name).to.equal('region-late');
    });
  });

  describe('when the target element disappears', () => {
    it('removes the region and detaches its behaviors', async () => {
      const host = await fixture<ToggleHost>(testHtml`<toggle-host></toggle-host>`);
      await waitUntil(() => host.toggle, 'region not created');
      const created = host.toggle;
      const detach = spy();
      created.adapter.behaviors.push(<IRegionBehavior>{attach: async () => undefined, detach});
      host.showTarget = false;
      await waitUntil(() => host.toggle === undefined, 'region not removed');
      expect(regionManager.getRegion('toggle-region')).to.equal(undefined);
      expect(detach.calledOnce).to.equal(true);
    });

    it('creates it again when the target comes back', async () => {
      const host = await fixture<ToggleHost>(testHtml`<toggle-host></toggle-host>`);
      await waitUntil(() => host.toggle, 'region not created');
      const first = host.toggle;
      host.showTarget = false;
      await waitUntil(() => host.toggle === undefined, 'region not removed');
      host.showTarget = true;
      await waitUntil(() => host.toggle, 'region not recreated');
      expect(host.toggle).to.not.equal(first);
    });
  });

  it('exposes the decorated regions as regionDefinitions', async () => {
    const host = await fixture<ToggleHost>(testHtml`<toggle-host></toggle-host>`);
    expect(host.regionDefinitions).to.deep.equal({
      toggle: <RegionDefinition>{name: 'toggle-region', targetId: 'toggle-target'},
    });
  });
});
