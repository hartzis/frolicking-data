let React = require('react');

class ImageListView extends React.Component {
  constructor(props) {
    super(props);
    this._selectImageToEdit = this._selectImageToEdit.bind(this);
  }

  _selectImageToEdit(imageInfo) {
    console.log('editImage-', imageInfo)
  }

  render() {
    let {frolicks} = this.props;
    let $frolicks = null;
    if (frolicks) {
      $frolicks = frolicks.map(frolick=>(<div className="listedFrolick" key={frolick.get('_id')} onClick={()=>this._selectImageToEdit(frolick.get('_id'))}>{frolick.get('filename')}</div>))
    }
    return (
      <div className="frolicksListContainer">
        {$frolicks}
      </div>
    )
  }

}

module.exports = ImageListView;