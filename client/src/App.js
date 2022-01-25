import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Client from "./components/Client/Client";
import UpdateData from "./components/Banks/UpdateData";
import Bank from "./components/Banks/Bank";
import AdminPortal from "./components/Admin/AdminPortal";
import AddAuth from "./components/Admin/AddAuth";
import ProtectedRoute from "./components/utils/Protected";
import NewClient from "./components/Client/NewClient";
import UpdateRecord from "./components/Client/UpdateRecord";
import VideoPageClient from "./components/VideoCall/VideoPageClient";
import VideoPageAgent from "./components/VideoCall/VideoPageAgent";

import "antd/dist/antd.css";
import "font-awesome/css/font-awesome.min.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <ProtectedRoute exact path="/client" component={Client} />
        <ProtectedRoute exact path="/bank" component={Bank} />
        <ProtectedRoute exact path="/bank/update" component={UpdateData} />
        <Route exact path="/admin" component={AdminPortal} />
        <Route exact path="/admin/AddAuth" component={AddAuth} />
        <Route exact path="/client/UpdateRecord" component={UpdateRecord} />
        <Route exact path="/client/NewClient" component={NewClient} />
        <Route exact path="/client/video" component={VideoPageClient} />
        <Route exact path="/agent/video/:clientId" component={VideoPageAgent} />
      </Switch>
    </Router>
  );
}

export default App;
