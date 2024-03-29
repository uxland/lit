export function viewFactoryImporter(importer) {
  return async function () {
    const constructor = await importer();
    const element = new constructor.default();
    return Promise.resolve(element);
  };
}
