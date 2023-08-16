import {RegionDefinition} from '@uxland/regions/region';
import {region} from '@uxland/regions/region-decorator';
let STUB = 1;

/**
 * RouterRegionDefinition interface
 * @memberof RouterRegion
 * @since v1.0.0
 * @interface RouterRegionDefinition
 * @property {string} route Route path
 * @property {string*} defaultPage Default fallback page
 * @extends {RouterRegion.RegionDefinition}
 */
export interface RouterRegionDefinition extends RegionDefinition {
  route: string;
  defaultPage?: string;
}
STUB = 1;

/**
 * Publishes a message
 * @function
 * @memberof RouterRegion
 * @name routerRegion
 * @param {RouterRegion.RouterRegionDefinition} definition Router region definition The event or channel to publish to
 * @returns {void|never}
 * @example
 *
 * routerRegion({route: '/foo', defaultPage: 'def'})
 *
 */
export const routerRegion = <T = any>(definition: RouterRegionDefinition) => region(definition);
