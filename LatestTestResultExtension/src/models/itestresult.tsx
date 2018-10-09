export interface ITestResult {
    projectId: string,
    plan: string;
    planId: string,
    suite: string;
    suiteId: string,
    runId: string,
    configuration: string;
    outcome: string;
    executionDate: Date;
}