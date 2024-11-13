sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'salesorder/test/integration/FirstJourney',
		'salesorder/test/integration/pages/A_SalesOrderItemList',
		'salesorder/test/integration/pages/A_SalesOrderItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, A_SalesOrderItemList, A_SalesOrderItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('salesorder') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheA_SalesOrderItemList: A_SalesOrderItemList,
					onTheA_SalesOrderItemObjectPage: A_SalesOrderItemObjectPage
                }
            },
            opaJourney.run
        );
    }
);