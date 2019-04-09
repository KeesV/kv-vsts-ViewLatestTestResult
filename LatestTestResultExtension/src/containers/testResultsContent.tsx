import * as React from "react";
import * as ReactDOM from "react-dom";

import { Card } from "azure-devops-ui/Card";
import { Table, ISimpleTableCell, TableColumnLayout, renderSimpleCell } from "azure-devops-ui/Table";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib-amd/Spinner";

import { Error } from "../components/error";

import { ITestResult } from "../models/itestresult";

import { VSTSService } from "../services/vstsService";
import { ObservableValue, ObservableArray } from "azure-devops-ui/Core/Observable";

interface ITableItem extends ISimpleTableCell {
    projectId: string;
    plan: string;
    planId: string;
    suite: string;
    suiteId: string;
    runId: string;
    configuration: string;
    outcome: string;
    executionDate: string;
}

const dummyTableItem: ITableItem = {
    configuration: "Blep",
    executionDate: "Sometime",
    outcome: "Some outcome",
    plan: "Some plan",
    planId: "Some plan Id",
    projectId: "Some project Id",
    runId: "Some run Id",
    suite: "Some suite",
    suiteId: "Some suite Id"
};

const fixedColumns = [
    {
        columnLayout: TableColumnLayout.singleLinePrefix,
        id: "outcome",
        name: "Outcome",
        renderCell: renderSimpleCell,
        width: new ObservableValue(100)
    },
    {
        columnLayout: TableColumnLayout.singleLinePrefix,
        id: "plan",
        name: "Plan",
        renderCell: renderSimpleCell,
        width: new ObservableValue(150)
    },
    {
        columnLayout: TableColumnLayout.singleLinePrefix,
        id: "suite",
        name: "Suite",
        renderCell: renderSimpleCell,
        width: new ObservableValue(150)
    },
    {
        columnLayout: TableColumnLayout.singleLinePrefix,
        id: "configuration",
        name: "Configuration",
        renderCell: renderSimpleCell,
        width: new ObservableValue(150)
    },
    {
        columnLayout: TableColumnLayout.singleLinePrefix,
        id: "executionDate",
        name: "Execution Date",
        renderCell: renderSimpleCell,
        width: new ObservableValue(150)
    },
];

export interface ITestResultsContentState {
    errorText?: string;
    isLoading: boolean;
    itemProvider: ObservableArray<ITableItem>;
}

export class TestResultsContent extends React.Component<{}, ITestResultsContentState> {
    private service: VSTSService;

    constructor(props?) {
        super(props);
        this.service = new VSTSService();
        this.state = this._getInitialState();
    }

    async componentDidMount() {
        let isTestCase = await this.service.ActiveWorkItemIsTestCase();
        let items = new ObservableArray<ITableItem>();

        if (isTestCase) {
            let testResults = await this.service.getTestResultsForActiveTestCase();
            console.log(testResults);
            items.push(dummyTableItem);
            testResults.forEach(r => items.push(this.convertTestresultToTableItem(r)));
            this.setState({ errorText: "", isLoading: false, itemProvider: items });
        } else {
            this.setState({ errorText: "This is not a test case, so we can't display recent test results.", isLoading: false });
        }
    }

    public render(): JSX.Element {
        let content: JSX.Element = null;

        if (this.state.isLoading) {
            content = <Spinner size={SpinnerSize.large} />;
        } else {
            if (this.state.errorText.length === 0) {
                content = <Card
                className="flex-grow bolt-card-no-vertical-padding"
                contentProps={{ contentPadding: false }}
                >
                    <Table columns={fixedColumns} itemProvider={this.state.itemProvider} />
                </Card>;
            }
        }
        return (
            <div className="tfs-collapsible-content">
                <Error text={this.state.errorText} />
                { content }
            </div>
        );
    }

    private _getInitialState(): ITestResultsContentState {
        return {
            errorText: "",
            isLoading: true,
            itemProvider: null
        };
    }

    private convertTestresultToTableItem(testResult: ITestResult): ITableItem {
        console.log(testResult);
        return {
            projectId: testResult.planId,
            plan: testResult.plan,
            planId: testResult.planId,
            suite: testResult.suite,
            suiteId: testResult.suiteId,
            runId: testResult.runId,
            configuration: testResult.configuration,
            outcome: testResult.outcome,
            executionDate: testResult.executionDate ? testResult.executionDate.toLocaleString() : ""
        };
    }
}