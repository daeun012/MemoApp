import React from 'react';
import { Home } from 'Containers';

class Wall extends React.Component {
  render() {
    return <Home username={this.props.match.params.username}></Home>;
  }
}

export default Wall;
