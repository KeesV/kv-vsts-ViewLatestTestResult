import * as React from "react";

export interface IHeaderProps {
    title: string;
}

export class Header extends React.Component<IHeaderProps, null> {
    constructor(props?: IHeaderProps) {
        super(props);
    }

    public render(): JSX.Element {
        let rightHeader: JSX.Element = null;
        return (
            <div className="hub-title">
                <div className="title-left">
                    {this.props.title}
                </div>
            </div>
        );
    }
}