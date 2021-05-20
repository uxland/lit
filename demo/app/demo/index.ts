// const initializeResources = () => {
//   const uxlRegions = () => import('@uxland/uxl-regions');
//   uxlRegions().then(({regionAdapterRegistry, selectableAdapterFactory}) => {
//     regionAdapterRegistry.registerAdapterFactory('uxl-content-switcher', selectableAdapterFactory);
//   });
//   const functionalUtilities = () => import('@uxland/functional-utilities');
//   functionalUtilities().then(({displayLayoutSizing, displayMetaInformation}) => {
//     // displayLayoutSizing(true);
//     displayMetaInformation();
//     window.addEventListener('resize', () => displayLayoutSizing(true));
//   });
// };

(async () => {
  console.log(`Demo v%%APP_VERSION%% (SEM)`);
  // initializeResources();
  import('../src/app').then(app => {
    document.body.innerHTML = '<demo-app></demo-app>';
    // const fonts = document.createElement("link");
    // fonts.href =
    //   "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&display=swap";
    // fonts.rel = "stylesheet";

    // const icons = document.createElement("link");
    // icons.href =
    //   "https://fonts.googleapis.com/css?family=Material+Icons&display=block";
    // icons.rel = "stylesheet";

    // document.head.appendChild(fonts);
    // document.head.appendChild(icons);
  });
})();
