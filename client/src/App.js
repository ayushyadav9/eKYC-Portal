import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import { theme } from "rimble-ui";
import { ThemeProvider } from "styled-components";
import Client from "./components/Client/Client";
import UpdateData from "./components/Banks/UpdateData";
import Bank from "./components/Banks/Bank";
import AdminPortal from "./components/Admin/AdminPortal";
import AddBank from "./components/Admin/AddBank";
import AddAuth from "./components/Admin/AddAuth";
import ProtectedRoute from "./components/utils/Protected";
import NewClient from "./components/Client/NewClient";
import UpdateRecord from "./components/Client/UpdateRecord";

const customTheme = {
  ...theme
};

customTheme.colors.primary = "#0358d9ff";

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <ProtectedRoute exact path="/client" component={Client}/>
          <ProtectedRoute exact path="/bank" component={Bank}/>
          <ProtectedRoute exact path="/bank/update" component={UpdateData}/>
          <Route exact path="/admin" component={AdminPortal}/>
          <Route exact path="/admin/AddBank" component={AddBank}/>
          <Route exact path="/admin/AddAuth" component={AddAuth}/>
          <Route exact path="/client/NewClient" component={NewClient}/> 
          <Route exact path="/client/UpdateRecord" component={UpdateRecord}/>          
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;

