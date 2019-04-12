import * as React from 'react'
import { Outcome } from 'azure-devops-extension-api/TestPlan/TestPlan';
import { Icon } from 'azure-devops-ui/Icon';
import { Image } from 'azure-devops-ui/Image';

interface ITestOutcomeIcon {
    outcome: Outcome
}

export default class extends React.Component<ITestOutcomeIcon, {}> {
    constructor(props: ITestOutcomeIcon) {
        super(props);
    }

    private GetOutcomeAsString() : string {
        let retval: string;

        switch(this.props.outcome)
        {
            case Outcome.Aborted:
                retval = "Aborted";
            break;

            case Outcome.Blocked:
                retval = "Blocked";
            break;

            case Outcome.Error:
                retval = "Error";
            break;

            case Outcome.Failed:
                retval = "Failed";
            break;

            case Outcome.InProgress:
                retval = "In Progress";
            break;

            case Outcome.Inconclusive:
                retval = "Inconclusive";
            break;

            case Outcome.None:
                retval = "None";
            break;

            case Outcome.NotApplicable:
                retval = "Not Applicable";
            break;

            case Outcome.NotExecuted:
                retval = "Not Executed";
            break;

            case Outcome.NotImpacted:
                retval = "Not Impacted";
            break;

            case Outcome.Passed:
                retval = "Passed";
            break;

            case Outcome.Timeout:
                retval = "Timed out";
            break;

            case Outcome.Unspecified:
                retval = "Unspecified";
            break;

            case Outcome.Warning:
                retval = "Warning";
            break;

            default:
                retval = "";
            break;
        }
        return retval;
    }

    private GetOutcomeIcon(className?: string): JSX.Element {
        let retval: JSX.Element = <Image src={require("../icons/blocked.png")}/>;

        switch(this.props.outcome)
        {
            case Outcome.Aborted:
                retval = <Image src={require("../icons/blocked.png")}/>
            break;

            case Outcome.Blocked:
                retval = <Image src={require("../icons/blocked.png")}/>
            break;

            case Outcome.Error:
                retval = <Image src={require("../icons/failed.png")}/>
            break;

            case Outcome.Failed:
                retval = <Image src={require("../icons/failed.png")}/>
            break;

            case Outcome.InProgress:
                retval = <Image src={require("../icons/inprogress.png")}/>
            break;

            case Outcome.Inconclusive:
                retval = <Image src={require("../icons/active.png")}/>
            break;

            case Outcome.None:
                retval = <Image src={require("../icons/active.png")} />
            break;

            case Outcome.NotApplicable:
                retval = <Image src={require("../icons/notapplicable.png")}/>
            break;

            case Outcome.NotExecuted:
                retval = <Image src={require("../icons/active.png")}/>
            break;

            case Outcome.NotImpacted:
                retval = <Image src={require("../icons/active.png")}/>
            break;

            case Outcome.Passed:
                retval = <Image src={require("../icons/passed.png")}/>
            break;

            case Outcome.Paused:
                retval = <Image src={require("../icons/paused.png")}/>
            break;

            case Outcome.Timeout:
                retval = <Image src={require("../icons/failed.png")}/>
            break;

            case Outcome.Unspecified:
                retval = <Image src={require("../icons/active.png")}/>
            break;

            case Outcome.Warning:
                retval = <Image src={require("../icons/blocked.png")}/>
            break;

            default:
                retval = <Image src={require("../icons/active.png")}/>
            break;
        }

        return retval;
    }

    public render() {
        return (  <p>{this.GetOutcomeIcon()} {this.GetOutcomeAsString()}</p> )
    }
}