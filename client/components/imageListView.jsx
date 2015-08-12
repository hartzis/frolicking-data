let React = require('react');

class ImageListView extends React.Component {
  constructor(props) {
    super(props);
    this._selectImageToEdit = this._selectImageToEdit.bind(this);
  }

  _selectImageToEdit(image) {
    if (!this.props.isSubmitting) {
      console.log('editImage-', image);
      this.props.onSelectImageToEdit(image);
    }
  }

  render() {
    let {frolicks} = this.props;
    let $frolicks = null;
    if (frolicks) {
      $frolicks = frolicks.map(frolick=>(<div className="listedFrolick" key={frolick.get('_id')} onClick={()=>this._selectImageToEdit(frolick)}>{frolick.get('filename')}</div>))
    }
    return (
      <div className="frolicksListContainer">
        {$frolicks}
      </div>
    )
  }

}

module.exports = ImageListView;