import {expect} from '@open-wc/testing';
import {configureStore} from '../../../../test/utilities/redux-mock-store';
import {RoutingAdapter} from '../../routing-adapter';
import {RoutingRegionBehavior} from '../../routing-region-behavior';

describe('Given an instance of RoutingAdapter', () => {
  it('should return RoutingRegionBehavior in behaviors property', () => {
    //@ts-ignore
    const store: any = configureStore([])({routing: {}});
    const adapter = new RoutingAdapter(<any>{}, <any>{}, store, null);
    expect(adapter.behaviors.some(x => x.constructor === RoutingRegionBehavior)).true;
  });
  describe('and a view is added', () => {});
});
