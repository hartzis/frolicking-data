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

  render() {
    let {isSubmitting} = this.props;
    let $imagePreview = (<img src={imagePreviewUrl} style={{'maxWidth':'500px', 'maxHeight':'375px'}} />);

    return (
      <div>
        <form onChange={this._handleImageEdits} onSubmit={this._handleSubmitUpdate}>
          <DatePicker onChange={this._handleDateChange} selected={imageDate} />
          <input type="text" onChange={this._handleTitleChange} value={imageTitle} />
          <button type="submit" disabled={!allowSubmit || isSubmitting}>Update Image</button>
        </form>
        {$imagePreview}
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