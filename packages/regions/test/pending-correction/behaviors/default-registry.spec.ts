import {defaultBehaviorRegistry, AutoPopulateBehavior} from '../../../src';

describe('Given default registry', () => {
  it('should contain AutoPopulateBehavior', () => {
    expect(defaultBehaviorRegistry.behaviors).toContain(AutoPopulateBehavior);
  });
});
