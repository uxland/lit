import {expect, fixture, html as testHtml, waitUntil} from '@open-wc/testing';
import {html, LitElement} from 'lit';
import {spy} from 'sinon';
import {IRegion, IRegionBehavior, region, regionHost, regionManager} from '../../src/index';

class LegacyHost extends regionHost(LitElement) {
  @region({name: 'legacy-region', targetId: 'legacy-target'})
  legacy: IRegion;
  render() {
    return html`<div id="legacy-target"></div>`;
  }
}
customElements.define('legacy-host', LegacyHost);

/**
 * The creation / attach cases of the original spec are covered by region-host-mixin.spec.ts. Only the
 * behaviour on disconnect is kept here.
 */
describe('Given a component that extends regionHost, when it is disconnected', () => {
  afterEach(() => regionManager.clear());

  it('should remove its regions from the region manager', async () => {
    const host = await fixture<LegacyHost>(testHtml`<legacy-host></legacy-host>`);
    await waitUntil(() => host.legacy, 'region not created');
    expect(regionManager.getRegion('legacy-region')).to.equal(host.legacy);
    host.remove();
    expect(regionManager.getRegion('legacy-region')).to.equal(undefined);
  });
  it('should detach the behaviors of its regions', async () => {
    const host = await fixture<LegacyHost>(testHtml`<legacy-host></legacy-host>`);
    await waitUntil(() => host.legacy, 'region not created');
    const detach = spy();
    host.legacy.adapter.behaviors.push(<IRegionBehavior>{attach: async () => undefined, detach});
    host.remove();
    expect(detach.calledOnce).to.equal(true);
  });
});
