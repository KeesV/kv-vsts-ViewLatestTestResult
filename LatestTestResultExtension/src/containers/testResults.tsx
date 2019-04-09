import * as React from "react";
import * as ReactDOM from "react-dom";

import { Spinner, SpinnerType } from "office-ui-fabric-react/lib-amd/Spinner";

import { Header } from "../components/header";
import { TestResultsContent } from "../containers/testResultsContent";

export class TestResults extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <div>
                <TestResultsContent />
            </div>
        );
    }
}