import {RegionDefinition} from '@uxland/regions/region';
import {region} from '@uxland/regions/region-decorator';
export interface RouterRegionDefinition extends RegionDefinition {
  route: string;
  defaultPage?: string;
}
export const routerRegion = <T = any>(definition: RouterRegionDefinition) => region(definition);
