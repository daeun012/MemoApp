import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { App, Login, Register, Wall } from 'Containers';

export default function MainRouter() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/wall/:username" component={Wall} />
        </Switch>
      </div>
    </Router>
  );
}
