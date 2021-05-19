import {region, RegionDefinition} from '@uxland/regions';
export interface RouterRegionDefinition extends RegionDefinition {
  route: string;
  defaultPage?: string;
}
export const routerRegion = <T = any>(definition: RouterRegionDefinition) => region(definition);
