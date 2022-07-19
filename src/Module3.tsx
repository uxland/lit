import {regionManager} from "@uxland/regions"
import {viewify} from './ReactRegionHost'
import {state, useUpdateOnStateChange} from "./StateManager"

const Thing = () => {
  useUpdateOnStateChange()
  return <span>another module knows that count is {state.count}</span>
}

regionManager.registerViewWithRegion('bodyRegion', 'body-module-3', {
  sortHint: '001', factory: async () => viewify(Thing)
})
