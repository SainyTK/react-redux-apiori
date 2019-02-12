import React, { Component } from "react";

export default class Input extends Component {
  render() {
      const { title, name, placeholder, onChange } = this.props;
    return (
      <div>
        <div>{title}</div>
        <input name={name} type='text' onChange={onChange} placeholder={placeholder}/>
      </div>
    );
  }
}
