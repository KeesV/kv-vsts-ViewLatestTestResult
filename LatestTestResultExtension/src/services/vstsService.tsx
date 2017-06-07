/// <reference types="vss-web-extension-sdk" />

import Q = require("q");

import WorkItemServices = require("TFS/WorkItemTracking/Services");
import TestManagementRestClient = require("TFS/TestManagement/RestClient");

import { ITestResult } from "../models/itestresult";

export class VSTSService {
    private _workItemFormService: IPromise<WorkItemServices.IWorkItemFormService>;
    private _testManagementRestClient: TestManagementRestClient.TestHttpClient3_1;

    constructor() {
        this.initialize();
    }

    private initialize() {
        this._workItemFormService = WorkItemServices.WorkItemFormService.getService();
        this._testManagementRestClient = TestManagementRestClient.getClient();

    }

    public ActiveWorkItemIsTestCase(): IPromise<boolean> {
        let defer = Q.defer<boolean>();
        this._workItemFormService.then((svc) => {
            svc.getFieldValue("System.WorkItemType", false).then((wit) => {
                if (wit === "Test Case") {
                    console.log("Active item is a test case");
                    defer.resolve(true);
                } else {
                    console.log("Active item is not a test case");
                    defer.resolve(false);
                }
            });
        });
        return defer.promise;
    }

    public getTestResultsForActiveTestCase(): IPromise<ITestResult[]> {
        let defer = Q.defer<ITestResult[]>();
        this._workItemFormService.then((svc) => {
            svc.getId().then((id) => {
                this.getTestResultsForTestCase(id).then((results) => {
                    defer.resolve(results);
                });
            });
        });
        return defer.promise;
    }

    public getTestResultsForTestCase(testcaseId: number): IPromise<ITestResult[]> {
        console.log("Getting test results for test case id " + testcaseId);
        let defer = Q.defer<ITestResult[]>();

        let results: ITestResult[] = [];

        // Get the test suites for this test case id
        this._testManagementRestClient.getSuitesByTestCaseId(testcaseId).then(suites => {
            // Then get the associated test points
            suites.forEach(suite => {
                this._testManagementRestClient.getPoints(
                    suite.project.id,
                    +suite.plan.id,
                    suite.id,
                    undefined,
                    undefined,
                    testcaseId.toString(),
                    undefined,
                    true,
                    undefined,
                    undefined
                ).then(points => {
                    points.forEach(point => {
                        results.push(
                            {
                                projectId: suite.project.id,
                                plan: point.testPlan.name,
                                planId: point.testPlan.id,
                                suite: point.suite.name,
                                suiteId: point.suite.id,
                                runId: point.lastTestRun.id,
                                configuration: point.configuration.name,
                                outcome: point.outcome
                            }
                        );
                    });
                    defer.resolve(results);
                });
            });
        });

        // let testresults =
        //     [
        //         {
        //             planId: "1",
        //             configuration: "DummyConfig",
        //             outcome: "DummyFailed",
        //             plan: "DummyPlan",
        //             projectId: "1",
        //             runId: "1",
        //             suite: "DummySuite",
        //             suiteId: "1"
        //         },
        //         {
        //             planId: "1",
        //             configuration: "DummyConfig",
        //             outcome: "DummyFailed",
        //             plan: "DummyPlan",
        //             projectId: "1",
        //             runId: "1",
        //             suite: "DummySuite",
        //             suiteId: "1"
        //         }
        //     ];

        return defer.promise;
    }
}