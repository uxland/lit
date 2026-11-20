import {expect} from '@open-wc/testing';
import {AutoPopulateBehavior, defaultBehaviorRegistry} from '../../../src';

describe('Given default registry', () => {
  it('should contain AutoPopulateBehavior', () => {
    expect(defaultBehaviorRegistry.behaviors).to.contain(AutoPopulateBehavior);
  });
});
