let React = require('react');
let api = require('../services/apiService');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componenetDidMount() {
    
  }

  render() {
    return (
      <div>
        Hello App
      </div>
    )
  }

}

React.render(<App />, document.getElementById('theApp'));