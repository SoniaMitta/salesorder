sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'salesorder',
            componentId: 'A_SalesOrderItemObjectPage',
            contextPath: '/SalesOrder/to_Item'
        },
        CustomPageDefinitions
    );
});