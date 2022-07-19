import {ReactRegionHost} from './ReactRegionHost'
import './StateManager'

export function App() {
    return <>
        <h1>Header</h1>
        <ReactRegionHost name="headerRegion"></ReactRegionHost>
        <h1>Body</h1>
        <ReactRegionHost name="bodyRegion"></ReactRegionHost>
    </>
}

import './Module1'
import './Module2'
import './Module3'
