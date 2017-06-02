import * as React from "react";
import * as ReactDOM from "react-dom";

import { Spinner, SpinnerType } from "office-ui-fabric-react/lib-amd/Spinner";

import { Header } from "../components/header";
import { TestResultsTable } from "../components/testresultstable";
import { Error } from "../components/error";

export class TestResults extends React.Component<null, null> {
    public render(): JSX.Element {
        return (
            <div>
                <Header title="Latest test results" />
                <p>These are the latest test results for this test case for each plan, suite &amp; configuration in which it is included.</p>
                <TestResultsTable />
                <Error text="Something wrong!" />
            </div>
        );
    }
}