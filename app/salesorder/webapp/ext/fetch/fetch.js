sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/ColumnListItem",
    "sap/m/CheckBox"
], function (MessageToast, JSONModel, Dialog, Button, Table, Column, Text, Label, ColumnListItem, CheckBox) {
    'use strict';

    return {
        fetch: async function(oBindingContext, aSelectedContexts) {
            console.log(aSelectedContexts);

            let mParameters = {
                contexts: aSelectedContexts[0],
                label: 'Confirm',
                invocationGrouping: true    
            };

            this.editFlow.invokeAction('salesorder.label', mParameters)
                .then(function(result) {
                    console.log("res", result.getObject().value);
                    let stockInfo = result.getObject() ? result.getObject().value : [];

                    if (!Array.isArray(stockInfo)) {
                        stockInfo = [];
                    }

                    let oModel = new JSONModel();
                    oModel.setData({ stockInfo: stockInfo });

                    // Create the Table control
                    let oTable = new Table({
                        columns: [
                            new Column({
                                header: new Label({ text: "Select" }),
                                template: new CheckBox({
                                    selected: "{selected}" // Bind to a selected property for checkbox
                                })
                            }),
                            new Column({
                                header: new Label({ text: "Material" }),
                                template: new Text({ text: "{Material}" })
                            }),
                            new Column({
                                header: new Label({ text: "Plant" }),
                                template: new Text({ text: "{Plant}" })
                            }),
                            new Column({
                                header: new Label({ text: "Storage Location" }),
                                template: new Text({ text: "{StorageLocation}" })
                            }),
                            new Column({
                                header: new Label({ text: "Stock Quantity" }),
                                template: new Text({ text: "{MatlWrhsStkQtyInMatlBaseUnit}" })
                            })
                        ]
                    });

                    oTable.setModel(oModel);
                    oTable.bindItems("/stockInfo", new ColumnListItem({
                        cells: [
                            new CheckBox({
                                selected: "{selected}"
                            }),
                            new Text({ text: "{Material}" }),
                            new Text({ text: "{Plant}" }),
                            new Text({ text: "{StorageLocation}" }),
                            new Text({ text: "{MatlWrhsStkQtyInMatlBaseUnit}" })
                        ]
                    }));

                    // Create the Dialog
                    let oDialog = new Dialog({
                        title: 'Material Stock',
                        contentWidth: "600px",
                        contentHeight: "400px",
                        verticalScrolling: true,
                        content: oTable,
                        buttons: [
                            new Button({
                                text: 'Proceed',
                                press: function () {
                                    let aSelectedItems = [];
                                    let aItems = oTable.getItems();

                                    // Collect the selected items
                                    aItems.forEach(function(oItem) {
                                        let oCheckBox = oItem.getCells()[0]; // The checkbox is the first cell
                                        if (oCheckBox.getSelected()) {
                                            let oContext = oItem.getBindingContext();
                                            aSelectedItems.push(oContext.getObject()); // Collect the selected row data
                                        }
                                    });

                                    if (aSelectedItems.length > 0) {
                                        // Proceed to next screen with selected data
                                        console.log("Selected items:", aSelectedItems);
                                        // Here, you can navigate to the next screen or perform any other action.
                                    } else {
                                        MessageToast.show("Please select at least one item.");
                                    }

                                    oDialog.close();
                                }
                            }),
                            new Button({
                                text: 'Close',
                                press: function () {
                                    oDialog.close();
                                }
                            })
                        ],
                        afterClose: function() {
                            oDialog.destroy();
                        }
                    });

                    oDialog.open();
                })
                .catch(function(error) {
                    MessageToast.show('Error occurred while fetching data');
                    console.error("Error:", error);
                });
        }
    };
});
