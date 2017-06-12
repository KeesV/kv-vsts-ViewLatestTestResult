import * as React from "react";
import * as ReactDOM from "react-dom";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib-amd/Spinner";

import { TestResultsTable } from "../components/testresultstable";
import { Error } from "../components/error";

import { ITestResult } from "../models/itestresult";

import { VSTSService } from "../services/vstsService";

export interface ITestResultsContentState {
    testresults?: ITestResult[];
    errorText?: string;
    isLoading: boolean;
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
        let content: JSX.Element = null;

        if (this.state.isLoading) {
            content = <Spinner size={SpinnerSize.large} />;
        } else {
            if (this.state.errorText.length === 0) {
                content = <TestResultsTable testresults={this.state.testresults}/>;
            }
        }
        return (
            <div className="tfs-collapsible-content">
                <Error text={this.state.errorText} />             
                { content }
            </div>
        );
    }

    private _refreshData() {
        this.service.ActiveWorkItemIsTestCase().then(isTestCase => {
            if (isTestCase) {
                this.service.getTestResultsForActiveTestCase().then(testResults => {
                    this.setState({ testresults: testResults, errorText: "", isLoading: false });
                });
            } else {
                this.setState({ testresults: null, errorText: "This is not a test case, so we can't display recent test results.", isLoading: false });
            }
        });

        this.setState(this.state);
    }

    private _getInitialState(): ITestResultsContentState {
        return {
            testresults: [],
            errorText: "",
            isLoading: true
        };
    }
}