// @flow

import * as React from 'react';
import styled from '@emotion/styled';

type ReactElement = React.Element;

type Props = {
  slides: Array<ReactElement>,
  index: number,
};

class Slider extends React.Component<Props> {
  renderSlides = (slides: Array<ReactElement>) => {
    const slideWidth = 100 / slides.length;
    return slides.map((slide, index) => (
      <Slide slideWidth={slideWidth} key={index.toString()}>
        {slide}
      </Slide>
    ));
  };

  render() {
    const {slides, index} = this.props;
    const nSlides = slides.length;
    return (
      <RootStyled>
        <Scene index={index} sliderWidth={nSlides * 100}>
          {this.renderSlides(slides)}
        </Scene>
      </RootStyled>
    );
  }
}

const Slide = styled.div`
  width: ${props => props.slideWidth}%;

  margin: 4px;

  // background-color: blue;
`;

const Scene = styled.div`
	position: relative;
	left: ${props => -props.index * 100}%;
  display: flex;
  width: ${props => props.sliderWidth}%;
	height: 100%;

	transition: left 0.5s ease-in-out;
	
  // transform: ${props => `translate3d(${props.x}px,${props.y}px,0)`};
`;

const RootStyled = styled.div`
  height: 100%;
  width: 100%;

  position: relative;
  z-index: 0;

  background-color: red;
`;

export default Slider;
