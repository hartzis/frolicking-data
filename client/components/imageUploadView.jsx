let React = require('react');
let {PropTypes, Component} = React;
let api = require('../services/apiService');
let DatePicker = require('./react-datepicker/src/datepicker.jsx');
let moment = require('moment');

class ImageUploadView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imageDate: null,
      imageTitle: '',
      imagePreviewUrl: '',
      allowSubmit: false
    };
    this._handleImageChange = this._handleImageChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleDateChange = this._handleDateChange.bind(this);
    this._handleTitleChange = this._handleTitleChange.bind(this);
    this._checkIfCanSubmit = this._checkIfCanSubmit.bind(this);
  }

  _checkIfCanSubmit() {
    if (this.state.imageTitle && this.state.imagePreviewUrl && this.state.imageDate != null) {
      this.setState({allowSubmit: true});
    }
  }

  _handleSubmit(e) {
    e.preventDefault();
    if (this.props.onUploadImage) {
      this.props.onUploadImage({
        imageFile: this.state.file,
        imageDate: this.state.imageDate.format('YYYY-MM-DD'),
        imageTitle: this.state.imageTitle
      });
    }
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      }, ()=>this._checkIfCanSubmit());
    }

    reader.readAsDataURL(file)
  }

  _handleDateChange(data) {
    console.log('date-', data);
    debugger;
    this.setState({imageDate: data}, ()=>this._checkIfCanSubmit());
  }

  _handleTitleChange(event) {
    this.setState({imageTitle: event.target.value}, ()=>this._checkIfCanSubmit());
  }

  render() {
    let {isSubmitting} = this.props;
    let {imagePreviewUrl, imageDate, imageTitle, allowSubmit} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} style={{'maxWidth':'500px', 'maxHeight':'375px'}} />);
    }

    return (
      <div>
        <form onSubmit={this._handleSubmit}>
          <input type="file" onChange={this._handleImageChange} />
          <div>
            Date:<DatePicker onChange={this._handleDateChange} selected={imageDate} />
          </div>
          <div>
            <label htmlFor="theImageTitle"> Image Title</label>
            <input type="text" id="theImageTitle" onChange={this._handleTitleChange} value={imageTitle} />
          </div>
          <button type="submit" disabled={!allowSubmit || isSubmitting}>Upload Image</button>
        </form>
        {$imagePreview}
      </div>
    )
  }

}

ImageUploadView.propTypes = {
  onUploadImage: PropTypes.func,
  isSubmitting: PropTypes.bool
}

module.exports = ImageUploadView;
