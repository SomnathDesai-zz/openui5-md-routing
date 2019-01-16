/**
 * This is used as a controller extension which is available as of 1.61. https://github.com/SAP/openui5/commit/c70b85b761b552deb1d0203dd88f5ff3099416c7
 * See manifest>/sap.ui5/extends
 */
sap.ui.define([], function() {
  "use strict";

  return {
    getModel: function(modelName) {
      return this.getOwnerComponent().getModel(modelName);
    },

    getRoute: function(routeName) {
      return this.getOwnerComponent().getRouter().getRoute(routeName);
    },

    getRouter: function() {
      return this.getOwnerComponent().getRouter();
    }
  }
});