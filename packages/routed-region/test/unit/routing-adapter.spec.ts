import {expect} from '@open-wc/testing';
import createMockStore from 'redux-mock-store';
import {RoutingAdapter} from '../../src/routing-adapter';
import {RoutingRegionBehavior} from '../../src/routing-region-behavior';
describe('Given an instance of RoutingAdapter', () => {
  it('should return RoutingRegionBehavior in behaviors property', () => {
    const store: any = createMockStore([])({routing: {}});
    const adapter = new RoutingAdapter(<any>{}, <any>{}, store, null);
    expect(adapter.behaviors.some(x => x.constructor === RoutingRegionBehavior)).true;
  });
  describe('and a view is added', () => {});
});
