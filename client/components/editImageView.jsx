let React = require('react');
let Immutable = require('immutable');
let {PropTypes, Component} = React;
let DatePicker = require('./react-datepicker/src/datepicker.jsx');
let moment = require('moment');

let Select = require('react-select');

let {GoogleMap, Marker} = require('react-google-maps');

class EditImageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingImage: Immutable.fromJS(props.editingImage),
      editLoc: false,
      tags: Immutable.Set(props.tags)
    };
    window.fuckingState = this.state;

    this._handleSubmitUpdate = this._handleSubmitUpdate.bind(this);
    this._handleImageEdits = this._handleImageEdits.bind(this);
    this._onSelectLocation = this._onSelectLocation.bind(this);
    this._editLocation = this._editLocation.bind(this);
    this._save = this._save.bind(this);
    this._updateTags = this._updateTags.bind(this);
    this._handleDateChange = this._handleDateChange.bind(this);
  }

  _save() {
    let data = this.state.editingImage.toJS();
    this.props.onUpdateImageInfo(data);
  }

  _handleSubmitUpdate(e) {
    e.preventDefault();
  }

  _updateTags(newTag, allArray) {
    let tags = allArray.map((tag)=>tag.value);
    console.log('newTag', newTag, 'tags-', tags);
    this.setState({
      editingImage: this.state.editingImage.set('tags', Immutable.fromJS(tags)),
      tags: this.state.tags.add(newTag)
    })
  }

  _handleDateChange(data) {
    console.log('date update-', data.format('YYYY-MM-DD'));
    this.setState({
      editingImage: this.state.editingImage.set('date', data.format('YYYY-MM-DD'))
    });
  }

  _handleImageEdits(e) {
    let {value, name, type, checked} = e.target;
    console.log('edit-', value, name, type, checked);
    if (!name) return;
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
    const availableTags = this.state.tags.toJS().map((tag)=>{
      return {value:tag, label:tag};
    });

    const {hasHat, heelClicked, hasOtherPeople, midAir, tags, description, title, date} = imageInfo;
    const selectedTags = tags.join(',');
    const {location:{lng, lat}} = imageInfo;

    let momentDate = moment(date);

    // "otherPeople" : [ ],
    // "hasOtherPeople" : false,
    // "hasHat" : false,
    // "midAir" : false,
    // "heelClicked" : false,
    // "location" : {
    //   "country" : "",
    //   "state" : "",
    //   "city" : "",
    //   "lng" : 234.34,
    //   "lat" : 123.34
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

          <div>
            <label htmlFor="title">Title:</label>
            <input id="title" name="title" type="text" value={title}/>
          </div>
          <div>
            Date:<DatePicker onChange={this._handleDateChange} selected={momentDate} />
          </div>
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
          <div>
            <label htmlFor="description">Description:</label>
            <textarea id="description" rows="4" cols="50" name="description" value={description} />
          </div>
        </form>
        <div>
          <label htmlFor="tags">Tags:</label>
          <Select name="tags"
            value={selectedTags}
            options={availableTags}
            onChange={this._updateTags}
            multi={true}
            allowCreate={true}
            ignoreCase={true}
            delimeter=','/>
        </div>
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
