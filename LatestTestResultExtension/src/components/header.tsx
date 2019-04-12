import * as React from "react";

export interface IHeaderProps {
    title: string;
}

export class Header extends React.Component<IHeaderProps, null> {
    constructor(props: IHeaderProps) {
        super(props);
    }

    public render(): JSX.Element {
        let rightHeader: JSX.Element;
        return (
            <div className="tfs-collapsible-header wit-form-group-header disabled">
                <span className="tfs-collapsible-text" role="button">
                    <p role="heading">
                        {this.props.title}
                    </p>
                </span>
            </div>
        );
    }
}