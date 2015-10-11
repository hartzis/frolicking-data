let React = require('react');
let Immutable = require('immutable');
let {PropTypes, Component} = React;
let DatePicker = require('./react-datepicker/src/datepicker.jsx');
let moment = require('moment');

let Select = require('react-select');

let {GoogleMap, Marker} = require('react-google-maps');

let options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
];

function logChange(val) {
    console.log("Selected: " + val);
}

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
    this._onSelectLocation = this._onSelectLocation.bind(this);
    this._editLocation = this._editLocation.bind(this);
    this._save = this._save.bind(this);
  }

  _save() {
    let data = this.state.editingImage.toJS();
    this.props.onUpdateImageInfo(data);
  }

  _handleSubmitUpdate(e) {
    e.preventDefault();
    console.log('update image-');
  }

  _handleImageEdits(e) {
    let {value, name, type, checked} = e.target;
    if (type === 'checkbox') {
      value = checked;
    }
    this.setState({
      editingImage: this.state.editingImage.set(name, value)
    })
  }

  _editLocation() {
    this.setState({editLoc: true});
  }

  _onSelectLocation(event) {
    if (this.state.editLoc) {
      let newState = this.state.editingImage.setIn(['location', 'lat'], event.latLng.lat())
        .setIn(['location', 'lng'], event.latLng.lng());
      console.log('new state-', newState.toJS());
      this.setState({
        editingImage: newState,
        editLoc: false
      });
    }

  }

  _renderImagePreviews(imageFilename) {
    const imageSizes = ['large', 'medium', 'small', 'thumbnail'];
    return imageSizes.map((size)=>{
      return (<img key={size} src={'/images/' + size + '/' + imageFilename + '-' + size + '.jpg'} />);
    })
  }

  render() {
    let {isSubmitting, editingImage} = this.props;
    let {filename} = editingImage;
    let $images = this._renderImagePreviews(filename);

    const imageInfo = this.state.editingImage.toJS();

    const {hasHat, heelClicked, hasOtherPeople, midAir} = imageInfo;
    const {location:{lng, lat}} = imageInfo;

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
        <h3>
          {filename}
          <button onClick={this._save}>
            Save Changes
          </button>
        </h3>

        <form onChange={this._handleImageEdits} onSubmit={this._handleSubmitUpdate}>

          {/*<DatePicker onChange={this._handleDateChange} selected={imageDate} />
          <input type="text" onChange={this._handleTitleChange} value={imageTitle} />
          <button type="submit" disabled={!allowSubmit || isSubmitting}>Update Image</button>*/}

          <div>
            <label htmlFor="hasHat">Has Hat?</label>
            <input id="hasHat" name="hasHat" type="checkbox" checked={hasHat}/>
          </div>
          <div>
            <label htmlFor="heelClicked">Heel Clicked?</label>
            <input id="heelClicked" name="heelClicked" type="checkbox" checked={heelClicked}/>
          </div>
          <div>
            <label htmlFor="midAir">Mid Air?</label>
            <input id="midAir" name="midAir" type="checkbox" checked={midAir}/>
          </div>
          <div>
            <label htmlFor="hasOtherPeople">Other People?</label>
            <input id="hasOtherPeople" name="hasOtherPeople" type="checkbox" checked={hasOtherPeople}/>
          </div>
          <div>
            <label htmlFor="latlong">Lat/Lng</label>
            <input style={{width:"300px"}} id="latlong" name="latlong" disabled={true} type="text" value={lat+', '+lng}/>
            <button onClick={this._editLocation}>add/edit loc</button>
            {this.state.editLoc ? (<span>*EDITING LOC*</span>) : null}
          </div>
        </form>
        <Select name="form-field-name" value="one" options={options} onChange={logChange} />
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
              { (typeof lat === 'number' && typeof lng === 'number') ? <Marker position={{lat, lng}} /> : null }
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
