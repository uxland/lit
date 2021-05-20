import {expect} from '@open-wc/testing';
import {IRegion, RegionDefinition} from '../../src/region';
import {region, regionsProperty} from '../../src/region-decorator';

describe('when adding a region decorator to a component', () => {
  it('should add region definition to component constructor', () => {
    const regionDefinition = <RegionDefinition>{};
    class Component {
      @region(regionDefinition)
      //@ts-ignore
      region: IRegion;
    }
    const regions = Component[regionsProperty];
    expect(regions).to.not.be.undefined;
    expect(regions.region).to.equal(regionDefinition);
  });
});
