import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";

import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";

import { ITestResult } from "../models/itestresult";
import { TestPlanRestClient } from "azure-devops-extension-api/TestPlan/TestPlanClient";
import { WorkItemTrackingRestClient } from "azure-devops-extension-api/WorkItemTracking"
import { TestSuite } from "azure-devops-extension-api/Test/Test";

const dummTestResult: ITestResult = {
    configuration: "Some configuration",
    executionDate:  new Date(),
    outcome: 1,
    plan: "Some plan",
    planId: 1,
    projectId: "Some project Id",
    runId: 1,
    suite: "Some suite",
    suiteId: 1
};

export class VSTSService {
    private _workItemTrackingRestClient: WorkItemTrackingRestClient;
    private _testPlanRestClient: TestPlanRestClient;

    constructor() {
        this._workItemTrackingRestClient = getClient(WorkItemTrackingRestClient);
        this._testPlanRestClient = getClient(TestPlanRestClient);
    }

    public async IsTestCase(workItemId: number): Promise<boolean> {    
        let wi = await this._workItemTrackingRestClient.getWorkItem(workItemId);
        return wi.fields["System.WorkItemType"] === "Test Case";
    }

    public async GetTestResultsForTestCase(testCaseId: number): Promise<ITestResult[]> {
        let results: ITestResult[] = [];

        //results.push(dummTestResult);

        // Get the test suites for this test case id
        let suites = await this._testPlanRestClient.getSuitesByTestCaseId(testCaseId);
        console.log("Suites:")
        console.log(suites);

        for (const suite of suites) {
            // TODO: respect continuationtoken
            let points = await this._testPlanRestClient.getPointsList(
                suite.project.id,
                suite.plan.id,
                suite.id,
                undefined,
                testCaseId.toString(),
                undefined);

            console.log("Points:")
            console.log(points);

            for (const point of points)
            {
                //let result = await this._testPlanRestClient.gettes.getTestResultById(suite.project.id, +point.lastTestRun.id, +point.lastResult.id);
                results.push(
                    {
                        projectId: suite.project.id,
                        plan: point.testPlan.name,
                        planId: point.testPlan.id,
                        suite: point.testSuite.name,
                        suiteId: point.testSuite.id,
                        runId: point.results.lastTestRunId,
                        configuration: point.configuration.name,
                        outcome: point.results.outcome,
                        executionDate: point.results.lastResultDetails ? point.results.lastResultDetails.dateCompleted : undefined,
                        
                    }
                );
            }
        }

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