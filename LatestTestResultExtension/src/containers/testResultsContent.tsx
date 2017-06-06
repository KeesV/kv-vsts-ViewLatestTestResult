import * as React from "react";
import * as ReactDOM from "react-dom";

import { TestResultsTable, IContextMenuProps } from "../components/testresultstable";
import { Error } from "../components/error";

import { ITestResult } from "../models/itestresult";

import { VSTSService } from "../services/vstsService";

export interface ITestResultsContentState {
    testresults?: ITestResult[];
    errorText?: string;
}

export class TestResultsContent extends React.Component<null, ITestResultsContentState> {
    private service: VSTSService;

    constructor(props?) {
        super(props);
        this.service = new VSTSService();
        this.state = this._getInitialState();
    }

    componentDidMount() {
        this._refreshData();
    }

    public render(): JSX.Element {
        return (
            <div className="tfs-collapsible-content">
                <Error text={this.state.errorText} />               
                {/*<p>These are the latest test results for this test case for each plan, suite &amp; configuration in which it is included.</p>*/}
                <TestResultsTable testresults={this.state.testresults}/>
            </div>
        );
    }

    private _refreshData() {
        this.service.getTestResultsForTestCase(1).then(testResults => {
            this.state.testresults = testResults;
            this.state.errorText = "";
            this.setState(this.state);
        });
        this.setState(this.state);
    }

    private _getInitialState(): ITestResultsContentState {
        return {
            testresults: [],
            errorText: "Hello!"
        };
    }
}