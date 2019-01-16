sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/syncStyleClass",
], function(Controller, syncStyleClass) {
  "use strict";

  return Controller.extend("demo.controller.Detail", {
    onInit: function() {
      const route = this.getRouter().getRoute("masterDetail");
      route.attachPatternMatched(this.onPatternMatched, this);
    },

    onPatternMatched: function(event) {
      const model = this.getModel("odata");
      const {itemId} = event.getParameter("arguments");
      model.metadataLoaded().then(() => this.bindCarrier(model, itemId));
    },

    bindCarrier: function(model, carrid) {
      const key = model.createKey("CarrierCollection", {carrid});
      this.getView().bindElement(`odata>/${key}`);
    },

    onAddBtnPress: function() {
      const dialog = this.byId("dialog");
      syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
      dialog.open();
    },
    
    // DIALOG ------------------------------------------------------------

    onBeforeDialogOpen: function(event) {
      const context = this.getView().getBindingContext("odata");
      this.setDeferred("addingFlight", context.getModel());
      const newContext = context.getModel().createEntry("/FlightCollection", {
        properties: {
          "carrid": context.getProperty("carrid"),
          //FIXME: flightDetails (such as departureTime) won't be added to the table due to the MockServer not supporting complex types. See https://github.com/SAP/openui5/issues/471#issuecomment-282988369
        },
        groupId: "addingFlight",
      });
      event.getSource().setBindingContext(newContext, "odata");
    },

    setDeferred: function(groupId, model) {
      const groupsIds = model.getDeferredGroups();
      if (!groupsIds.find(id => id === groupId)) {
        model.setDeferredGroups(model.getDeferredGroups().concat(groupId));
      }
    },

    onDialogAddPress: function() {
      const dialog = this.byId("dialog");
      const isInput = control => control.isA("sap.m.InputBase");
      const inputs = dialog.getControlsByFieldGroupId("inputs").filter(isInput);
      const invalidInput = inputs.find(this.hasStateError);
      if (invalidInput) {
        invalidInput.focus();
      } else {
        const connid = dialog.getBindingContext("odata").getProperty("connid");
        this.getView().getModel("odata").submitChanges({
          groupId: "addingFlight",
          success: this.onCreateSuccess.bind(this, connid),
        });
      }       
    },
  
    hasStateError: function(control) {
      return control.getValueState() === "Error";
    },

    onDialogCancelPress: function() {
      this.byId("dialog").close();
    },

    onCreateSuccess: function(connid) {
      const message = `Flight ${connid} Added`;
      sap.ui.require(["sap/m/MessageToast"], MT => MT.show(message));
      this.byId("dialog").close();
    },

    onAfterDialogClose: function(event) {
      event.getSource().unbindElement("odata");
    },

  });
});