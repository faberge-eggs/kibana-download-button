import { NavBarExtensionsRegistryProvider } from 'ui/registry/navbar_extensions';
import { downloadData } from './downloadData.js'

function DownloadButtonProvider($route) {
  return {
    appName: 'discover',
    key: 'download-button',
    label: 'Download',
    run: function () {
      const savedSearch = $route.current.locals.savedSearch;
      const searchSource = savedSearch && savedSearch.searchSource;
      const size = 10000;

      if (searchSource) {
        searchSource.getSearchRequestBody().then(async (body) => {
            body["size"] = size
            let resp = await downloadData(body)
        })
      }
    }
  }
}

NavBarExtensionsRegistryProvider.register(DownloadButtonProvider);

