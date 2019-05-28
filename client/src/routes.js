import axios from "axios";
import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home/index";
import Layout from "./hoc/layout";

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />>
      </Switch>
    </Layout>
  );
};

export default Routes;
