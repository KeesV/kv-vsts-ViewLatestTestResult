/// <reference path='ref/VSS.d.ts' />
/// <reference path='ref/q.d.ts' />

import WorkItemServices = require("TFS/WorkItemTracking/Services");
import TestManagementRestClient = require("TFS/TestManagement/RestClient");


// Get the WorkItemFormService.  This service allows you to get/set fields/links on the 'active' work item (the work item
// that currently is displayed in the UI).
function getWorkItemFormService() {
    return WorkItemServices.WorkItemFormService.getService();
}

var testClient = TestManagementRestClient.getClient();

var testResultsPage = function () {
    return {
        // Called when a new work item is being loaded in the UI
        onLoaded: function (args) {

            getWorkItemFormService().then(function (service) {            
                // Get the current values for a few of the common fields
                service.getFieldValues(["System.Id", "System.Title", "System.State", "System.CreatedDate"]).then(
                    function (value) {
                        $(".events").append($("<div/>").text("onLoaded - " + JSON.stringify(value)));

                        var id = +value["System.Id"];
                        console.log("Work item id: " + id);

                        var suites = TestManagementRestClient.getClient().getSuitesByTestCaseId(id).then(
                            function (suites) {
                                $.each(suites, (index, suite) => {
                                    console.log("Suite: " + suite.name);
                                });
                            }
                        );

                    },
                    function (error) {
                        window.alert(error.message);
                    });
            });
        }
    }
}

VSS.register("test-results-page", testResultsPage);

VSS.notifyLoadSucceeded();
