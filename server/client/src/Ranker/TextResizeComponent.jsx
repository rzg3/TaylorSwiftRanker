import React from 'react';
import '../App.css'

function TextResizeComponent( {text}) {
    let originFontSize = 1.85;
    let maxDisplayCharInLine = 30; 
    let scaleFactor = 0.5;
    let fontSize = Math.min(originFontSize, originFontSize * Math.pow(Math.log((maxDisplayCharInLine / text.length) + 1), scaleFactor));



  return (
    <div className="display-content" style={{
                                             fontSize: fontSize + 'vh', 
                                             fontWeight: 700,
                                             height: '100%',
                                             width: '100%',
                                             display: 'flex',
                                             justifyContent: 'center',
                                             alignItems: 'center',
                                             overflow: 'hidden'
                                           }}>
      {text}
    </div>
  );
}

export default TextResizeComponent;
