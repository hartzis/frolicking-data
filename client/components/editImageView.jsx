let React = require('react');
let Immutable = require('immutable');
let {PropTypes, Component} = React;
let DatePicker = require('./react-datepicker/src/datepicker.jsx');
let moment = require('moment');

let {GoogleMap, Marker} = require('react-google-maps');

class EditImageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingImage: Immutable.fromJS(props.editingImage),
      editLoc: false
    };
    window.fuckingState = this.state;

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

  _editLocation() {
    this.setState({editLoc: true});
  }

  _onSelectLocation(...args) {
    console.log('loc?-', ...args);
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

    const imageInfo = this.state.editingImage.toJS();

    let {hasHat, heelClicked, hasOtherPeople, midAir} = imageInfo;
    let {location:{lng, lat}} = imageInfo;

    // "otherPeople" : [ ],
    // "hasOtherPeople" : false,
    // "hasHat" : false,
    // "midAir" : false,
    // "heelClicked" : false,
    // "location" : {
    //   "country" : "",
    //   "state" : "",
    //   "city" : "",
    //   "lng" : "",
    //   "lat" : ""
    // },
    // "tags" : [ ],
    // "story" : "",
    // "description" : "",
    // "date" : ISODate("2015-07-10T06:00:00Z"),
    // "title" : "yuppers number one",
    // "filename" : "20150710yuppersnumberone.JPG",

    return (
      <div>
        <h3>{filename}</h3>

        <form onChange={this._handleImageEdits} onSubmit={this._handleSubmitUpdate}>

          {/*<DatePicker onChange={this._handleDateChange} selected={imageDate} />
          <input type="text" onChange={this._handleTitleChange} value={imageTitle} />
          <button type="submit" disabled={!allowSubmit || isSubmitting}>Update Image</button>*/}

          <div>
            <label htmlFor="editHasHat"> Has Hat?</label>
            <input id="editHasHat" name="editHasHat" type="checkbox" value={hasHat}/>
          </div>
          <div>
            <label htmlFor="editheelClicked">Heel Clicked?</label>
            <input id="editheelClicked" name="editheelClicked" type="checkbox" value={heelClicked}/>
          </div>
          <div>
            <label htmlFor="editMidAir">Mid Air?</label>
            <input id="editMidAir" name="editMidAir" type="checkbox" value={midAir}/>
          </div>
          <div>
            <label htmlFor="editHasOtherPeople">Other People?</label>
            <input id="editHasOtherPeople" name="editHasOtherPeople" type="checkbox" value={hasOtherPeople}/>
          </div>
          <div>
            <label htmlFor="latlong">Lat/Lng</label>
            <input id="latlong" name="latlong" disabled={true} type="text" value={lat+', '+lng}/>
            <button onClick={this._editLocation}>add/edit loc</button>
          </div>
        </form>
        <div style={{height: '400px'}}>
          <GoogleMap containerProps={{
              ...this.props,
              style: {
                height: "100%",
              },
            }}
            ref="map"
            defaultZoom={3}
            defaultCenter={{lat: 0, lng: 0}}
            onClick={this._onSelectLocation}>
              {/* (lat && lng) ? <Marker {...marker} /> : null */}
          </GoogleMap>
       </div>
        {$images}
      </div>
    )
  }

}

EditImageView.propTypes = {
  onUpdateImage: PropTypes.func,
  isSubmitting: PropTypes.bool,
  frolick: PropTypes.object
};

module.exports = EditImageView;
