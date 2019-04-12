import * as React from "react";
import * as ReactDOM from "react-dom";

import { Header } from "../components/header";
import { TestResultsContent } from "../containers/testResultsContent";

export interface ITestResultsProps {
    testCaseId: number;
}

export class TestResults extends React.Component<ITestResultsProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                <TestResultsContent testCaseId={this.props.testCaseId} />
            </div>
        );
    }
}