import * as React from "react";

import { DetailsList, CheckboxVisibility, IColumn, DetailsListLayoutMode } from "office-ui-fabric-react/lib-amd/DetailsList";
import { ContextualMenu, IContextualMenuItem } from "office-ui-fabric-react/lib-amd/ContextualMenu";
import { Selection, SelectionMode } from "office-ui-fabric-react/lib-amd/utilities/selection";
import { Image, ImageFit } from "office-ui-fabric-react/lib-amd/Image";
import { autobind } from "office-ui-fabric-react/lib-amd/Utilities";

import { ITestResult } from "../models/itestresult";

export interface ITestResultsTableProps {
    testresults?: ITestResult[];
}

interface ITestResultsTableState {
    isContextMenuVisible?: boolean;
    contextMenuTarget?: MouseEvent;
}

export interface IContextMenuProps {
    menuItems?: IContextualMenuItem[];
}

enum TestResultsDetailsType {
    Plan,
    Suite,
    Run
}

export class TestResultsTable extends React.Component<ITestResultsTableProps, ITestResultsTableState> {
    private _selection: Selection;

    constructor(props?: ITestResultsTableProps, context?: any) {
        super(props, context);
        this.state = this._getInitialState();
        this._selection = new Selection();
    }

    private _renderItemColumn(item, index, column) {
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

                return formattedOutcome;

            default:
                return <span>{ fieldContent }</span>;
        }
    }

    private showDetails(detailsType: TestResultsDetailsType) {
        let selectedItem: ITestResult = this._selection.getSelection()[0] as ITestResult;

        switch (detailsType) {
            case TestResultsDetailsType.Plan:
                console.log(`Navigating to plan: ${selectedItem.plan}`);
            break;

            case TestResultsDetailsType.Suite:
                console.log(`Navigating to suite: ${selectedItem.suite}`);
            break;

            case TestResultsDetailsType.Run:
                console.log(`Navigating to run: ${selectedItem.runId}`);
            break;
        }
    }

    @autobind
    private _showContextMenu(item?: any, index?: number, e?: MouseEvent) {
        if (!this._selection.isIndexSelected(index)) {
            // if not already selected, unselect every other row and select this one
            this._selection.setAllSelected(false);
            this._selection.setIndexSelected(index, true, true);
        }
        this.setState({
            contextMenuTarget: e,
            isContextMenuVisible: true
        });
    }

    @autobind _hideContextMenu() {
        this.setState({
            contextMenuTarget: null,
            isContextMenuVisible: false
        });
    }

    private _buildContextMenuItems(): IContextualMenuItem[] {
        let contextMenuProps: IContextualMenuItem[] =
            [
                {
                    key: "gotoPlan",
                    name: "View Plan",
                    canCheck: false,
                    onClick: (() => { this.showDetails(TestResultsDetailsType.Plan); })
                },
                {
                    key: "gotoSuite",
                    name: "View Suite",
                    canCheck: false,
                    onClick: (() => { this.showDetails(TestResultsDetailsType.Suite); })
                },
                {
                    key: "gotoRun",
                    name: "View Run",
                    canCheck: false,
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
                key: "planColumn",
                name: "Plan",
                fieldName: "plan",
                minWidth: 100,
                maxWidth: null,
                isResizable: true
            },
            {
                key: "suiteColumn",
                name: "Suite",
                fieldName: "suite",
                minWidth: 100,
                maxWidth: null,
                isResizable: true
            },
            {
                key: "configurationColumn",
                name: "Configuration",
                fieldName: "configuration",
                minWidth: 100,
                maxWidth: null,
                isResizable: true
            },
            {
                key: "outcomeColumn",
                name: "Outcome",
                fieldName: "outcome",
                minWidth: 100,
                maxWidth: null,
                isResizable: true
            }
        ];

        return (
            <div>
                <DetailsList
                    items={this.props.testresults}
                    columns={_columns}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    layoutMode={DetailsListLayoutMode.fixedColumns}
                    onRenderItemColumn={ this._renderItemColumn }
                    onItemContextMenu={this._showContextMenu}
                    selection={this._selection} />
            </div>
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
                        items={this._buildContextMenuItems()}
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
            isContextMenuVisible: false
        };
    }
}