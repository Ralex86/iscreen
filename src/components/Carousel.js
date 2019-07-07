/* @flow */

/**
 *	Module dependencies
 */

import React, {Component} from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

type Props = {
  cells: Array<any>,
  sceneWidth: number,
  sceneHeight: number,
};

type State = {
  selectedIndex: number,
  transform: string,
};

class Carousel extends Component<Props, State> {
  rotateFn = 'rotateY';
  cellWidth = this.props.sceneWidth;
  cellHeight = 300;
  cellSize = this.cellWidth;
  cellCount = this.props.cells.length;
  radius = Math.round(this.cellSize / 2 / Math.tan(Math.PI / this.cellCount));
  theta = 360 / this.cellCount;

  state = {
    selectedIndex: 0,
    transform: '',
  };

  getTransformation = (angle: number) => {
    return `transform: translateZ(-${this.radius}px) ${this.rotateFn}(${angle}deg);`;
  };

  rotateCarousel = () => {
    const {selectedIndex} = this.state;

    const angle = this.theta * selectedIndex * -1;
    this.setState({transform: this.getTransformation(angle)});
  };

  renderCell = (cell: any, index: number) => {
    const cellAngle = this.theta * index;
    const transform = `transform: ${this.rotateFn}(${cellAngle}deg) translateZ(${this.radius}px)`;
    return (
      <CarouselCell transform={transform} key={index}>
        {cell}
      </CarouselCell>
    );
  };

  renderCarousel = () => {
    const {transform} = this.state;
    const {cells} = this.props;

    return (
      <CarouselStyled
        radius={`${-this.radius}px`}
        transform={transform}
        onClick={() => {
          this.setState(prev => {
            return {
              selectedIndex: ++prev.selectedIndex,
            };
          }, this.rotateCarousel);
        }}>
        {cells.map((cell: any, index: number) => {
          return this.renderCell(cell, index);
        })}
      </CarouselStyled>
    );
  };

  render() {
    const {sceneWidth, sceneHeight} = this.props;
    return (
      <Scene sceneWidth={sceneWidth} sceneHeight={sceneHeight}>
        {this.renderCarousel()}
      </Scene>
    );
  }
}

const Transform = props => {
  const {transform} = props;
  return css`
    ${transform};
  `;
};

const CarouselCell = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;

  width: 100%;
  height: 100%;

  transition: transform 1s, opacity 1s;
  cursor: pointer;
  ${Transform};

  // backface-visibility: hidden;
  border: 1px solid orange;
`;

const CarouselStyled = styled('div')`
  position: absolute;

  width: 100%;
  height: 100%;

  transform: translateZ(${props => props.radius});
  ${Transform};

  transform-style: preserve-3d;
  transition: transform 0.25s ease-in;

  border: 1px solid blue;
`;

const Scene = styled('div')`
  display: flex;
  width: ${props => props.sceneWidth}px;
  height: ${props => props.sceneHeight}px;

  position: relative;

  border: 1px solid red;
  perspective: 1000px;
`;

export default Carousel;
