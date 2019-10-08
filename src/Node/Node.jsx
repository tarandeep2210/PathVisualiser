import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {

   
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';

      if(isStart){
        return  (
            <div
              id={`node-${row}-${col}`}
              className={`node ${extraClassName}`}
              onMouseDown={() => onMouseDown(row, col)}
              onMouseEnter={() => onMouseEnter(row, col)}
              onMouseUp={() => onMouseUp()}
              onDrop={(event)=>drop(event)} onDragOver={(event)=>allowDrop(event)}>
            <i className={"fa fa-chevron-right"} aria-hidden="true" draggable={"true"} onDragStart={(event)=>drag(event)}></i></div>
          );
      }

     return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        // onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}
function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
      console.log("drag",ev.target.id);
    ev.dataTransfer.setData("text", ev.target.id);
  }

function drop(ev) {
    console.log("drop",ev.target.id);
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }