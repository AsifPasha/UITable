sap.ui.define([
    // "sap/ui/core/mvc/Controller",
    "./BaseController",
    "sap/ui/table/Column",
    "sap/ui/model/json/JSONModel"
], (BaseController, Column,JSONModel) => {
    "use strict";
var oController = this;
    return BaseController.extend("com.sap.uitable.controller.View1", {
        onInit() {
            // this._LoadEmployeeData();
            // return;
            var oJsonModel = new JSONModel({
                mtablemode: "display",
                ColumnsResults: [],
                CustomersResults: []
            });
            this.getView().setModel(oJsonModel, "ViewModel");
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/Customers", {
                success: (oData) => {
                    if (oData.results && oData.results.length > 0) {
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
                        oJsonModel.setProperty("/CustomersResults", oData.results);
                        this._dynmicBindTable("display","idUiTableDynamic","ViewModel","CustomersResults","ColumnsResults");
                    }
                },
                error: (oError) => {
                    console.error("Failed to fetch customers:", oError);
                }
            });
           
            // this._dynmicBindTable("display","idUiTableDynamic","ViewModel","CustomersResults","ColumnsResults");
            this._LoadEmployeeData();
         

        },
        // _dynmicBindTable: function (smode,id,oModel,rowBind,colBind) {
        //     // debugger;
        //     var oTable = this.getView().byId(id);
        //     oTable.setModel(this.getView().getModel(oModel));
        //     oTable.bindRows("/" +rowBind);

        //     oTable.bindColumns("/"+colBind, function (sId, oContext) {
        //         var oColumn = oContext.getObject();
        //         var oTemplate = this._getTemplate(smode, oColumn);
        //         // Create a new column for the table with the specified properties
        //         return new Column({
        //             label: oColumn.colProperty,
        //             template: oTemplate
        //         });
        //     }.bind(this));

////////////////////////////////////////////////////////////////////////////////////////////////////
            // var oTable = this.getView().byId("idUiTableDynamic");
            // oTable.setModel(this.getView().getModel("ViewModel"));
            // oTable.bindRows("/CustomersResults");

            // oTable.bindColumns("/ColumnsResults", function (sId, oContext) {
            //     var oColumn = oContext.getObject();
            //     var oTemplate = this._getTemplate(smode, oColumn);
            //     return new Column({
            //         label: oColumn.colProperty,
            //         template: oTemplate
            //     });
            // }.bind(this));

  ////////////////////////////////////////////////////////////////////////////////////////      
            // oTable.bindColumns("/ColumnsResults", function (sId, oContext) {
            //     var oColumn = oContext.getObject();
            //     if (smode === "display") {
            //         return new sap.ui.table.Column({
            //             label: oColumn.colProperty,
            //             template: new sap.m.Text({
            //                 text: "{" + oColumn.colProperty + "}",
            //                 wrapping: true
            //             })
            //         });
            //     } else {
            //         if (oColumn.colProperty !== "CustomerID") {

            //             return new sap.ui.table.Column({
            //                 label: oColumn.colProperty,
            //                 template: new sap.m.Input({
            //                     value: "{" + oColumn.colProperty + "}"
            //                 })
            //             });
            //         } else {
            //             return new sap.ui.table.Column({
            //                 label: oColumn.colProperty,
            //                 template: new sap.m.Text({
            //                     text: "{" + oColumn.colProperty + "}",
            //                     wrapping: true
            //                 })
            //             });
            //         }
            //     }
            // });
            /////////////////////////////////////////////////////////////////////////////////////////
        // },
        // _getTemplate: (sMode, oColumn ) => {
        //     if (sMode === "display" || (sMode === "Edit" && oColumn.colProperty == "CustomerID")) {
        //         return new sap.m.Text({
        //             text: "{" + oColumn.colProperty + "}",
        //             wrapping: true
        //         });
        //     } else if (sMode === "Edit" && oColumn.colProperty !== "CustomerID") {
        //         return new sap.m.Input({
        //             value: "{" + oColumn.colProperty + "}"
        //         });
        //     };
        // },
        onEditSavePress: function (oEvt) {
        if (oEvt.getSource().getText() === "Edit") {
            this.getView().getModel("ViewModel").setProperty("/mtablemode", "Edit");
            this._dynmicBindTable("Edit");
            this.getView().byId("AddRowBtn").setVisible(true);
        } else {
            this.getView().getModel("ViewModel").setProperty("/mtablemode", "display");
            this._dynmicBindTable("display");
            this.getView().byId("AddRowBtn").setVisible(false);

        };
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
        sap.m.URLHelper.redirect(sUrl, true);
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
        sap.m.URLHelper.redirect(sUrl, true);
    }
    });
});