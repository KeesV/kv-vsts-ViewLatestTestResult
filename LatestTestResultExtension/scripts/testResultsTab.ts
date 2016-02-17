/// <reference path='ref/VSS.d.ts' />
/// <reference path='ref/q.d.ts' />

import WorkItemServices = require("TFS/WorkItemTracking/Services");
import TestManagementRestClient = require("TFS/TestManagement/RestClient");

interface testResultsRow {
    suite: string;
    configuration: string;
    outcome: string;
}

var testResults = [];

// Get the WorkItemFormService.  This service allows you to get/set fields/links on the 'active' work item (the work item
// that currently is displayed in the UI).
function getWorkItemFormService() {
    return WorkItemServices.WorkItemFormService.getService();
}

function addTestResultRow(resultRow: testResultsRow) {
    console.log("Added - Test suite: " + resultRow.suite + ", configuration: " + resultRow.configuration + ", result: " + resultRow.outcome);
    testResults.push(resultRow);
}

function printTestResults() {
    console.log("Test results are:");
    $.each(testResults, (index, testResult) => {
        console.log("Printing - Test suite: " + testResult.suite + ", configuration: " + testResult.configuration + ", result: " + testResult.outcome);
    });
}

var testResultsPage = function () {
    return {
        // Called when a new work item is being loaded in the UI
        onLoaded: function (args) {

            getWorkItemFormService().then(function (service) {            
                // Get the current values for a few of the common fields
                service.getFieldValues(["System.Id", "System.Title", "System.State", "System.CreatedDate"]).then(
                    function (value) {

                        var testCaseId = +value["System.Id"];
                        console.log("Work item id: " + testCaseId);

                        var suites = TestManagementRestClient.getClient().getSuitesByTestCaseId(testCaseId).then(
                            function (suites) {
                                var suitesReceived = 0;

                                $.each(suites, (index, suite) => {
                                    console.log("Suite: " + suite.name);
                                    console.log("Getting points for suite " + suite.id);

                                    var pointsForSuite = TestManagementRestClient.getClient().getPoints(
                                        suite.project.id,
                                        +suite.plan.id,
                                        suite.id,
                                        undefined,
                                        undefined,
                                        testCaseId.toString(),
                                        undefined,
                                        true,
                                        undefined,
                                        undefined
                                    ).then(
                                        function (points) {
                                            suitesReceived++;

                                            if (points.length > 0) {
                                                $.each(points, (index, point) => {
                                                    addTestResultRow({ suite: point.suite.name, configuration: point.configuration.name, outcome: point.outcome });
                                                });
                                                if (suitesReceived >= suites.length) {
                                                    //if we have all the data for all the suites, print it
                                                    printTestResults();
                                                }
                                            } else {
                                                console.log("No test points for this test case in this suite.");
                                            }
                                        }
                                    );
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
