sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'salesorder/test/integration/FirstJourney',
		'salesorder/test/integration/pages/SalesOrderList',
		'salesorder/test/integration/pages/SalesOrderObjectPage',
		'salesorder/test/integration/pages/A_SalesOrderItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, SalesOrderList, SalesOrderObjectPage, A_SalesOrderItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('salesorder') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheSalesOrderList: SalesOrderList,
					onTheSalesOrderObjectPage: SalesOrderObjectPage,
					onTheA_SalesOrderItemObjectPage: A_SalesOrderItemObjectPage
                }
            },
            opaJourney.run
        );
    }
);