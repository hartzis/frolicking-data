let React = require('react');
let Immutable = require('immutable');
let api = require('../services/apiService');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      app: Immutable.Map()
    };
  }

  componentDidMount() {
    api.getAll()
      .then((data) => {
        this.setState({
          app: this.state.app.set('frolicks', Immutable.fromJS(data))
        })
      })
  }

  render() {
    let frolicks = this.state.app.get('frolicks');
    let $frolicks = null;
    if (frolicks) {
      $frolicks = frolicks.map(frolick=>(<div key={frolick.get('id')}>{frolick.get('name')}</div>))
    }
    return (
      <div>
        Hello App
        {$frolicks}
      </div>
    )
  }

}

React.render(<App />, document.getElementById('theApp'));