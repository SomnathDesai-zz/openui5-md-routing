/**
 * Loading metadata and entity sets asynchronously in parallel.
 * Supporting 1.56+ only.
*/
sap.ui.define([
  // nothing
], () => async (server, {
  metadataUrl,
  mockdataDir,
  entitySetNames = [],
}) => {
  const setsLoaded = entitySetNames.map(name => loadSet(name, mockdataDir));
  const metadata = await loadMetadata(metadataUrl);
  return Promise.all(setsLoaded).then(sets => simulate(server, metadata, sets));

  async function loadSet(entitySetName, sourceDirectory) {
    const response = await fetch(`${sourceDirectory}/${entitySetName}.json`, {
      credentials: "include",
    });
    return {
      [entitySetName]: await response.json()
    };
  }

  async function loadMetadata(metadataUrl) {
    const response = await fetch(metadataUrl, {
      credentials: "include",
    });
    return await response.text();
  }

  function simulate(server, metadataText, sets) {
    const merge = (acc, obj) => Object.assign(acc, obj);
    const mappedSets = sets.reduce(merge);
    server.simulate(metadataText, {
      aEntitySetsNames: entitySetNames,
    });
    applySets(mappedSets, server);
  }

  function applySets(sets, server) {
    const names = Object.keys(sets);
    names.map(name => server.setEntitySetData(name, onlyResults(name)));
    function onlyResults(name) {
      return Array.isArray(sets[name]) ? sets[name] : sets[name].d.results;
    }
  }
});