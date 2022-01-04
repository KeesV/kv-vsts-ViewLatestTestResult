import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, getClient, IProjectPageService, IHostNavigationService, ILocationService } from "azure-devops-extension-api";

import { ITestResult } from "../models/itestresult";
import { TestPlanRestClient } from "azure-devops-extension-api/TestPlan/TestPlanClient";
import { TestRestClient } from 'azure-devops-extension-api/Test'
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
    private _testRestClient: TestRestClient;

    constructor() {
        this._workItemTrackingRestClient = getClient(WorkItemTrackingRestClient);
        this._testPlanRestClient = getClient(TestPlanRestClient);
        this._testRestClient = getClient(TestRestClient);
    }

    public async IsTestCase(workItemId: number): Promise<boolean> {    
        let wi = await this._workItemTrackingRestClient.getWorkItem(workItemId);
        return wi.fields["System.WorkItemType"] === "Test Case";
    }

    public async GetTestResultsForTestCase(testCaseId: number): Promise<ITestResult[]> {
        let results: ITestResult[] = [];

        // Get the test suites for this test case id
        let suites = await this._testPlanRestClient.getSuitesByTestCaseId(testCaseId);

        for (const suite of suites) {
            // TODO: respect continuationtoken
            let points = await this._testPlanRestClient.getPointsList(
                suite.project.id,
                suite.plan.id,
                suite.id,
                undefined,
                testCaseId.toString(),
                undefined);

            for (const point of points)
            {
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
                        executionDate: point.results.lastResultDetails ? point.results.lastResultDetails.dateCompleted : undefined                        
                    }
                );
            }
        }

        return results;
    }

    public async navigateToTestRun(projectId: string, runId: number): Promise<void> {
        let run = await this._testRestClient.getTestRunById(projectId, runId);
        
        let navService = await SDK.getService<IHostNavigationService>("ms.vss-features.host-navigation-service");
        navService.navigate(run.webAccessUrl);
    }

    public async navigateToTestSuite(testPlanId: number, testSuiteId: number): Promise<void> {
        let locationservice = await SDK.getService<ILocationService>("ms.vss-features.location-service");
        const serviceLocation = await locationservice.getServiceLocation();
       
        let projectService = await SDK.getService<IProjectPageService>("ms.vss-tfs-web.tfs-page-data-service");
        const project = await projectService.getProject();

        let navService = await SDK.getService<IHostNavigationService>("ms.vss-features.host-navigation-service");

        let url = `${serviceLocation}${project!.name}/_testManagement?planId=${testPlanId}&suiteId=${testSuiteId}`

        navService.navigate(url);
    }

    public async navigateToTestPlan(testPlanId: number): Promise<void> {
        let locationservice = await SDK.getService<ILocationService>("ms.vss-features.location-service");
        const serviceLocation = await locationservice.getServiceLocation();
       
        let projectService = await SDK.getService<IProjectPageService>("ms.vss-tfs-web.tfs-page-data-service");
        const project = await projectService.getProject();

        let navService = await SDK.getService<IHostNavigationService>("ms.vss-features.host-navigation-service");

        let url = `${serviceLocation}${project!.name}/_testManagement?planId=${testPlanId}`

        navService.navigate(url);
    }
}