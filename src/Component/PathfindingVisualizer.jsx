import React, {Component} from 'react';
import Node from '../Node/Node';
import './PathfindingVisualizer.css';
import {dijkstra, getNodesInShortestPathOrder} from '../Algorithms/Dijkstra';


var START_NODE_ROW = 10;
var START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;




export default class PathfindingVisualizer extends Component {

    constructor() {
        super();
        this.state = {
          grid: [],
          mouseIsPressed: false,
        };
        // this.baseState = this.state;
      }



      componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
        this.baseState = { grid , mouseIsPressed:false};
      }

      handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
      }
    
      handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
      }
    
      handleMouseUp() {
        this.setState({mouseIsPressed: false});
      }

      animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-visited';
          }, 10 * i);
        }
      }
    
      animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
          }, 50 * i);
        }
      }

      visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
      }

       drop(ev) {
        console.log("drop",ev.target.id);
        ev.preventDefault();
        var data = ev.target.id;
        data = data.split("-");
        console.log(data);
        START_NODE_ROW = parseInt(data[1]);
        START_NODE_COL = parseInt(data[2]);
        const grid = getInitialGrid();
        this.setState({grid});
        this.render();
      //   ev.target.appendChild(document.getElementById(data));
      }

      reset(){
        console.log('reset');
        this.setState(intitialState);
        const nodeArray = document.getElementsByClassName('node');
        for (let i = 0; i < nodeArray.length; i++) {
          const element = nodeArray[i];
          element.className = 'node';
        }
        START_NODE_ROW = 10;
        START_NODE_COL = 15;
      }

      render() {
        const {grid, mouseIsPressed} = this.state;
        return (
          <>
            <button className={"btn btn-primary"} onClick={() => this.visualizeDijkstra()}>
              Visualize Dijkstra's Algorithm
            </button>&nbsp;
            <button className={"btn btn-secondary"} onClick={() => this.reset()}>
              Reset
            </button>
            <div className="grid">
              {grid.map((row, rowIdx) => {
                return (
                  <div key={rowIdx}
                  onDrop={(event)=>this.drop(event)}
                   onDragOver={(event)=>allowDrop(event)}>
                    {row.map((node, nodeIdx) => {
                      const {row, col, isFinish, isStart, isWall} = node;
                      return (
                        <Node
                          key={nodeIdx}
                          col={col}
                          isFinish={isFinish}
                          isStart={isStart}
                          isWall={isWall}
                          mouseIsPressed={mouseIsPressed}
                          onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                          onMouseEnter={(row, col) =>
                            this.handleMouseEnter(row, col)
                          }
                          onMouseUp={() => this.handleMouseUp()}
                          row={row}>
                          </Node>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </>
        );
      }
    }

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };


  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };


  const intitialState = {
    grid : getInitialGrid(),
    mouseIsPressed : false
  };
  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    console.log("drag",ev.target.id);
  ev.dataTransfer.setData("text", ev.target.id);
}

