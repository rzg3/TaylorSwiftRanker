import React, { useState } from 'react';

class SubmitButton extends React.Component {
  render() {
    const buttonStyle = {
      whiteSpace: 'normal', // Allow text wrapping
      display: 'inline-block', // Allow button to expand horizontally
      width: 'auto', // Let the button width be determined by content
    };

    return (
      <div className="submitButton">
        <button
          type="button"
          className="btn btn-outline-primary"
          disabled={this.props.disabled}
          onClick={() => this.props.onClick()}
          style={buttonStyle}
        >
          {this.props.text}
        </button>
      </div>
    );
  }
}

export default SubmitButton;
