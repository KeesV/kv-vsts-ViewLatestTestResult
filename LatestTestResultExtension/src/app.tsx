import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SDK from "azure-devops-extension-sdk";

import { TestResults } from "./containers/testResults";

import "./styles/main.scss";

function init(containerId: string) {
    ReactDOM.render((
        <TestResults />
    ), document.getElementById(containerId));
}

export function register() {
    init("latesttestresults");
    return {
        onFieldChanged: function(args) {
        },
        onLoaded: function(args) {
        },
        onUnloaded: function(args) {
        },
        onSaved: function(args) {
        },
        onReset: function(args) {
        },
        onRefreshed: function(args) {
        }
    };
}

