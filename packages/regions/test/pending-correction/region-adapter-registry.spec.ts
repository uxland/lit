import {expect} from '@open-wc/testing';
import {adapterFactory, RegionAdapterRegistry} from '../../src/region-adapter-registry';

class Element1 {}
class Element2 {}

describe('Given an instance of RegionAdapterRegistry', () => {
  describe('and registring an adapter factory', () => {
    it('should allow to register by constructor', () => {
      const factory: adapterFactory = () => <any>{};
      const factory2: adapterFactory = () => <any>{};
      const regionAdapterRegistry = new RegionAdapterRegistry();
      regionAdapterRegistry.registerAdapterFactory(Element1, factory);
      regionAdapterRegistry.registerAdapterFactory(Element2, factory2);
      expect(regionAdapterRegistry.getAdapterFactory(<any>new Element1())).to.equal(factory);
      expect(regionAdapterRegistry.getAdapterFactory(<any>new Element2())).to.equal(factory2);
    });
    it('should allow to register by tag name', () => {
      const factory: adapterFactory = () => <any>{};
      const factory2: adapterFactory = () => <any>{};
      const regionAdapterRegistry = new RegionAdapterRegistry();
      regionAdapterRegistry.registerAdapterFactory(document.createElement('div').tagName, factory);
      regionAdapterRegistry.registerAdapterFactory(
        document.createElement('span').tagName,
        factory2
      );
      expect(regionAdapterRegistry.getAdapterFactory(document.createElement('div'))).to.equal(
        factory
      );
      expect(regionAdapterRegistry.getAdapterFactory(document.createElement('span'))).to.equal(
        factory2
      );
    });
    it('should allow to register by local name', () => {
      const factory: adapterFactory = () => <any>{};
      const factory2: adapterFactory = () => <any>{};
      const regionAdapterRegistry = new RegionAdapterRegistry();
      regionAdapterRegistry.registerAdapterFactory('div', factory);
      regionAdapterRegistry.registerAdapterFactory('span', factory2);
      expect(regionAdapterRegistry.getAdapterFactory(document.createElement('div'))).to.equal(
        factory
      );
      expect(regionAdapterRegistry.getAdapterFactory(document.createElement('span'))).to.equal(
        factory2
      );
    });
    it('should replace factory if key already exists', function () {
      const factory1: adapterFactory = () => <any>{};
      const factory2: adapterFactory = () => <any>{};
      const regionAdapterRegistry = new RegionAdapterRegistry();

      regionAdapterRegistry.registerAdapterFactory(Element1, factory1);
      regionAdapterRegistry.registerAdapterFactory(Element1, factory2);
      expect(regionAdapterRegistry.getAdapterFactory(<any>new Element1())).to.equal(factory2);

      regionAdapterRegistry.registerAdapterFactory('SPAN', factory2);
      regionAdapterRegistry.registerAdapterFactory('SPAN', factory1);
      expect(regionAdapterRegistry.getAdapterFactory(document.createElement('span'))).to.equal(
        factory1
      );

      regionAdapterRegistry.registerAdapterFactory('button', factory2);
      regionAdapterRegistry.registerAdapterFactory('button', factory1);
      expect(regionAdapterRegistry.getAdapterFactory(document.createElement('button'))).to.equal(
        factory1
      );
    });
    it('should allow define a default factory', () => {
      const factory1: adapterFactory = () => <any>{};
      const factory2: adapterFactory = () => <any>{};
      const regionAdapterRegistry = new RegionAdapterRegistry();
      regionAdapterRegistry.registerAdapterFactory(Element1, factory1);
      regionAdapterRegistry.registerDefaultAdapterFactory(factory2);
      expect(regionAdapterRegistry.getAdapterFactory(document.createElement('span'))).to.equal(
        factory2
      );
      expect(regionAdapterRegistry.getAdapterFactory(<any>new Element1())).to.equal(factory1);
    });
    it('should return null if no default factory defined', () => {
      const regionAdapterRegistry = new RegionAdapterRegistry();
      expect(regionAdapterRegistry.getAdapterFactory(document.createElement('div'))).to.be.null;
    });
  });
});
