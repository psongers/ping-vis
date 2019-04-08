import React, { Component } from 'react';

class PingForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <label>
          Address: 
          <input type="text" value={this.props.addressValue} name="address" onChange={this.props.onChangeHandler} />
        </label>
        <button name="start" onClick={this.props.onClickHandler}>
          Start
        </button>
        <button name="play" onClick={this.props.onClickHandler}>
          Pause/Resume
        </button>
      </div>
    )
  }
}

export default PingForm;
