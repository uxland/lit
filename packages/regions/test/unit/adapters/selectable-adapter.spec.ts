import {expect} from '@open-wc/testing';
import {restore, stub} from 'sinon';
import {SelectableAdapter} from '../../../src';

describe('When instantiating SelectableAdapter class', () => {
  it('should set attrForSelected property', () => {
    const adapter = new SelectableAdapter(<any>{});
    expect(adapter.host['attrForSelected']).to.equal('name');
  });
});
describe('Given an instance of SelectableAdapter class', () => {
  afterEach(() => restore());

  describe('and `viewAdded` method is invoked', () => {
    describe('and region has already an active view', () => {
      it('should do nothing', async () => {
        const region = {activate: stub(), deactivate: stub(), currentActiveViews: [{}]};
        const adapter = new SelectableAdapter(<any>{uxlRegion: region});
        await adapter.viewAdded(<any>{});
        expect(region.activate.called).to.equal(false);
        expect(region.deactivate.called).to.equal(false);
      });
    });
    describe('and region has no currently an active view', () => {
      it('it should activate added view if is default', async () => {
        const region = {activate: stub().resolves(), deactivate: stub(), currentActiveViews: []};
        const adapter = new SelectableAdapter(<any>{uxlRegion: region});
        const view: any = {isDefault: true};
        await adapter.viewAdded(view);
        expect(region.activate.calledWith(view)).to.equal(true);
      });
      it('should do nothing if added view is not default', async () => {
        const region = {activate: stub(), deactivate: stub(), currentActiveViews: []};
        const adapter = new SelectableAdapter(<any>{uxlRegion: region});
        await adapter.viewAdded(<any>{isDefault: false});
        await adapter.viewAdded(<any>{});
        expect(region.activate.called).to.equal(false);
      });
    });
  });
  describe('and a view is activated', () => {
    it('should set adapter.attrForSelected property to view', async () => {
      const adapter = new SelectableAdapter(<any>{
        contains: () => true,
        uxlRegion: {currentActiveViews: []},
      });
      const view = {viewKey: 'my-view'};
      await adapter.activateView(<any>view);
      expect(view['name']).to.equal('my-view');
    });
    it('should set host selected property to viewKey', async () => {
      const adapter = new SelectableAdapter(<any>{
        contains: () => true,
        uxlRegion: {currentActiveViews: []},
      });
      const view = {viewKey: 'my-view'};
      await adapter.activateView(<any>view);
      expect(adapter.host['selected']).to.equal('my-view');
    });
    it('should deactivate current active view', async () => {
      const region = {
        currentActiveViews: [{view: 'selected-view'}],
        deactivate: stub().resolves(),
      };
      const adapter = new SelectableAdapter(<any>{
        contains: () => true,
        selected: 'selected-view',
        uxlRegion: region,
      });
      const view = {viewKey: 'my-view'};
      await adapter.activateView(<any>view);
      expect(region.deactivate.calledOnce).to.equal(true);
    });
  });
  describe('and view is deactivated', () => {
    it('should do nothing if host selected is different than viewKey', async () => {
      const adapter = new SelectableAdapter(<any>{
        contains: () => true,
        selected: 'other-view',
      });
      const view = {viewKey: 'my-view'};
      await adapter.deactivateView(<any>view);
      expect(adapter.host['selected']).to.equal('other-view');
    });
    it('should set host selected property to null if host selected property current value equals viewKey', async () => {
      const adapter = new SelectableAdapter(<any>{
        contains: () => true,
        selected: 'my-view',
        uxlRegion: {currentViews: []},
      });
      const view = {viewKey: 'my-view'};
      await adapter.deactivateView(<any>view);
      expect(adapter.host['selected']).to.equal(null);
    });
    it('should activate default view if any', async () => {
      const defaultView = {isDefault: true};
      const region = {
        currentViews: [defaultView],
        currentActiveViews: [],
        activate: stub().resolves(),
      };
      const adapter = new SelectableAdapter(<any>{
        contains: () => true,
        selected: 'my-view',
        uxlRegion: region,
      });
      await adapter.deactivateView(<any>{viewKey: 'my-view', view: {}});
      expect(region.activate.calledWith(defaultView)).to.equal(true);
    });
  });
});
