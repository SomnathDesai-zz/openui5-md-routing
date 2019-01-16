sap.ui.define([
  "sap/ui/core/util/MockServer",
  "./simulatePreloaded",
], function(MockServer, simulatePreloaded) {
  "use strict";

  return {
    init: async function() {
      MockServer.config({
        autoRespond: true,
        autoRespondAfter: 0,
      });
      const mockServer = new MockServer({
        rootUri: "/sampleService/",
        recordRequests: false
      });
      const entitySetsToLoad = [
        "CarrierCollection",
        "FlightCollection",
      ];
      const pathPrefix = sap.ui.require.toUrl("demo/localService");
      await simulatePreloaded(mockServer, {
        metadataUrl: `${pathPrefix}/metadata.xml`,
        mockdataDir: `${pathPrefix}/mockdata`,
        entitySetNames: entitySetsToLoad,
      });
      // async function always returns a promise ..
      return mockServer.start(); // .. resolving w/ what's returned here.
    }, // https://javascript.info/async-await

  };
});