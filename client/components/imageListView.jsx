let React = require('react');

class ImageListView extends React.Component {
  constructor(props) {
    super(props);
    this._selectImageToEdit = this._selectImageToEdit.bind(this);
  }

  _selectImageToEdit(image) {
    if (!this.props.isSubmitting) {
      this.props.onSelectImageToEdit(image);
    }
  }

  render() {
    let {frolicks, selectedId} = this.props;
    let $frolicks = null;
    if (frolicks) {
      $frolicks = frolicks.map(frolick=>{
        let isSelected = frolick.get('_id') === selectedId;
        return (
          <div className="listedFrolick" key={frolick.get('_id')} onClick={()=>this._selectImageToEdit(frolick)} style={{'borderBottom': isSelected ? 'solid 1px gray' : '', 'borderTop': isSelected ? 'solid 1px gray' : ''}}>
            {frolick.get('filename')}
            {isSelected ? (<span>&raquo;</span>) : null}
          </div>
        )
      })
    }
    return (
      <div className="frolicksListContainer">
        <button onClick={this.props.onAddNewImage}> Add new image </button>
        {$frolicks}
      </div>
    )
  }

}

module.exports = ImageListView;