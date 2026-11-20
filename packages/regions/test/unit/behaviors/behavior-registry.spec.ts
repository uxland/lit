import {expect} from '@open-wc/testing';
import {BehaviorRegistry, IRegionBehavior} from '../../../src';
describe('Given an instance of BehaviorRegistry class', () => {
  describe('an a behavior is registered', () => {
    it('should be retrieved on behaviors property', () => {
      const registry = new BehaviorRegistry();
      class MyBehavior implements IRegionBehavior {
        // constructor(region: IRegion) {}
        attach(): Promise<void> {
          return Promise.resolve();
        }

        detach() {
          return Promise.resolve();
        }
      }

      registry.register(MyBehavior);
      expect(registry.behaviors).to.contain(MyBehavior);
      class MyOtherBehavior implements IRegionBehavior {
        // constructor(region: IRegion) {}
        attach(): Promise<void> {
          return Promise.resolve();
        }

        detach() {
          return Promise.resolve();
        }
      }
      registry.register(MyOtherBehavior);
      expect(registry.behaviors).to.contain(MyBehavior);
      expect(registry.behaviors).to.contain(MyOtherBehavior);
    });
    it('should not add duplicated items', () => {
      const registry = new BehaviorRegistry();
      class MyBehavior implements IRegionBehavior {
        // constructor(region: IRegion) {}
        attach(): Promise<void> {
          return Promise.resolve();
        }

        detach() {
          return Promise.resolve();
        }
      }

      registry.register(MyBehavior);
      registry.register(MyBehavior);
      expect(registry.behaviors.filter(b => b === MyBehavior).length).to.be(1);
    });
  });
});
