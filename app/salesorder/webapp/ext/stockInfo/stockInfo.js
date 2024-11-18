/*sap.ui.define([
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
], (MessageToast, JSONModel, Dialog, Button, Table, Column, Text, Label, ColumnListItem, CheckBox) => {
    'use strict';

    return {
        stockInfo: async function(oBindingContext, aSelectedContexts) {
            console.log(aSelectedContexts);
            console.log("this context:", this);

            let mParameters = {
                contexts: aSelectedContexts[0],
                label: 'Confirm',
                invocationGrouping: true    
            };

            this.editFlow.invokeAction('salesorder.stockInfo', mParameters)
                .then((result) => {
                    console.log("this context:", this);
                    console.log("res", result.getObject().value);
                    let stockInfo = result.getObject() ? result.getObject().value : [];

                    if (!Array.isArray(stockInfo)) {
                        stockInfo = [];
                    }

                    let oModel = new JSONModel();
                    oModel.setData({ stockInfo: stockInfo });

                    // Create the Table control
                     let oTable = new Table({
                        width: "100%",
                        mode: sap.m.ListMode.SingleSelectLeft,
                        growing: true,
                        selectionChange: function(oEvent) {
                            var oSelectedItem = oEvent.getParameter("listItem");
                            var oShowMaterialButton = oDialog.getButtons()[1]; 
                            if (oSelectedItem) {
                                oShowMaterialButton.setEnabled(true);
                            } else {
                                oShowMaterialButton.setEnabled(false);
                            }
                        },
                        columns: [
                            new Column({
                                header: new Text({ text: "Material" })
                            }),
                            new Column({
                                header: new Text({ text: "Plant" })
                            }),
                            new Column({
                                header: new Text({ text: "Storage Location" })
                            }),
                            new Column({
                                header: new Text({ text: "Batch" })
                            }),
                            new Column({
                                header: new Text({ text: "Quantity" })
                            }),
                            new Column({
                                header: new Text({ text: "MaterialBaseUnit" })
                            }),
                            new Column({
                                header: new Text({ text: "SDDocument" })
                            }),
                            new Column({
                                header: new Text({ text: "SDDocumentItem" })
                            })
                        ],
                        items: materialDetailsArray.map(function(detail) {
                            return new ColumnListItem({
                                cells: [
                                    new Text({ text: detail.Material }),
                                    new Text({ text: detail.Plant }),
                                    new Text({ text: detail.StorageLocation }),
                                    new Text({ text: detail.Batch }),
                                    new Text({ text: detail.MatlWrhsStkQtyInMatlBaseUnit }),
                                    new Text({ text: detail.MaterialBaseUnit }),
                                    new Text({ text: detail.SDDocument }),
                                    new Text({ text: detail.SDDocumentItem })
                                ]
                            });
                        })
                    });

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
                                press: () => {
                                    let aSelectedItems = [];
                                    let aSelectedContextsUpdated = [];  // To store the updated contexts
                                
                                    let aItems = oTable.getItems();
                                
                                    // Collect the selected items and their contexts
                                    aItems.forEach((oItem) => {
                                        let oCheckBox = oItem.getCells()[0];
                                        if (oCheckBox.getSelected()) {
                                            let oContext = oItem.getBindingContext();
                                            aSelectedItems.push(oContext.getObject());
                                            aSelectedContextsUpdated.push(oContext);  // Add the context of the selected item
                                        }
                                    });
                                    console.log(aSelectedContexts);
                                    console.log(aSelectedContextsUpdated);
                                
                                    if (aSelectedItems.length > 0) {
                                        let oSelectedItemsModel = new JSONModel();
                                        oSelectedItemsModel.setData({ selectedItems: aSelectedItems });
                                        
                                        // Prepare the updated parameters to send with the action
                                        let mParameters2 = {
                                            contexts: aSelectedContextsUpdated,  // Send the updated contexts
                                            data: aSelectedItems,  // The selected items
                                            label: 'Confirm',
                                            invocationGrouping: true    
                                        };
                                
                                        this.editFlow.invokeAction('salesorder.stockAvailable', mParameters2)
                                            .then((result) => {
                                                console.log("Connected and data sent");
                                                console.log("Result", result);
                                            })
                                            .catch((error) => {
                                                MessageToast.show('Error occurred while fetching data');
                                                console.error("Error:", error);
                                            });
                                
                                        // Open the dialog to show the selected items
                                        let oSelectedItemsDialog = new Dialog({
                                            title: 'Selected Items',
                                            contentWidth: "500px",
                                            contentHeight: "300px",
                                            verticalScrolling: true,
                                            content: new Table({
                                                columns: [
                                                    new Column({ header: new Label({ text: "Material" }) }),
                                                    new Column({ header: new Label({ text: "Plant" }) }),
                                                    new Column({ header: new Label({ text: "Storage Location" }) }),
                                                    new Column({ header: new Label({ text: "Batch" }) }),
                                                    new Column({ header: new Label({ text: "Stock Quantity" }) })
                                                ]
                                            }).setModel(oSelectedItemsModel).bindItems("/selectedItems", new ColumnListItem({
                                                cells: [
                                                    new Text({ text: "{Material}" }),
                                                    new Text({ text: "{Plant}" }),
                                                    new Text({ text: "{StorageLocation}" }),
                                                    new Text({ text: "{Batch}" }),
                                                    new Text({ text: "{MatlWrhsStkQtyInMatlBaseUnit}" })
                                                ]
                                            })),
                                            buttons: [
                                                new Button({
                                                    text: 'Close',
                                                    press: () => {
                                                        oSelectedItemsDialog.close();
                                                    }
                                                })
                                            ],
                                            afterClose: () => {
                                                oSelectedItemsDialog.destroy();
                                            }
                                        });
                                
                                        oSelectedItemsDialog.open();
                                    } else {
                                        MessageToast.show("Please select at least one item.");
                                    }
                                
                                    oDialog.close();
                                }
                                
                            }),
                            new Button({
                                text: 'Close',
                                press: () => {
                                    oDialog.close();
                                }
                            })
                        ],
                        afterClose: () => {
                            oDialog.destroy();
                        }
                    });

                    oDialog.open();
                })
                .catch((error) => {
                    MessageToast.show('Error occurred while fetching data');
                    console.error("Error:", error);
                });
        }
    };
});
*/

sap.ui.define([
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/MessageToast"
], function(Dialog, Button, Table, Column, ColumnListItem, Text, MessageToast) {
    'use strict';

    return {
        stockInfo: function(oBindingContext, aSelectedContexts) {
            console.log(aSelectedContexts);
            let mParameters = {
                contexts: aSelectedContexts[0],
                label: 'Confirm',
                invocationGrouping: true    
            };
            this.editFlow.invokeAction('salesorder.stockInfo', mParameters)
                .then(result => {
                    console.log(this);
                    const materialDetailsArray = result.getObject().value;
                    console.log('Material Details:', materialDetailsArray);

                    let oTable = new Table({
                        width: "100%",
                        mode: sap.m.ListMode.SingleSelectLeft,
                        growing: true,
                        selectionChange: oEvent => {
                            var oSelectedItem = oEvent.getParameter("listItem");
                            var oShowMaterialButton = oDialog.getButtons()[1]; 
                            if (oSelectedItem) {
                                oShowMaterialButton.setEnabled(true);
                            } else {
                                oShowMaterialButton.setEnabled(false);
                            }
                        },
                        columns: [
                            new Column({
                                header: new Text({ text: "Material" })
                            }),
                            new Column({
                                header: new Text({ text: "Plant" })
                            }),
                            new Column({
                                header: new Text({ text: "Storage Location" })
                            }),
                            new Column({
                                header: new Text({ text: "Batch" })
                            }),
                            new Column({
                                header: new Text({ text: "Quantity" })
                            }),
                            new Column({
                                header: new Text({ text: "MaterialBaseUnit" })
                            }),
                            new Column({
                                header: new Text({ text: "SDDocument" })
                            }),
                            new Column({
                                header: new Text({ text: "SDDocumentItem" })
                            })
                        ],
                        items: materialDetailsArray.map(detail => {
                            return new ColumnListItem({
                                cells: [
                                    new Text({ text: detail.Material }),
                                    new Text({ text: detail.Plant }),
                                    new Text({ text: detail.StorageLocation }),
                                    new Text({ text: detail.Batch }),
                                    new Text({ text: detail.MatlWrhsStkQtyInMatlBaseUnit }),
                                    new Text({ text: detail.MaterialBaseUnit }),
                                    new Text({ text: detail.SDDocument }),
                                    new Text({ text: detail.SDDocumentItem })
                                ]
                            });
                        })
                    });

                    let oDialog = new Dialog({
                        title: 'Material Details',
                        contentWidth: "600px",
                        contentHeight: "500px",
                        verticalScrolling: true,
                        content: [oTable],
                        buttons: [
                            new Button({
                                text: 'Close',
                                press: () => {
                                    oDialog.close();
                                }
                            }),
                            new Button({
                                text: 'Show Material Number',
                                enabled: false,
                                press: () => {
                                    var oSelectedItem = oTable.getSelectedItem();
                                    if (oSelectedItem) {
                                        var sMaterialNumber = oSelectedItem.getCells()[0].getText();
                                        MessageToast.show("Selected Material Number: " + sMaterialNumber);

                                        let mParameters2 = {
                                            contexts: [oSelectedItem.getBindingContext()],  // Pass the context of the selected item
                                            data: { materialNumber: sMaterialNumber },  // Send the material number as part of the data
                                            label: 'Material Info',
                                            invocationGrouping: true
                                        };
                                        console.log(this);

                                        $.ajax({
                                            url: 'odata/v4/salesorder/stockAvailable',
                                            type: 'POST',
                                            contentType: 'application/json',
                                            
                                            success: function () {
                                                console.log("success");
                                            },
                                            error: function () {
                                                console.log("Error connecting stock available");
                                            }
                                        });
                                    } else {
                                        MessageToast.show("No material selected!");
                                    }
                                }
                            })
                        ],
                        afterClose: () => {
                            oDialog.destroy();
                        }
                    });

                    oDialog.open();
                });
        }
    };
});
