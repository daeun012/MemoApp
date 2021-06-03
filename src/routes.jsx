import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from './containers/App';
import Login from './containers/Login';
import Register from './containers/Register';

export default function MainRouter() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </div>
    </Router>
  );
}
