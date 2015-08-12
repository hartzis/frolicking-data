let React = require('react');
let {PropTypes, Component} = React;
let DatePicker = require('./react-datepicker/src/datepicker.jsx');
let moment = require('moment');

class EditImageView extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this._handleSubmitUpdate = this._handleSubmitUpdate.bind(this);
    this._handleImageEdits = this._handleImageEdits.bind(this);
  }

  // _checkIfCanSubmit() {
  //   if (this.state.imageTitle && this.state.imagePreviewUrl && this.state.imageDate != null) {
  //     this.setState({allowSubmit: true});
  //   }
  // }

  _handleSubmitUpdate(e) {
    e.preventDefault();
    console.log('update image-');
  }

  _handleImageEdits(e) {
    e.preventDefault();
    console.log('changed-', e);
  }

  _renderImagePreviews(imageFilename) {
    const imageSizes = ['large', 'medium', 'small', 'thumbnail'];
    return imageSizes.map((size)=>{
      return (<img key={size} src={'/images/' + size + '/' + imageFilename + '-' + size + '.jpg'} />);
    })
  }

  render() {
    let {isSubmitting} = this.props;
    let {filename} = this.props.editingImage;
    let $images = this._renderImagePreviews(filename);

    return (
      <div>
        <h3>{filename}</h3>
        {/*<form onChange={this._handleImageEdits} onSubmit={this._handleSubmitUpdate}>
          <DatePicker onChange={this._handleDateChange} selected={imageDate} />
          <input type="text" onChange={this._handleTitleChange} value={imageTitle} />
          <button type="submit" disabled={!allowSubmit || isSubmitting}>Update Image</button>
        </form>*/}
        {$images}
      </div>
    )
  }

}

EditImageView.propTypes = {
  onUpdateImage: PropTypes.func,
  isSubmitting: PropTypes.bool,
  frolick: PropTypes.object
}

module.exports = EditImageView;