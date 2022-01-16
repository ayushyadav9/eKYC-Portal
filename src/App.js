import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import { theme } from "rimble-ui";
import { ThemeProvider } from "styled-components";
import Client from "./components/Client/Client";
import UpdateData from "./components/Client/UpdateData";
import Bank from "./components/Banks/Bank";

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
          <Route exact path="/client" component={Client}/>
          <Route exact path="/client/update" component={UpdateData}/>
          <Route exact path="/bank" component={Bank}/>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;

