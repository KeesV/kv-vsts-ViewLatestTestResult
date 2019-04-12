export interface ITestResult {
    projectId: string,
    plan: string;
    planId: number,
    suite: string;
    suiteId: number,
    runId: number,
    configuration: string;
    outcome: number;
    executionDate: Date | undefined;
}