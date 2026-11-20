import {expect} from '@open-wc/testing';
import {restore, stub} from 'sinon';
import {SingleActiveAdapter} from '../../../src';

describe('Given an instance of SingleActiveAdapter class', () => {
  afterEach(() => restore());

  describe('and `viewAdded` method is invoked', () => {
    describe('and region has already an active view', () => {
      it('should do nothing', async () => {
        const region = {activate: stub(), deactivate: stub(), currentActiveViews: [{}]};
        const adapter = new SingleActiveAdapter(<any>{uxlRegion: region});
        await adapter.viewAdded(<any>{});
        expect(region.activate.called).to.equal(false);
        expect(region.deactivate.called).to.equal(false);
      });
    });
    describe('and region has no currently an active view', () => {
      it('it should activate added view if is default', async () => {
        const region = {activate: stub().resolves(), deactivate: stub(), currentActiveViews: []};
        const adapter = new SingleActiveAdapter(<any>{uxlRegion: region});
        const view: any = {isDefault: true};
        await adapter.viewAdded(view);
        expect(region.activate.calledWith(view)).to.equal(true);
      });
      it('should do nothing if added view is not default', async () => {
        const region = {activate: stub(), deactivate: stub(), currentActiveViews: []};
        const adapter = new SingleActiveAdapter(<any>{uxlRegion: region});
        await adapter.viewAdded(<any>{isDefault: false});
        await adapter.viewAdded(<any>{});
        expect(region.activate.called).to.equal(false);
      });
    });
  });
  describe('and view is activated', () => {
    it('should deactivate current activated view', async () => {
      const currentView = {htmlTag: 'my-view'};
      const region = {
        activate: stub(),
        deactivate: stub().resolves(),
        currentActiveViews: <any[]>[currentView],
      };
      const adapter = new SingleActiveAdapter(<any>{
        uxlRegion: region,
        appendChild: stub(),
        contains: stub(),
      });
      await adapter.activateView(<any>{});
      expect(region.deactivate.calledWith(currentView)).to.equal(true);
      region.currentActiveViews = [];
      region.deactivate.resetHistory();
      await adapter.activateView(<any>{});
      expect(region.deactivate.called).to.equal(false);
    });
    it('should append view to host', async () => {
      const host = {
        appendChild: stub(),
        contains: stub().returns(false),
        uxlRegion: {activate: stub(), deactivate: stub(), currentActiveViews: []},
      };
      const adapter = new SingleActiveAdapter(<any>host);
      const view: any = document.createElement('div');
      await adapter.activateView(view);
      expect(host.appendChild.calledWith(view)).to.equal(true);
    });
    it('should not append view if already contained in host', async () => {
      const host = {
        uxlRegion: {activate: stub(), deactivate: stub(), currentActiveViews: []},
        appendChild: stub(),
        contains: stub().returns(true),
      };
      const adapter = new SingleActiveAdapter(<any>host);
      const view: any = document.createElement('div');
      await adapter.activateView(view);
      expect(host.appendChild.called).to.equal(false);
    });
  });
  describe('and view is deactivated', () => {
    it('should remove from host is view definition `removeFromDOMwhenDeactivated is true', async () => {
      const region = {currentViews: [], currentActiveViews: [], viewRemovedFromDom: stub()};
      const host = {removeChild: stub(), uxlRegion: region};
      const view: any = document.createElement('div');
      view.view = {removeFromDomWhenDeactivated: true};
      const adapter = new SingleActiveAdapter(<any>host);
      await adapter.deactivateView(view);
      expect(host.removeChild.calledWith(view)).to.equal(true);
    });
    it('should activate defaultView if any in region', async () => {
      const defaultView = {isDefault: true};
      const region = {
        currentViews: [defaultView],
        currentActiveViews: [],
        activate: stub().resolves(),
      };
      const adapter = new SingleActiveAdapter(<any>{uxlRegion: region});
      const view: any = document.createElement('div');
      view.view = {};
      await adapter.deactivateView(view);
      expect(region.activate.calledWith(defaultView)).to.equal(true);
    });
  });
});
