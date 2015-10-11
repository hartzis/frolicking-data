let React = require('react');
let ReactDOM = require('react-dom');
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
        tags: [],
        editingImageId: null,
        isSubmitting: false
      }),
    };
    this._getAllFrolicksAndTags = this._getAllFrolicksAndTags.bind(this);
    this._uploadImage = this._uploadImage.bind(this);
    this._setSubmitting = this._setSubmitting.bind(this);
    this._selectEditImage = this._selectEditImage.bind(this);
    this._addNewImage = this._addNewImage.bind(this);
    this._updateImageInfo = this._updateImageInfo.bind(this);
  }

  componentDidMount() {
    window.daApp = this;
    this._getAllFrolicksAndTags();
  }

  _getAllFrolicksAndTags() {
    api.getAll()
      .then((data) => {
        let newAppState = this.state.app.set('frolicks', Immutable.fromJS(data.frolicks))
          .set('tags', Immutable.fromJS(data.tags));
        this.setState({
          app: newAppState
        })
      })
  }

  _uploadImage(imageInfo) {
    console.log('upload image-', imageInfo);
    this._setSubmitting(true);
    api.uploadImage(imageInfo)
      .then((response)=>{
        let newAppState = this.state.app.set('frolicks', Immutable.fromJS(response.allFrolicks))
          .set('editingImageId', Immutable.fromJS(response.savedFrolick._id));
        this.setState({ app: newAppState }, ()=>this._setSubmitting(false))
      })
  }

  _setSubmitting(update) {
    this.setState({
      app: this.state.app.set('isSubmitting', update)
    });
  }

  _selectEditImage(imageToEditId) {
    this.setState({
      app: this.state.app.set('editingImageId', imageToEditId)
    })
  }

  _addNewImage() {
   this.setState({
      app: this.state.app.set('editingImageId', null)
    })
  }

  _updateImageInfo(data) {
    api.update(data._id, data)
      .then(()=>{
        this._getAllFrolicksAndTags();
      })
  }

  render() {
    let frolicks = this.state.app.get('frolicks');
    let editingImageId = this.state.app.get('editingImageId');
    let isSubmitting = this.state.app.get('isSubmitting');
    let tags = this.state.app.get('tags').toJS();

    let $editOrNewImage = null;
    if (editingImageId) {
      let editingImage = frolicks.find((frolick)=>frolick.get('_id') === editingImageId);
      $editOrNewImage = (
        <EditImageView key={editingImage.get('_id')}
        editingImage={editingImage.toJS()}
        isSubmitting={isSubmitting} 
        onUpdateImageInfo={this._updateImageInfo}
        tags={tags} />
      );
    } else {
      $editOrNewImage = (<ImageUploadView onUploadImage={this._uploadImage} isSubmitting={isSubmitting} />);
    }

    return (
      <div className="theContainer">
        <ImageListView frolicks={frolicks} onAddNewImage={this._addNewImage} onSelectImageToEdit={this._selectEditImage} isSubmitting={isSubmitting} selectedId={editingImageId} />
        {$editOrNewImage}
      </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('theApp'));
console.log('halp;');
