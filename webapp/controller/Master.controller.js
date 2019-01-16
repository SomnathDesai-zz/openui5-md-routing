sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function(Controller) {
  "use strict";

  return Controller.extend("demo.controller.Master", {
    onInit: function() {
      this.getRoute("master").attachPatternMatched(() => {/*...*/});
      this.getRoute("masterDetail").attachPatternMatched(this.onDetail, this);
    },

    onDetail: function(event) {
      const {itemId} = event.getParameter("arguments");
      // ...
    },

    onItemPress: function(event) {
      const context = event.getParameter("listItem").getBindingContext("odata");
      this.getRouter().navTo("masterDetail", {
        itemId: context.getProperty("carrid")
      });
    },

  });
});