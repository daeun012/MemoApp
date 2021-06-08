import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from 'Containers/App';
import Login from 'Containers/Login';
import Register from 'Containers/Register';

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
