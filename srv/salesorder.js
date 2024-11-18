const cds = require('@sap/cds');
const axios = require('axios');
const { json2xml } = require('xml-js');

module.exports = cds.service.impl(async function () {
    const {A_SalesOrderItem,A_MatlStkInAcctMod, Forms } = this.entities;
    const salesorderapi = await cds.connect.to('API_SALES_ORDER_SRV');
    const materialstockapi = await cds.connect.to('API_MATERIAL_STOCK_SRV');

    this.on('READ', 'SalesOrder', async req => {
        req.query.SELECT.columns = [
            { ref: ['SalesOrder'] },
            { ref: ['PurchaseOrderByCustomer'] },
            { ref:['SoldToParty']},
            { ref: ['to_Item'], expand: ['*'] }
        ];

        try {
            // Fetching sales orders
            let res = await salesorderapi.run(req.query);

            // Check if res is an array, if not, wrap it in an array
            if (!Array.isArray(res)) {
                res = [res];
            }

            // Process each sales order item
            res.forEach(element => {
                if (element.to_Item) {
                    const item = element.to_Item.find(item => item.SalesOrder === element.SalesOrder);
                    if (item) {
                        element.SalesOrderItem = item.SalesOrderItem;
                        element.Material = item.Material;
                    }
                }
            });

            return res;
        } catch (error) {
            console.error('Error reading SalesOrder:', error);
            return req.error(500, 'Failed to fetch data from SalesOrder service');
        }
    });

    this.on('READ', A_SalesOrderItem , async (req) => {
        try {
            req.query.SELECT.columns = [{ ref: ['SalesOrder'] }, { ref: ['SalesOrderItem'] }, { ref: ['Material'] }, { ref: ['Batch'] }];
            const result = await salesorderapi.run(req.query);
            console.log('SalesOrderItem Data:', result);
            return result;
        } catch (error) {
            console.error('Error fetching data from external service:', error);
            return req.error(500, 'Failed to fetch data from external service');
        }
    });

    this.on('READ', A_MatlStkInAcctMod , async (req) => {
        try {
            req.query.SELECT.columns = [{ ref: ['Material'] }, { ref: ['Plant'] }, { ref: ['StorageLocation'] }, { ref: ['MatlWrhsStkQtyInMatlBaseUnit'] }];
            const result = await materialstockapi.run(req.query);
            console.log('Material stock Data:', result);
            return result;
        } catch (error) {
            console.error('Error fetching data from external service:', error);
            return req.error(500, 'Failed to fetch data from external service');
        }
    });


   

    this.on('label', async (req) => {
        const salesorderapi = await cds.connect.to('API_SALES_ORDER_SRV');
        const materialstockapi = await cds.connect.to('API_MATERIAL_STOCK_SRV');
        console.log(req.params);
        const { SalesOrder, SalesOrderItem} = req.params[0];


        try {

            const salesorder = await salesorderapi.run(
                SELECT.from('A_SalesOrderItem').where({ SalesOrder,SalesOrderItem }).columns( 'Material', 'Batch',)
            );

            console.log("sales order material :",salesorder);
            const {Material} = salesorder[0]

            const MaterialStockInfo = await materialstockapi.run(
                SELECT.from('A_MatlStkInAcctMod').where({ Material }).columns( 'Material','Plant','StorageLocation','MatlWrhsStkQtyInMatlBaseUnit')
            );

            console.log(MaterialStockInfo);
            return MaterialStockInfo;

        } catch (err) {
            console.error('Error during label generation:', err);
            return req.error(500, 'Error retrieving Purchase Orders and related data');
        }

    });

    this.on('stockInfo', 'SalesOrder', async (req) => {
        console.log(req.params);
        const salesOrderId = req.params[0].SalesOrder;
        const salesOrderResult = await salesorderapi.run(
            SELECT.from('A_SalesOrderItem').columns(['SalesOrder', 'Material']).where({ SalesOrder: salesOrderId })
        );
        console.log('Sales Order Result:', salesOrderResult);
    
        if (!salesOrderResult || salesOrderResult.length === 0) {
            return [];
        }
        const materials = [...new Set(salesOrderResult.map(item => item.Material))];
        let materialDetails = [];
        if (materials.length > 0) {
            materialDetails = await materialstockapi.run(
                SELECT.from('A_MatlStkInAcctMod')
                    .columns(['Material', 'Plant', 'Batch', 'StorageLocation','MatlWrhsStkQtyInMatlBaseUnit','SDDocument','SDDocumentItem','MaterialBaseUnit'])
                    .where({ Material: { in: materials } })
            );
        }
        console.log('Material Details:', materialDetails);
        return materialDetails;
    });

    this.on('stockAvailable', async (req) => {
        console.log(req.params);
        console.log(req);
        /*const salesOrderId = req.params[0].SalesOrder;
        const salesOrderResult = await salesorderapi.run(
            SELECT.from('A_SalesOrderItem').columns(['SalesOrder', 'Material']).where({ SalesOrder: salesOrderId })
        );
        console.log('Sales Order Result:', salesOrderResult);
    
        if (!salesOrderResult || salesOrderResult.length === 0) {
            return [];
        }
        const materials = [...new Set(salesOrderResult.map(item => item.Material))];
        let materialDetails = [];
        if (materials.length > 0) {
            materialDetails = await materialstockapi.run(
                SELECT.from('A_MatlStkInAcctMod')
                    .columns(['Material', 'Plant', 'Batch', 'StorageLocation','MatlWrhsStkQtyInMatlBaseUnit'])
                    .where({ Material: { in: materials } })
            );
        }
        console.log('Material Details:', materialDetails);
        return materialDetails;*/
    });
    



});