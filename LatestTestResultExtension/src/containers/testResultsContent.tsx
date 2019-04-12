import * as React from "react";
import * as ReactDOM from "react-dom";

import { Card } from "azure-devops-ui/Card";
import { Table, ISimpleTableCell, renderSimpleCell, ITableColumn, ColumnSorting, SortOrder, sortItems, ColumnFill } from "azure-devops-ui/Table";

import CustomError from "../components/error";
import TestOutcomeIcon from "../components/testOutcomeIcon"

import { ITestResult } from "../models/itestresult";

import { VSTSService } from "../services/vstsService";
import { ObservableValue, ObservableArray } from "azure-devops-ui/Core/Observable";
import { Outcome } from "azure-devops-extension-api/TestPlan/TestPlan";

interface ITableItem extends ISimpleTableCell {
    projectId: string;
    plan: string;
    planId: string;
    suite: string;
    suiteId: string;
    runId: string;
    configuration: string;
    outcome: Outcome;
    executionDate: string;
}

const fixedColumns: ITableColumn<ITableItem>[] = [
    {
        id: "outcome",
        name: "Outcome",
        renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<ITableItem>, tableItem: ITableItem) => <td className="bolt-table-cell bolt-list-cell" key="tablerow_{rowIndex}"><TestOutcomeIcon outcome={tableItem.outcome} /></td>,
        width: new ObservableValue(150),
        sortProps: {
            ariaLabelAscending: "Sorted A to Z",
            ariaLabelDescending: "Sorted Z to A"
        },
    },
    {
        id: "plan",
        name: "Plan",
        renderCell: renderSimpleCell,
        width: new ObservableValue(200),
        sortProps: {
            ariaLabelAscending: "Sorted A to Z",
            ariaLabelDescending: "Sorted Z to A"
        },
    },
    {
        id: "suite",
        name: "Suite",
        renderCell: renderSimpleCell,
        width: new ObservableValue(200),
        sortProps: {
            ariaLabelAscending: "Sorted A to Z",
            ariaLabelDescending: "Sorted Z to A"
        },
    },
    {
        id: "configuration",
        name: "Configuration",
        renderCell: renderSimpleCell,
        width: new ObservableValue(200),
        sortProps: {
            ariaLabelAscending: "Sorted A to Z",
            ariaLabelDescending: "Sorted Z to A"
        },
    },
    {
        id: "executionDate",
        name: "Execution Date",
        renderCell: renderSimpleCell,
        width: new ObservableValue(250),
        sortProps: {
            ariaLabelAscending: "Sorted Oldest to Latest",
            ariaLabelDescending: "Sorted Latest to Oldest"
        },

    }
];

export interface ITestResultsContentProps {
    testCaseId: number;
}

export interface ITestResultsContentState {
    errorText?: string;
    isLoading: boolean;
    itemProvider: ObservableArray<ITableItem>;
}

export class TestResultsContent extends React.Component<ITestResultsContentProps, ITestResultsContentState> {
    private service: VSTSService;

    constructor(props: any) {
        super(props);
        this.service = new VSTSService();
        this.state = this._getInitialState();
    }

    // Create the sorting behavior (delegate that is called when a column is sorted).
    private sortingBehavior = new ColumnSorting<ITableItem>(
        (
            columnIndex: number,
            proposedSortOrder: SortOrder,
            event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
        ) => {
            this.state.itemProvider.splice(
                0,
                this.state.itemProvider.length,
                ...sortItems<ITableItem>(
                    columnIndex,
                    proposedSortOrder,
                    this.sortFunctions,
                    fixedColumns,
                    this.state.itemProvider.value
                )
            );
        }
    );

    private sortFunctions = [
        // Sort on Outcome column
        (item1: ITableItem, item2: ITableItem): number => {
            return item1.outcome - item2.outcome;
        },
        // Sort on Plan column
        (item1: ITableItem, item2: ITableItem): number => {
            return item1.plan!.localeCompare(item2.plan!);
        },
        // Sort on Suite column
        (item1: ITableItem, item2: ITableItem): number => {
            return item1.suite!.localeCompare(item2.suite!);
        },
        // Sort on Configuration column
        (item1: ITableItem, item2: ITableItem): number => {
            return item1.configuration!.localeCompare(item2.configuration!);
        },
        // Sort on Age column
        (item1: ITableItem, item2: ITableItem): number => {
            console.log("Sorting!");
            let date1 = item1.executionDate !== "" ? new Date(item1.executionDate) : new Date(1970, 1, 1, 0, 0, 0, 0);
            let date2 = item2.executionDate !== "" ? new Date(item2.executionDate) : new Date(1970, 1, 1, 0, 0, 0, 0);

            return this.compareDate(new Date(date1), new Date(date2));
        }
    ];

    /** 
     * Compares two Date objects and returns e number value that represents 
     * the result:
     * 0 if the two dates are equal.
     * 1 if the first date is greater than second.
     * -1 if the first date is less than second.
     * @param date1 First date object to compare.
     * @param date2 Second date object to compare.
     */
    private compareDate(date1: Date, date2: Date): number
    {
        // With Date object we can compare dates them using the >, <, <= or >=.
        // The ==, !=, ===, and !== operators require to use date.getTime(),
        // so we need to create a new instance of Date with 'new Date()'
        let d1 = new Date(date1); let d2 = new Date(date2);
        let retval: number = 0;

        // Check if the dates are equal
        let same = d1.getTime() === d2.getTime();
        if (same) retval = 0;

        // Check if the first is greater than second
        if (d1 > d2) retval = 1;
        
        // Check if the first is less than second
        if (d1 < d2) retval = -1;

        return retval;
    }

    async componentDidMount() {
        let isTestCase = await this.service.IsTestCase(this.props.testCaseId);

        if (isTestCase) {
            let testResults = await this.service.GetTestResultsForTestCase(this.props.testCaseId);
            console.log("Test results:");
            console.log(testResults);
            testResults.forEach(r => this.state.itemProvider.push(this.convertTestresultToTableItem(r)));
            this.setState({ errorText: "", isLoading: false });
        } else {
            this.setState({ errorText: "This is not a test case, so we can't display recent test results.", isLoading: false });
        }
    }

    public render(): JSX.Element {
        let content: JSX.Element;

        if (this.state.isLoading) {
            content = <p>Loading...</p>;
        } else {
            if (!this.state.errorText) {
                content = <Card
                    className="flex-grow bolt-card-no-vertical-padding"
                    contentProps={{ contentPadding: false }}
                >
                    <Table<ITableItem> behaviors={[this.sortingBehavior]} columns={fixedColumns} itemProvider={this.state.itemProvider} />
                </Card>;
            } else {
                content = <CustomError text={this.state.errorText } />;
            }
        }
        return (
            <div className="tfs-collapsible-content">
                { content }
            </div>
        );
    }

    private _getInitialState(): ITestResultsContentState {
        return {
            errorText: "",
            isLoading: true,
            itemProvider: new ObservableArray<ITableItem>()
        };
    }

    private convertTestresultToTableItem(testResult: ITestResult): ITableItem {
        console.log(testResult);
        return {
            projectId: testResult.planId.toString(),
            plan: testResult.plan,
            planId: testResult.planId.toString(),
            suite: testResult.suite,
            suiteId: testResult.suiteId.toString(),
            runId: testResult.runId ? testResult.runId.toString() : "",
            configuration: testResult.configuration,
            outcome: testResult.outcome,
            executionDate: testResult.executionDate ? testResult.executionDate.toLocaleString() : ""
        };
    }
}