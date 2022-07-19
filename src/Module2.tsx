import {regionManager} from "@uxland/regions"
import {viewify} from './ReactRegionHost'

const IE = () => <a href="https://web.archive.org/web/19990218123408/http://www.microsoft.com/windows/ie/default.htm">
    <img src="https://c.tenor.com/7XD9gEkumN8AAAAC/internet-explorer-free.gif" width="120"></img>
</a>

regionManager.registerViewWithRegion('headerRegion', 'header-module-2', {sortHint: '002', factory: async () => viewify(IE)})
