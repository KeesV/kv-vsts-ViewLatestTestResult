import * as React from "react";

import { DetailsList, CheckboxVisibility, IColumn, DetailsListLayoutMode } from "office-ui-fabric-react/lib-amd/DetailsList";
import { ContextualMenu, IContextualMenuItem, IContextualMenuProps } from "office-ui-fabric-react/lib-amd/ContextualMenu";
import { DefaultButton, IButtonProps } from "office-ui-fabric-react/lib-amd/Button";
import { Selection, SelectionMode } from "office-ui-fabric-react/lib-amd/utilities/selection";
import { Image, ImageFit } from "office-ui-fabric-react/lib-amd/Image";
import { autobind } from "office-ui-fabric-react/lib-amd/Utilities";

import { ITestResult } from "../models/itestresult";
import { VSTSService } from "../services/vstsService";

export interface ITestResultsTableProps {
    testresults?: ITestResult[];
}

interface ITestResultsTableState {
    isContextMenuVisible?: boolean;
    contextMenuItems: IContextualMenuItem[];
    contextMenuTarget?: MouseEvent;
    selection?: Selection;
}

enum TestResultsDetailsType {
    Plan,
    Suite,
    Run
}

export class TestResultsTable extends React.Component<ITestResultsTableProps, ITestResultsTableState> {
    private service: VSTSService;

    constructor(props?: ITestResultsTableProps, context?: any) {
        super(props, context);
        this.state = this._getInitialState();

        this.service = new VSTSService();
    }

    private _renderItemColumn(item, index, column): JSX.Element {
        let fieldContent = item[column.fieldName];

        switch (column.key) {
            case "outcomeColumn":
                let formattedOutcome: JSX.Element;

                switch (fieldContent) {
                    case "Unspecified":
                        formattedOutcome = <span><div style={{display: "inline-block"}}><Image imageFit={ImageFit.none} src="./icons/active.png"/></div><div style={{display: "inline-block", margin: "0px 0px 0px 4px"}}>Active</div></span>;
                    break;

                    case "Blocked":
                        formattedOutcome = <span><div style={{display: "inline-block"}}><Image imageFit={ImageFit.none} src="./icons/blocked.png"/></div><div style={{display: "inline-block", margin: "0px 0px 0px 4px"}}>Blocked</div></span>;
                    break;

                    case "Failed":
                        formattedOutcome = <span><div style={{display: "inline-block"}}><Image imageFit={ImageFit.none} src="./icons/failed.png"/></div><div style={{display: "inline-block", margin: "0px 0px 0px 4px"}}>Failed</div></span>;
                    break;

                    case "None":
                        formattedOutcome = <span><div style={{display: "inline-block"}}><Image imageFit={ImageFit.none} src="./icons/inprogress.png"/></div><div style={{display: "inline-block", margin: "0px 0px 0px 4px"}}>In progress</div></span>;
                    break;

                    case "NotApplicable":
                        formattedOutcome = <span><div style={{display: "inline-block"}}><Image imageFit={ImageFit.none} src="./icons/notapplicable.png"/></div><div style={{display: "inline-block", margin: "0px 0px 0px 4px"}}>Not applicable</div></span>;
                    break;

                    case "Passed":
                        formattedOutcome = <span><div style={{display: "inline-block"}}><Image imageFit={ImageFit.none} src="./icons/passed.png"/></div><div style={{display: "inline-block", margin: "0px 0px 0px 4px"}}>Passed</div></span>;
                    break;

                    case "Paused":
                        formattedOutcome = <span><div style={{display: "inline-block"}}><Image imageFit={ImageFit.none} src="./icons/paused.png"/></div><div style={{display: "inline-block", margin: "0px 0px 0px 4px"}}>Paused</div></span>;
                    break;

                    default:
                        formattedOutcome = <span>{ fieldContent }</span>;
                    break;
                }

                return ( formattedOutcome );

            case "executionDateColumn":
                let formattedExecutionDate: JSX.Element;

                if ( fieldContent != null ) {
                    let executionDate: Date;
                    executionDate = fieldContent;
                    formattedExecutionDate = <span>{ executionDate.toLocaleString() }</span>;
                } else {
                    formattedExecutionDate = <span><i>Never executed</i></span>;
                }

                return formattedExecutionDate;

            default:
                return <span>{ fieldContent }</span>;
        }
    }

    @autobind
    private showDetails(detailsType: TestResultsDetailsType) {
        let selectedItem: ITestResult = this.state.selection.getSelection()[0] as ITestResult;

        switch (detailsType) {
            case TestResultsDetailsType.Plan:
                this.service.navigateToTestPlan(selectedItem);
            break;

            case TestResultsDetailsType.Suite:
                this.service.navigateToTestSuite(selectedItem);
            break;

            case TestResultsDetailsType.Run:
                this.service.navigateToTestRun(selectedItem);
            break;
        }
    }

    @autobind
    private _showContextMenu(item?: ITestResult, index?: number, e?: Event) {
        let newState: ITestResultsTableState = this.state;

        if (!this.state.selection.isIndexSelected(index)) {
            // if not already selected, unselect every other row and select this one
            let newSelection: Selection = this.state.selection;
            newSelection.setAllSelected(false);
            newSelection.setIndexSelected(index, true, true);

            newState.selection = newSelection;
        }
        newState.isContextMenuVisible = true;
        newState.contextMenuTarget = e as MouseEvent;
        newState.contextMenuItems = this._buildContextMenuItemsForTestResult(item);
        this.setState(newState);
    }

    @autobind
    private _hideContextMenu() {
        let newState: ITestResultsTableState = this.state;
        newState.contextMenuTarget = null;
        newState.isContextMenuVisible = false;

        this.setState(newState);
    }

    private _buildContextMenuItemsForTestResult(testresult: ITestResult): IContextualMenuItem[] {
        let planId: number = +testresult.planId;
        let suiteId: number = +testresult.suiteId;
        let runId: number = +testresult.runId;

        let contextMenuProps: IContextualMenuItem[] =
            [
                {
                    key: "gotoPlan",
                    name: "View Plan",
                    canCheck: false,
                    disabled: planId === 0 ? true : false,
                    onClick: (() => { this.showDetails(TestResultsDetailsType.Plan); })
                },
                {
                    key: "gotoSuite",
                    name: "View Suite",
                    canCheck: false,
                    disabled: suiteId === 0 ? true : false,
                    onClick: (() => { this.showDetails(TestResultsDetailsType.Suite); })
                },
                {
                    key: "gotoRun",
                    name: "View Run",
                    canCheck: false,
                    disabled: runId === 0 ? true : false,
                    onClick: (() => { this.showDetails(TestResultsDetailsType.Run); })
                }
            ];
        return contextMenuProps;
    }

    private _renderCommandBar(): JSX.Element {
        return null;
    }

    private _renderGrid(): JSX.Element {
        let _columns: IColumn[] = [
            {
                key: "outcomeColumn",
                name: "Outcome",
                fieldName: "outcome",
                minWidth: 100,
                maxWidth: null,
                isResizable: true
            },
            {
                key: "planColumn",
                name: "Plan",
                fieldName: "plan",
                minWidth: 150,
                maxWidth: null,
                isResizable: true
            },
            {
                key: "suiteColumn",
                name: "Suite",
                fieldName: "suite",
                minWidth: 150,
                maxWidth: null,
                isResizable: true
            },
            {
                key: "configurationColumn",
                name: "Configuration",
                fieldName: "configuration",
                minWidth: 150,
                maxWidth: null,
                isResizable: true
            },
            {
                key: "executionDateColumn",
                name: "Execution Date",
                fieldName: "executionDate",
                minWidth: 150,
                maxWidth: null,
                isResizable: true
            }
        ];

        return (
            <DetailsList
                items={this.props.testresults}
                columns={_columns}
                checkboxVisibility={CheckboxVisibility.hidden}
                layoutMode={DetailsListLayoutMode.fixedColumns}
                onRenderItemColumn={ (item, index, column) => this._renderItemColumn(item, index, column) }
                onItemContextMenu={ (item, index, e) => this._showContextMenu(item, index, e)}
                selection={this.state.selection} />
        );
    }

    public render(): JSX.Element {
        return (
            <div>
                {this._renderCommandBar()}
                {this._renderGrid()}
                {this.state.isContextMenuVisible ? (
                    <ContextualMenu
                        className="context-menu"
                        items={this.state.contextMenuItems}
                        target={this.state.contextMenuTarget}
                        shouldFocusOnMount={true}
                        onDismiss={this._hideContextMenu} />
                ) : null }
            </div>
        );
    }

    private _getInitialState(): ITestResultsTableState {
        return {
            contextMenuTarget: null,
            contextMenuItems: null,
            isContextMenuVisible: false,
            selection: new Selection()
        };
    }
}