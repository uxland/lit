import {nop} from '@uxland/utilities';
import {SingleActiveAdapter} from '../../../src';

describe('Given an instance of SingleActiveAdapter class', () => {
  describe('and `viewAdded` method is invoked', () => {
    describe('and region has already an active view', () => {
      it('should do nothing', async () => {
        const region = {
          activate: jest.fn(),
          deactivate: jest.fn(),
          currentActiveViews: [{}],
        };
        const adapter = new SingleActiveAdapter(<any>{uxlRegion: region});
        adapter.viewAdded(<any>{}).then(nop);
        expect(region.activate).not.toBeCalled();
        expect(region.deactivate).not.toBeCalled();
      });
    });
    describe('and region has no currently an active view', () => {
      it('it should activate added view if is default', () => {
        const region = {
          activate: jest.fn(),
          deactivate: jest.fn(),
          currentActiveViews: [],
        };
        const adapter = new SingleActiveAdapter(<any>{uxlRegion: region});
        const view: any = {isDefault: true};
        adapter.viewAdded(view).then(nop);
        expect(region.activate).toBeCalledWith(view);
      });
      it('should do nothing if added view is not default', () => {
        const region = {
          activate: jest.fn(),
          deactivate: jest.fn(),
          currentActiveViews: [],
        };
        const adapter = new SingleActiveAdapter(<any>{uxlRegion: region});
        adapter.viewAdded(<any>{isDefault: false}).then(nop);
        expect(region.activate).not.toBeCalled();
        adapter.viewAdded(<any>{}).then(nop);
        expect(region.activate).not.toBeCalled();
      });
    });
  });
  describe('and view is activated', () => {
    it('should deactivate current activated view', () => {
      const currentView = {htmlTag: 'my-view'};
      const region = {
        activate: jest.fn(),
        deactivate: jest.fn(),
        currentActiveViews: [currentView],
      };
      const adapter = new SingleActiveAdapter(<any>{
        uxlRegion: region,
        appendChild: jest.fn(),
        contains: jest.fn(),
      });
      adapter.activateView(<any>{});
      expect(region.deactivate).toBeCalledWith(currentView);
      region.currentActiveViews = [];
      region.deactivate.mockRestore();
      adapter.activateView(<any>{});
      expect(region.deactivate).not.toBeCalled();
    });
    it('should append view to host', () => {
      const region = {
        activate: jest.fn(),
        deactivate: jest.fn(),
        currentActiveViews: [],
      };
      const host = {
        appendChild: jest.fn(),
        contains: jest.fn(),
        uxlRegion: region,
      };
      const adapter = new SingleActiveAdapter(<any>host);
      const view: any = document.createElement('div');
      adapter.activateView(view);
      expect(host.appendChild).toBeCalledWith(view);
    });
    it('should not append view if already contained in host', () => {
      const region = {
        activate: jest.fn(),
        deactivate: jest.fn(),
        currentActiveViews: [],
      };
      const host = {
        uxlRegion: region,
        appendChild: jest.fn(),
        contains: jest.fn().mockReturnValue(true),
      };
      const adapter = new SingleActiveAdapter(<any>host);
      const view: any = document.createElement('div');
      adapter.activateView(view);
      expect(host.appendChild).not.toBeCalledWith(view);
    });
  });
  describe('and view is deactivated', () => {
    it('should remove from host is view definition `removeFromDOMwhenDeactivated is true', async () => {
      const region = {currentViews: [], viewRemovedFromDom: jest.fn()};
      const host = {removeChild: jest.fn(), uxlRegion: region};
      const view: any = document.createElement('div');
      view.view = {removeFromDomWhenDeactivated: true};
      const adapter = new SingleActiveAdapter(<any>host);
      await adapter.deactivateView(view);
      expect(host.removeChild).toBeCalledWith(view);
    });
    /*it('should activate defaultView if any in region', async () => {
            const view = {isDefault: true};
            const region = {currentViews: [view], activate: jest.fn()};
            const adapter = new SingleActiveAdapter(<any>{uxlRegion: region});
            await adapter.deactivateView(<any>{view: {}});
            expect(region.activate).toBeCalledWith(view);
        });*/
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
});
