import { observer } from "mobx-react";
import authStore from "../auth/auth-store";
import AmountGraph from "./amount-graph";

function AnalyticsPage() {
    return <div>
        <AmountGraph/>
    </div>
}

export default observer(AnalyticsPage);