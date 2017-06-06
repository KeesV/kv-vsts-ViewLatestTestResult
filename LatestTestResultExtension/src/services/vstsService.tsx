/// <reference types="vss-web-extension-sdk" />

import Q = require("q");

import { ITestResult } from "../models/itestresult";

export class VSTSService {
    getTestResultsForTestCase(testcaseId: number): IPromise<ITestResult[]> {
        let testresults =
            [
                {
                    planId: "1",
                    configuration: "DummyConfig",
                    outcome: "DummyFailed",
                    plan: "DummyPlan",
                    projectId: "1",
                    runId: "1",
                    suite: "DummySuite",
                    suiteId: "1"
                },
                {
                    planId: "1",
                    configuration: "DummyConfig",
                    outcome: "DummyFailed",
                    plan: "DummyPlan",
                    projectId: "1",
                    runId: "1",
                    suite: "DummySuite",
                    suiteId: "1"
                }
            ];
        let defer = Q.defer<ITestResult[]>();
        setTimeout(() => {
            defer.resolve(testresults);
        }, 1000);
        return defer.promise;
    }
}