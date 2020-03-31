import { NavBarExtensionsRegistryProvider } from 'ui/registry/navbar_extensions';
import { downloadText } from 'download.js';
import { downloadData } from '../download.js'

let outputData = [];

// uiModules.get('kibana')
// .run(function (es) {
//   es.ping()
//   .catch(err => {
//     console.log('error pinging servers');
//   });
// });

function DownloadButtonProvider($route) {
  return {
    appName: 'discover',
    key: 'download-button',
    label: 'Download',
    run: function () {
      const savedSearch = $route.current.locals.savedSearch;
      const searchSource = savedSearch && savedSearch.searchSource;
      const size = 1000;

      outputData = [];
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

