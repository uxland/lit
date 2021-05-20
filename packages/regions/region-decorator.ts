import {IRegionAdapter, RegionDefinition} from './region';

export const regionsProperty = '__uxl_regions__';

export const region =
  <T = any>(regionDefinition: RegionDefinition) =>
  (proto: any, propName: string) => {
    proto.constructor[regionsProperty] = {
      ...proto.constructor[regionsProperty],
      [propName]: regionDefinition,
    };
  };
