import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ title, name, placeholder, onBlur }) => (
  <div>
    <div>{title}</div>
    <input name={name} type='text' onBlur={onBlur} placeholder={placeholder} />
  </div>
)

Input.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func
}

export default Input;
