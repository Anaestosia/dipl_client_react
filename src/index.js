import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import App from "App";
import "assets/css/material-dashboard-react.css?v=1.6.0";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:3000/api/v2/graphql/',
    cache: new InMemoryCache(),
});

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </Switch>
  </Router>,
  document.getElementById("root")
);
