import React from 'react';
import { Home, Login, Register } from './';
import { Header } from '../components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  let HideHeader = window.location.pathname === '/login' && '/register' ? null : <Header />;

  return (
    <Router>
      {HideHeader}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </Router>
  );
};

export default App;
