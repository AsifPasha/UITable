sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/Column",
], (Controller,JSONModel,Column) => {
    "use strict";
var oController = this;
    return Controller.extend("com.sap.uitable.controller.BaseController", {
        _LoadEmployeeData: function(oEvent) {
           var oModel = this.getOwnerComponent().getModel();
           var oEmpModel = new JSONModel({
            mtablemode: "display",
            ColumnsResults: [],
            EmployeeResults: []
           }) ;
           this.getView().setModel(oEmpModel,"EmployeeModel");

           oModel.read("/Employees", {
            urlParameters:{
                "$select": "FirstName,LastName"
            },
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
                    this.getView().getModel("EmployeeModel").setProperty("/ColumnsResults", aColumnData);
                    oEmpModel.setProperty("/EmployeeResults", oData.results);
                    // this._dynmicBindTable("display");
                    this._dynmicBindTable("display","idUiTableEmployee","EmployeeModel","EmployeeResults","ColumnsResults");
                }
            },
            error: (oError) => {
                console.error("Failed to fetch customers:", oError);
            }
        });
         
        },
        _dynmicBindTable: function (smode,id,oModel,rowBind,colBind) {
            // debugger;
            var oTable = this.getView().byId(id);
            oTable.setModel(this.getView().getModel(oModel));
            oTable.bindRows("/" +rowBind);

            oTable.bindColumns("/"+colBind, function (sId, oContext) {
                var oColumn = oContext.getObject();
                var oTemplate = this._getTemplate(smode, oColumn);
                // Create a new column for the table with the specified properties
                return new Column({
                    label: oColumn.colProperty,
                    template: oTemplate
                });
            }.bind(this));
        },
        _getTemplate: (sMode, oColumn ) => {
            if (sMode === "display" || (sMode === "Edit" && oColumn.colProperty == "CustomerID")) {
                return new sap.m.Text({
                    text: "{" + oColumn.colProperty + "}",
                    wrapping: true
                });
            } else if (sMode === "Edit" && oColumn.colProperty !== "CustomerID") {
                return new sap.m.Input({
                    value: "{" + oColumn.colProperty + "}"
                });
            };
        },
    });
});