import {expect} from '@open-wc/testing';
import {restore, spy, stub} from 'sinon';
import {
  MultipleActiveAdapter,
  multipleActiveAdapterFactory,
  multipleActiveAdapterFaactory,
} from '../../../src';

describe('Given an instance of MultipleActiveAdapter class', () => {
  afterEach(() => restore());

  describe('and adding a view', () => {
    it('should activate view in region', async () => {
      const region: any = {activate: stub().resolves()};
      const adapter = new MultipleActiveAdapter(<any>{uxlRegion: region});
      const view: any = {};
      await adapter.viewAdded(view);
      expect(region.activate.calledWith(view)).to.equal(true);
    });
  });
  describe('when inserting a view in region host', () => {
    it('should take sortHint into account', () => {
      const views = [{sortHint: '000'}, {sortHint: '001'}, {sortHint: '002'}];
      const viewComponent = document.createElement('div');
      const host: any = document.createElement('div');
      host.uxlRegion = {currentActiveViews: views};
      host.appendChild(viewComponent);
      const insertSpy = spy(host, 'insertBefore');
      const newComponent: any = document.createElement('span');
      newComponent.view = views[0];
      const adapter = new MultipleActiveAdapter(host);
      adapter['addViewToHost'](newComponent);
      expect(insertSpy.calledOnce).to.equal(true);
      expect(host.firstElementChild).to.equal(newComponent);
    });
  });
  describe('factories', () => {
    it('should create a MultipleActiveAdapter for the target', () => {
      const target: any = {};
      const adapter = multipleActiveAdapterFactory(<any>{}, target);
      expect(adapter).to.be.instanceOf(MultipleActiveAdapter);
      expect((adapter as MultipleActiveAdapter).host).to.equal(target);
    });
    it('should keep the deprecated misspelled factory as an alias', () => {
      expect(multipleActiveAdapterFaactory).to.equal(multipleActiveAdapterFactory);
    });
  });
});
