using { API_MATERIAL_STOCK_SRV as material } from './external/API_MATERIAL_STOCK_SRV';
using { API_SALES_ORDER_SRV as sales } from './external/API_SALES_ORDER_SRV';
service salesorder{
  entity Forms {
        key ID: UUID;
        FormName: String(80);
    }
entity A_SalesOrderItem as projection on sales.A_SalesOrderItem actions{
    action label() returns String;
};
  entity A_MatlStkInAcctMod as projection on material.A_MatlStkInAcctMod;
}



annotate salesorder.Forms with @(UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Value: 'ID'
    },
    {
        $Type: 'UI.DataField',
        Value: 'FormName'
    }
]);
annotate salesorder.A_SalesOrderItem with @(
    UI.LineItem:[
        {
            $Type:'UI.DataField',
            Value: SalesOrder
        },
        {
            $Type:'UI.DataField',
            Value: SalesOrderItem
        },
        {
            $Type:'UI.DataField',
            Value: Material
        },
        {
            $Type:'UI.DataField',
            Value: Batch
        },
        

    ]
);

annotate salesorder.A_MatlStkInAcctMod with @(
    UI.LineItem:[
        {
            $Type:'UI.DataField',
            Value: Material
        },
        {
            $Type:'UI.DataField',
            Value: Plant
        },
        {
            $Type:'UI.DataField',
            Value: StorageLocation
        },
        {
            $Type:'UI.DataField',
            Value: Batch
        },
        {
            $Type:'UI.DataField',
            Value: MaterialBaseUnit
        },
        {
            $Type:'UI.DataField',
            Value: MatlWrhsStkQtyInMatlBaseUnit
        },
    ]
);
