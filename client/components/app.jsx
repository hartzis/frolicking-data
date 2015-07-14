let React = require('react');
let Immutable = require('immutable');
let api = require('../services/apiService');
let ImageUpload = require('./imageUpload.jsx');

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

  _uploadImage(imageInfo) {
    console.log('upload image-', imageInfo);
    api.uploadImage(imageInfo)
      .then((response)=>{
        console.log(response);
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
        <a href="/upload">Upload new Image</a>
        <ImageUpload onUploadImage={this._uploadImage} />
      </div>
    )
  }

}

React.render(<App />, document.getElementById('theApp'));