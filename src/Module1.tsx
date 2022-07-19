import {regionManager} from "@uxland/regions"
import {viewify} from './ReactRegionHost'
import {state, useUpdateOnStateChange} from "./StateManager"

function Link() {
  return <a href="https://example.com">Example</a>
}

function Counter() {
  useUpdateOnStateChange()
  return <button onClick={() => state.count++}>increment count={state.count} from a module</button>
}

regionManager.registerViewWithRegion('headerRegion', 'header-module-1', {sortHint: '001', factory: async () => viewify(Link)})
regionManager.registerViewWithRegion('bodyRegion', 'body-module-1', {sortHint: '000', factory: async () => viewify(Counter)})
