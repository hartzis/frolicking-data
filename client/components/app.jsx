let React = require('react');
let Immutable = require('immutable');
let api = require('../services/apiService');
let ImageUpload = require('./imageUpload.jsx');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      app: Immutable.Map(),
      isSubmitting: false
    };
    this._uploadImage = this._uploadImage.bind(this);
    this._setSubmitting = this._setSubmitting.bind(this);
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
    this._setSubmitting(true);
    api.uploadImage(imageInfo)
      .then((response)=>{
        console.log(response);
        this._setSubmitting(false);
      })
  }

  _setSubmitting(update) {
    this.setState({isSubmitting: update});
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
        <hr/>
        <ImageUpload onUploadImage={this._uploadImage} isSubmitting={this.state.isSubmitting} />
      </div>
    )
  }

}

React.render(<App />, document.getElementById('theApp'));