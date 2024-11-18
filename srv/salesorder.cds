using { API_MATERIAL_STOCK_SRV as material } from './external/API_MATERIAL_STOCK_SRV';
using { API_SALES_ORDER_SRV as sales } from './external/API_SALES_ORDER_SRV';
using {API_MATERIAL_DOCUMENT_SRV_0001 as materialdoc} from './external/API_MATERIAL_DOCUMENT_SRV_0001';
service salesorder{
  entity Forms {
        key ID: UUID;
        FormName: String(80);
    }
entity A_SalesOrderItem as projection on sales.A_SalesOrderItem actions{
    action label() returns String;
};
  entity A_MatlStkInAcctMod as projection on material.A_MatlStkInAcctMod{
    key Material,
    key MatlWrhsStkQtyInMatlBaseUnit
  }

   entity SalesOrder as projection on sales.A_SalesOrder{
    key SalesOrder,
    PurchaseOrderByCustomer,
    SoldToParty,
        to_Item,
        key null as SalesOrderItem:String(100),
        key null as  Material:String(100)
   } actions{
    action stockInfo() returns String;
   }

   entity A_MaterialDocumentHeader as projection on materialdoc.A_MaterialDocumentHeader;
   action stockAvailable() returns String;
}

annotate salesorder.SalesOrder with @(
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
            Value: PurchaseOrderByCustomer
        },
        {
            $Type:'UI.DataField',
            Value: SoldToParty
        },

    ],
    UI.SelectionFields: [ SalesOrder,PurchaseOrderByCustomer,SoldToParty]
);

annotate salesorder.SalesOrder with @(
    UI.FieldGroup #salesorderInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
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
            Value: PurchaseOrderByCustomer
        },
        ],
    },
   UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'SalesorderInfoFacet',
            Label : 'Sales Order Information',
            Target : '@UI.FieldGroup#salesorderInformation',
        },
    ],    
);


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
            Value: Supplier
        },
        {
            $Type:'UI.DataField',
            Value: MatlWrhsStkQtyInMatlBaseUnit
        },
    ]
);
