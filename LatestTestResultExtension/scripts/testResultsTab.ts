/// <reference path='ref/VSS.d.ts' />
/// <reference path='ref/q.d.ts' />

import WorkItemServices = require("TFS/WorkItemTracking/Services");
import TestManagementRestClient = require("TFS/TestManagement/RestClient");

import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");
import Menus = require("VSS/Controls/Menus");

interface testResultsRow {
    plan: string;
    planId: string,
    suite: string;
    suiteId: string,
    runId: string,
    configuration: string;
    outcome: string;
}

var testResults: testResultsRow[] = [];
var grid: Grids.Grid;

// Get the WorkItemFormService.  This service allows you to get/set fields/links on the 'active' work item (the work item
// that currently is displayed in the UI).
function getWorkItemFormService() {
    return WorkItemServices.WorkItemFormService.getService();
}

function getContextMenuItems(): Menus.IMenuItemSpec[] {
    return [
        {
            id: "viewTestPlan",
            text: "View Test Plan",
        },
        {
            id: "viewTestSuite",
            text: "View Test Suite",
        },
        { separator: true },
        {
            id: "viewTestRun",
            text: "View Test Run"
        }
    ];
}

function menuItemClick(args) {
    console.log("Clicked!");
    
    // Get the item associated with the context menu
    var clickedRow: testResultsRow = testResults[grid.getContextMenuRowInfo().dataIndex];


    switch (args._commandName) {
        case 'viewTestPlan':
            console.log("View test plan");
            break;

        case 'viewTestSuite':
            console.log("View test suite");
            break;

        case 'viewTestRun':
            console.log("View test run");
            break;
    }
}

function addTestResultRow(resultRow: testResultsRow) {
    console.log("Added - Plan: "+ resultRow.plan + ", suite: " + resultRow.suite + ", configuration: " + resultRow.configuration + ", result: " + resultRow.outcome);
    testResults.push(resultRow);
    testResults.sort();
}

function printTestResults() {
    console.log("Test results are:");
    $.each(testResults, (index, testResult) => {
        console.log("Printing - Plan: "+ testResult.plan +", suite: " + testResult.suite + ", configuration: " + testResult.configuration + ", result: " + testResult.outcome);
    });

    var container = $("#test-result-container");

    var gridOptions: Grids.IGridOptions = {
        height: "500px",
        width: "100%",
        source: testResults,
        columns: [
            { text: "Plan", index: "plan", width: 200 },
            { text: "Suite", index: "suite", width: 200 },
            { text: "Configuration", index: "configuration", width: 200 },
            { text: "Outcome", index: "outcome", width: 200 }
        ],
        gutter: {
            contextMenu: true
        },
        contextMenu: {
            items: getContextMenuItems(),
            executeAction: menuItemClick,
            
            //arguments: (contextInfo) => {
            //    return { item: contextInfo.item };
            //}
        }
    };

    grid = Controls.create(Grids.Grid, container, gridOptions);

    console.log("Finished!");

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
                                                    addTestResultRow({
                                                        plan: point.testPlan.name,
                                                        planId: point.testPlan.id,
                                                        suite: point.suite.name,
                                                        suiteId: point.suite.id,
                                                        runId: point.lastTestRun.id,
                                                        configuration: point.configuration.name,
                                                        outcome: point.outcome
                                                    });
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
