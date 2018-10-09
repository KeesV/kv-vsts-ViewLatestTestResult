/// <reference types="vss-web-extension-sdk" />

import Q = require("q");

import WorkItemServices = require("TFS/WorkItemTracking/Services");
import TestManagementRestClient = require("TFS/TestManagement/RestClient");
import HostNavigationService = require("VSS/SDK/Services/Navigation");

import { ITestResult } from "../models/itestresult";

export class VSTSService {
    private _workItemFormService: IPromise<WorkItemServices.IWorkItemFormService>;
    private _testManagementRestClient: TestManagementRestClient.TestHttpClient4_1;
    private _hostNavigationService: IPromise<HostNavigationService.HostNavigationService>;

    private _webContext: WebContext;

    constructor() {
        this.initialize();
    }

    private initialize() {
        this._workItemFormService = WorkItemServices.WorkItemFormService.getService();
        this._testManagementRestClient = TestManagementRestClient.getClient();
        this._hostNavigationService = VSS.getService(VSS.ServiceIds.Navigation);

        this._webContext = VSS.getWebContext();
    }

    public ActiveWorkItemIsTestCase(): Q.Promise<boolean> {
        let defer = Q.defer<boolean>();
        this._workItemFormService.then((svc) => {
            svc.getFieldValue("System.WorkItemType", false).then((wit) => {
                if (wit === "Test Case") {
                    defer.resolve(true);
                } else {
                    defer.resolve(false);
                }
            });
        });
        return defer.promise;
    }

    public getTestResultsForActiveTestCase(): Q.Promise<ITestResult[]> {
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

    public getTestResultsForTestCase(testcaseId: number): Q.Promise<ITestResult[]> {
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
                        if (point.lastTestRun.id !== "0") {
                            this._testManagementRestClient.getTestResultById(suite.project.id, +point.lastTestRun.id, +point.lastResult.id).then(result => {
                                results.push(
                                    {
                                        projectId: suite.project.id,
                                        plan: point.testPlan.name,
                                        planId: point.testPlan.id,
                                        suite: point.suite.name,
                                        suiteId: point.suite.id,
                                        runId: point.lastTestRun.id,
                                        configuration: point.configuration.name,
                                        outcome: point.outcome,
                                        executionDate: result.startedDate
                                    }
                                );
                            });
                        } else {
                            results.push(
                                {
                                    projectId: suite.project.id,
                                    plan: point.testPlan.name,
                                    planId: point.testPlan.id,
                                    suite: point.suite.name,
                                    suiteId: point.suite.id,
                                    runId: null,
                                    configuration: point.configuration.name,
                                    outcome: point.outcome,
                                    executionDate: null
                                }
                            );
                        }
                    });
                    defer.resolve(results);
                });
            });
        });

        return defer.promise;
    }

    public navigateToTestRun(testResult: ITestResult) {

        this._testManagementRestClient.getTestRunById(testResult.projectId, Number(testResult.runId)).then((run) => {
            this._hostNavigationService.then(s => s.navigate(run.webAccessUrl));
        });
    }

    public navigateToTestSuite(testResult: ITestResult) {

        let url: string = `${this._webContext.collection.uri}${this._webContext.project.name}/_testManagement?planId=${testResult.planId}&suiteId=${testResult.suiteId}`;
        this._hostNavigationService.then(s => s.navigate(url));
    }

    public navigateToTestPlan(testResult: ITestResult) {

        let url: string = `${this._webContext.collection.uri}${this._webContext.project.name}/_testManagement?planId=${testResult.planId}`;
        this._hostNavigationService.then(s => s.navigate(url));
    }
}