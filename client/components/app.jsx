let React = require('react');
let Immutable = require('immutable');
let api = require('../services/apiService');
let ImageUploadView = require('./imageUploadView.jsx');
let ImageListView = require('./imageListView.jsx');
let EditImageView = require('./editImageView.jsx');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      app: Immutable.fromJS({
        frolicks: [],
        editingImage: null,
        isSubmitting: false
      }),
    };
    this._uploadImage = this._uploadImage.bind(this);
    this._setSubmitting = this._setSubmitting.bind(this);
    this._selectEditImage = this._selectEditImage.bind(this);
  }

  componentDidMount() {
    window.daApp = this;
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
        this.setState({
          app: Immutable.Map({
            frolicks: Immutable.fromJS(response.allFrolicks),
            editingImage: Immutable.fromJS(response.savedFrolick)
          })
        }, ()=>this._setSubmitting(false))
      })
  }

  _setSubmitting(update) {
    this.setState({
      app: this.state.app.set('isSubmitting', update)
    });
  }

  _selectEditImage(imageToEdit) {
    this.setState({
      app: this.state.app.set('editingImage', imageToEdit)
    })
  }

  render() {
    let frolicks = this.state.app.get('frolicks');
    let editingImage = this.state.app.get('editingImage');
    let isSubmitting = this.state.app.get('isSubmitting');

    let $editOrNewImage = null;
    if (editingImage) {
      $editOrNewImage = (<EditImageView editingImage={editingImage.toJS()} isSubmitting={isSubmitting} />);
    } else {
      $editOrNewImage = (<ImageUploadView onUploadImage={this._uploadImage} isSubmitting={isSubmitting} />);
    }

    return (
      <div className="theContainer">
        <ImageListView frolicks={frolicks} onSelectImageToEdit={this._selectEditImage} isSubmitting={isSubmitting} />
        {$editOrNewImage}
      </div>
    )
  }

}

React.render(<App />, document.getElementById('theApp'));