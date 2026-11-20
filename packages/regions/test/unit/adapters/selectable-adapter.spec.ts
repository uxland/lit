import {nop} from '@uxland/utilities';
import {SelectableAdapter} from '../../../src';

describe('When instantiating SelectableAdapter class', () => {
  it('should set attrForSelected property', () => {
    const adapter = new SelectableAdapter(<any>{});
    expect(adapter.host['attrForSelected']).toEqual('name');
  });
});
describe('Given an instance of SelectableAdapter class', () => {
  describe('and `viewAdded` method is invoked', () => {
    describe('and region has already an active view', () => {
      it('should do nothing', () => {
        const region = {
          activate: jest.fn(),
          deactivate: jest.fn(),
          currentActiveViews: [{}],
        };
        const adapter = new SelectableAdapter(<any>{uxlRegion: region});
        adapter.viewAdded(<any>{}).then(nop);
        expect(region.activate).not.toBeCalled();
        expect(region.activate).not.toBeCalled();
      });
    });
    describe('and region has no currently an active view', () => {
      it('it should activate added view if is default', async () => {
        const region = {
          activate: jest.fn(),
          deactivate: jest.fn(),
          currentActiveViews: [],
        };
        const adapter = new SelectableAdapter(<any>{uxlRegion: region});
        const view: any = {isDefault: true};
        await adapter.viewAdded(view).then(nop);
        expect(region.activate).toBeCalledWith(view);
      });
      it('should do nothing if added view is not default', () => {
        const region = {
          activate: jest.fn(),
          deactivate: jest.fn(),
          currentActiveViews: [{}],
        };
        const adapter = new SelectableAdapter(<any>{uxlRegion: region});
        adapter.viewAdded(<any>{isDefault: false}).then(nop);
        expect(region.activate).not.toBeCalled();
        adapter.viewAdded(<any>{}).then(nop);
        expect(region.activate).not.toBeCalled();
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
      expect(view['name']).toEqual('my-view');
    });
    it('should set host selected property to viewKey', async () => {
      const adapter = new SelectableAdapter(<any>{
        contains: () => true,
        uxlRegion: {currentActiveViews: []},
      });
      const view = {viewKey: 'my-view'};
      await adapter.activateView(<any>view);
      expect(adapter.host['selected']).toEqual('my-view');
    });
    it('should deactivate current active view', async () => {
      const region = {
        currentActiveViews: [{view: 'selected-view'}],
        deactivate: jest.fn(),
      };
      const adapter = new SelectableAdapter(<any>{
        contains: () => true,
        selected: 'selected-view',
        uxlRegion: region,
      });
      const view = {viewKey: 'my-view'};
      await adapter.activateView(<any>view);
      expect(region.deactivate).toBeCalledTimes(1);
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
      expect(adapter.host['selected']).toEqual('other-view');
    });
    it('should set host selected property to null if host selected property current value equals viewKey', async () => {
      const adapter = new SelectableAdapter(<any>{
        contains: () => true,
        selected: 'my-view',
        uxlRegion: {currentViews: []},
      });
      const view = {viewKey: 'my-view'};
      await adapter.deactivateView(<any>view);
      expect(adapter.host['selected']).toBeNull();
    });
    it('should activate default view if any', async () => {
      /*const defaultView = {viewKey: 'default-view', isDefault: true};
            const view = {viewKey: 'my-view'};
            const region = {currentViews: [defaultView], activate: jest.fn().mockImplementation(() => Promise.resolve(null))};
            const adapter = new SelectableAdapter(<any>{contains: () => true, selected: 'my-view', uxlRegion: region});
            await adapter.deactivateView(<any>view);
            expect(region.activate).toBeCalledWith(defaultView)*/
    });
  });
});
