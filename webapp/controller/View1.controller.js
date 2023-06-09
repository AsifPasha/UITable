sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sap.uitable.controller.View1", {
            onInit: function () {
                var oJsonModel = new sap.ui.model.json.JSONModel({
                    mtablemode: "display",
                    ColumnsResults: [],
                    CustomersResults: []
                });

                this.getView().setModel(oJsonModel, "ViewModel");
                var oModel = this.getOwnerComponent().getModel();

                oModel.read("/Customers", {
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            var aColumnData = [];
                            var aKeys = Object.keys(oData.results[0]);
                            for (let index = 0; index < aKeys.length; index++) {
                                if (typeof (oData.results[0][aKeys[index]]) === 'string') {
                                    aColumnData.push({
                                        colProperty: aKeys[index]
                                    });
                                }
                            }
                            this.getView().getModel("ViewModel").setProperty("/ColumnsResults", aColumnData);
                            this.getView().getModel("ViewModel").setProperty("/CustomersResults", oData.results);
                            this._dynmicBindTable("display");
                        }
                    }.bind(this),
                    error: function (oError) {
                    }.bind(this)
                });
            },
            _dynmicBindTable: function (smode) {
                var oTable = this.getView().byId("idUiTableDynamic");
                oTable.setModel(this.getView().getModel("ViewModel"));
                oTable.bindRows("/CustomersResults");
                oTable.bindColumns("/ColumnsResults", function (sId, oContext) {
                    var oColumn = oContext.getObject();
                    if (smode === "display") {
                        return new sap.ui.table.Column({
                            label: oColumn.colProperty,
                            template: new sap.m.Text({
                                text: "{" + oColumn.colProperty + "}",
                                wrapping: true
                            })
                        });
                    } else {
                        if (oColumn.colProperty !== "CustomerID") {

                            return new sap.ui.table.Column({
                                label: oColumn.colProperty,
                                template: new sap.m.Input({
                                    value: "{" + oColumn.colProperty + "}"
                                })
                            });
                        } else {
                            return new sap.ui.table.Column({
                                label: oColumn.colProperty,
                                template: new sap.m.Text({
                                    text: "{" + oColumn.colProperty + "}",
                                    wrapping: true
                                })
                            });
                        }
                    }
                });
            },
            onEditSavePress: function (oEvt) {
                if (oEvt.getSource().getText() === "Edit") {
                    this.getView().getModel("ViewModel").setProperty("/mtablemode", "edit");
                    this._dynmicBindTable("edit");
                    // this.getView().byId("AddRowBtn").setVisible(true);
                } else {
                    this.getView().getModel("ViewModel").setProperty("/mtablemode", "display");
                    this._dynmicBindTable("display");
                    // this.getView().byId("AddRowBtn").setVisible(false);

                }
            },
            onPressToOtherApp: function (oEvt) {
                // Navitgate to customerlist App

                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: "customerlist",
                        action: "display"
                    }

                })) || ""; // generate the Hash to display a Supplier
                // oCrossAppNavigator.toExternal({
                //     target: {
                //         shellHash: hash
                //     }
                // }); // navigate to customers application
                var sUrl = window.location.href.split("#")[0] + hash;
                sap.m.URLHelper.redirect(sUrl,true);
            },
            onCustomerPress: function (oEvt) {
                // Navitgate to customerlist App
                debugger;

                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: "customerlist",
                        action: "display"
                    },
                    params: {
                        customer: oEvt.getSource().getText()
                        // ,contactName: oEvt.getSource().getBindingContext("ViewModel").getObject().ContactName
                    }

                })) || ""; // generate the Hash to display a Supplier

                // To open the new app in same tab
                // oCrossAppNavigator.toExternal({
                //     target: {
                //         shellHash: hash
                //     }
                // }); // navigate to customers application

                // To Open the new APP in different tab
                var sUrl = window.location.href.split("#")[0] + hash;
                sap.m.URLHelper.redirect(sUrl,true);
            }
        });
    });
