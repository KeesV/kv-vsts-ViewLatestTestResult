import * as React from "react";

export interface IErrorProps {
    text: string;
}

export class Error extends React.Component<IErrorProps, null> {
    constructor(props?: IErrorProps) {
        super(props);
    }

    public render(): JSX.Element {
        let showErrorText: boolean = this.props.text.length > 0;

        if (showErrorText) {
            return ( <p className="testresults-error">{this.props.text}</p> );
        } else {
            return null;
        }
    }
}