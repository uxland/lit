import {nop} from '@uxland/utilities';
import {MultipleActiveAdapter} from '../../../src';

describe('Given an instance of MultipleActiveAdapter class', () => {
  describe('and adding a view', () => {
    it('should activate view in region', async () => {
      const region: any = {activate: jest.fn()};
      const host = {uxlRegion: region};
      const adapter = new MultipleActiveAdapter(<any>host);
      const view: any = {};
      await adapter.viewAdded(view).then(nop);
      expect(region.activate).toBeCalledWith(view);
    });
  });
  describe('when inserting a view in region host', () => {
    it('should take sortHint into account', () => {
      const views = [{sortHint: '000'}, {sortHint: '001'}, {sortHint: '002'}];
      const viewComponent = document.createElement('div');
      const host = document.createElement('div');
      host['uxlRegion'] = {currentActiveViews: views};
      host.appendChild(viewComponent);
      const insertStub = jest.spyOn(host, 'insertBefore');
      const newComponent = document.createElement('span');
      newComponent['view'] = views[0];
      const adapter = new MultipleActiveAdapter(<any>host);
      adapter['addViewToHost'](<any>newComponent);
      expect(insertStub).toBeCalledTimes(1);
      jest.resetAllMocks();
    });
  });
});
