import * as React from "react";

export interface IErrorProps {
    text: string;
}

export class Error extends React.Component<IErrorProps, null> {
    constructor(props?: IErrorProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <p className="error">{this.props.text}</p>
        );
    }
}