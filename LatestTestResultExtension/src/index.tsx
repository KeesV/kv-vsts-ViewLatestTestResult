import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SDK from "azure-devops-extension-sdk";

import { TestResults } from "./containers/testResults";

import "./styles/main.scss";
import { WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";

function init(containerId: string, workItemId: number) {
    console.log("Will render test results for test case: " + workItemId);
    ReactDOM.render((
        <TestResults testCaseId={workItemId} />
    ), document.getElementById(containerId));
}

function register() {
    return {
        onFieldChanged: function(args: any) {
            console.log("onFieldChanged");
        },
        onLoaded: function(args: any) {
            console.log("onLoaded");
            init("latesttestresults", args.id);
        },
        onUnloaded: function(args: any) {
            console.log("onUnloaded");
        },
        onSaved: function(args: any) {
            console.log("onSaved");
        },
        onReset: function(args: any) {
            console.log("onReset");
        },
        onRefreshed: function(args: any) {
            console.log("onRefreshed");
        }
    };
}

SDK.init();

SDK.ready().then(() => {
    SDK.register(SDK.getContributionId(), register);
    SDK.notifyLoadSucceeded();
})
