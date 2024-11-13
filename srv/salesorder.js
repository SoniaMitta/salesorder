const cds = require('@sap/cds');
const axios = require('axios');
const { json2xml } = require('xml-js');

module.exports = cds.service.impl(async function () {
    const {A_SalesOrderItem,A_MatlStkInAcctMod, Forms } = this.entities;

    this.on('READ', A_SalesOrderItem , async (req) => {
        try {
            const salesorderapi = await cds.connect.to('API_SALES_ORDER_SRV');
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
            const materialstockapi = await cds.connect.to('API_MATERIAL_STOCK_SRV');
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
});