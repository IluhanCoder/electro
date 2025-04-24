import { Route } from "react-router-dom";
import HomePage from "./home-page";
import RegistrationPage from "./auth/registration-page";
import LoginPage from "./auth/login-page";
import DataPage from "./data/data-page";
import ObjectsPage from "./object/objects-page";
import CreateObjectPage from "./object/create-object-page";
import CreateDataPage from "./data/create-data-page";
import GenerationPage from "./data/generation-page";
import AnalyticsPage from "./analytics/analytics-page";
import AverageGraph from "./analytics/average-graph";
import AmountCatGraph from "./analytics/amount-cat-graph";
import RealTime from "./analytics/real-time";
import HeatmapPage from "./analytics/heatmap-page";
import NotificationsPage from "./notifications/notificatoins-page";
import RegressionPage from "./analytics/regression-page";
import TipsPage from "./analytics/tips-page";
import ProfilePage from "./user/profile-page";
import ConfirmEmail from "./misc/confirm-email-page";
import CountersPage from "./data/counters-page";

const routes: React.ReactElement[] = [
    <Route path="/" element={<LoginPage/>}/>,
    <Route path="/registration" element={<RegistrationPage/>}/>,
    <Route path="/login" element={<LoginPage/>}/>,
    <Route path="/data" element={<DataPage/>}/>,
    <Route path="/data/:defaultObjectId" element={<DataPage/>}/>,
    <Route path="/objects" element={<ObjectsPage/>}/>,
    <Route path="/create-object" element={<CreateObjectPage/>}/>,
    <Route path="/create-data" element={<CreateDataPage/>}/>,
    <Route path="/generation" element={<GenerationPage/>}/>,
    <Route path="/analytics" element={<AnalyticsPage/>}/>,
    <Route path="/categorised-amount-analytics" element={<AmountCatGraph/>}/>,
    <Route path="/average-analytics" element={<AverageGraph/>}/>,
    <Route path="/realtime" element={<RealTime/>}/>,
    <Route path="/heatmap" element={<HeatmapPage/>}/>,
    <Route path="/notifications" element={<NotificationsPage/>}/>,
    <Route path="/regression" element={<RegressionPage/>}/>,
    <Route path="/tips" element={<TipsPage/>}/>,
    <Route path="/profile" element={<ProfilePage/>}/>,
    <Route path="/confirm-email/:userId" element={<ConfirmEmail/>} />,
    <Route path="/counter" element={<CountersPage/>}/>
]

export default routes;