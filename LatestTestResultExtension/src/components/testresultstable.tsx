import * as React from "react";

export interface ITestResultsTableProps {
}

export class TestResultsTable extends React.Component<ITestResultsTableProps, null> {
    constructor(props?: ITestResultsTableProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div>
                This will show the test results.
            </div>
        );
    }
}