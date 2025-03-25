import {
  initFederation as initNativeFederation,
  getShared,
} from '@angular-architects/native-federation';
import { init as initModuleFederation } from '@module-federation/enhanced/runtime';

(async () => {
  // Step 1: Initialize Native Federation
  await initNativeFederation();

  // Step 2: Get metadata about libs shared via Native Federation
  const shared = getShared();

  // Step 3: Initialize Module Federation
  //  Remarks: Consider loading this MF config via the fetch API
  initModuleFederation({
    name: 'shell',
    remotes: [],
    // Step 3a: Delegate shared libs from Native Federation
    shared,
  }).initializeSharing();

  // Step 4: Delegate to file bootstrapping the SPA
  await import('./bootstrap');
})();
