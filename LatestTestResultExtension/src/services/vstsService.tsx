import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, getClient } from "azure-devops-extension-api";

import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";

import { ITestResult } from "../models/itestresult";
import { TestRestClient, TestResultsQuery } from "azure-devops-extension-api/Test";

const dummTestResult: ITestResult = {
    configuration: "Some configuration",
    executionDate:  new Date(),
    outcome: "Some outcome",
    plan: "Some plan",
    planId: "Some plan Id",
    projectId: "Some project Id",
    runId: "Some run Id",
    suite: "Some suite",
    suiteId: "Some suite Id"
};

export class VSTSService {
    private _workItemFormService: IWorkItemFormService;
    private _testManagementRestClient: TestRestClient;

    constructor() {
        this.initialize();
    }

    private async initialize() {
        this._workItemFormService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
        this._testManagementRestClient = await getClient(TestRestClient);
    }

    public async ActiveWorkItemIsTestCase(): Promise<boolean> {
        let svc = await this._workItemFormService;
        let wit = await svc.getFieldValue("System.WorkItemType", false);

        return wit === "Test Case";
    }

    public async getTestResultsForActiveTestCase(): Promise<ITestResult[]> {
        let id = await this._workItemFormService.getId();
        console.log(id);
        let results = await this.getTestResultsForTestCase(id);
        console.log(results);
        return results;
    }

    public async getTestResultsForTestCase(testcaseId: number): Promise<ITestResult[]> {
        let results: ITestResult[] = [];

        results.push(dummTestResult);

        // Get the test suites for this test case id
        // let suites = await this._testManagementRestClient.getSuitesByTestCaseId(testcaseId);
        // console.log(suites);

        // suites.forEach(async suite => {
        //     let points = await this._testManagementRestClient.getPoints(
        //         suite.project.id,
        //         +suite.plan.id,
        //         suite.id,
        //         undefined,
        //         undefined,
        //         testcaseId.toString(),
        //         undefined,
        //         true,
        //         undefined,
        //         undefined);

        //     points.forEach(async point => {
        //         if (point.lastTestRun.id !== "0") {
        //             let result = await this._testManagementRestClient.getTestResultById(suite.project.id, +point.lastTestRun.id, +point.lastResult.id);
        //             results.push(
        //                 {
        //                     projectId: suite.project.id,
        //                     plan: point.testPlan.name,
        //                     planId: point.testPlan.id,
        //                     suite: point.suite.name,
        //                     suiteId: point.suite.id,
        //                     runId: point.lastTestRun.id,
        //                     configuration: point.configuration.name,
        //                     outcome: point.outcome,
        //                     executionDate: result.startedDate
        //                 }
        //             );
        //         } else {
        //             results.push(
        //                 {
        //                     projectId: suite.project.id,
        //                     plan: point.testPlan.name,
        //                     planId: point.testPlan.id,
        //                     suite: point.suite.name,
        //                     suiteId: point.suite.id,
        //                     runId: null,
        //                     configuration: point.configuration.name,
        //                     outcome: point.outcome,
        //                     executionDate: null
        //                 }
        //             );
        //         }
        //     });
        // });

        return results;
    }

    // public navigateToTestRun(testResult: ITestResult) {

    //     this._testManagementRestClient.getTestRunById(testResult.projectId, Number(testResult.runId)).then((run) => {
    //         this._hostNavigationService.then(s => s.navigate(run.webAccessUrl));
    //     });
    // }

    // public navigateToTestSuite(testResult: ITestResult) {

    //     let url: string = `${this._webContext.collection.uri}${this._webContext.project.name}/_testManagement?planId=${testResult.planId}&suiteId=${testResult.suiteId}`;
    //     this._hostNavigationService.then(s => s.navigate(url));
    // }

    // public navigateToTestPlan(testResult: ITestResult) {

    //     let url: string = `${this._webContext.collection.uri}${this._webContext.project.name}/_testManagement?planId=${testResult.planId}`;
    //     this._hostNavigationService.then(s => s.navigate(url));
    // }
}