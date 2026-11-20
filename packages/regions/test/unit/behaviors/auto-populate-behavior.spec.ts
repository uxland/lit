import {assert, expect} from '@open-wc/testing';
import {stub} from 'sinon';
import {AutoPopulateBehavior} from '../../../src/behaviors/auto-populate-behavior';

describe('Given an instance of AutoPopulateBehavior', () => {
  describe('and `attach` method is invoked', () => {
    it('should add registered views to the target region', () => {
      const views = [
        {key: 'v1', view: <any>{}},
        {key: 'v2', view: <any>{}},
      ];
      const regionName = 'region';
      const region = {
        regionManager: {getRegisteredViews: stub().returns(views)},
        addView: stub(),
        name: regionName,
      };
      const behavior = new AutoPopulateBehavior(<any>region);
      behavior.attach();
      assert(region.regionManager.getRegisteredViews.calledWith(regionName));
      assert(region.addView.calledTwice);
      expect(region.addView.firstCall.args).to.deep.equal(['v1', {}]);
      expect(region.addView.secondCall.args).to.deep.equal(['v2', {}]);
    });
  });
});
