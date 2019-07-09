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


  pagingSlides = (index,nslides) => {
    if(index < 1){
      index = 1
      return index+ '/' + nslides;
    }
    if(index > nslides){
      index = nslides
      return index+ '/' + nslides;
    }
    return index+ '/' + nslides; 
    };

  onIndexChange= (index,nSlides) => {
    if(index> nSlides){
      return nSlides
    }
    if(index < 0){
      return 0
    }
    return index
  }

  render() {
    console.log(this.renderSlides)

    const {slides, index} = this.props;
    const nSlides = slides.length;

    // TODO : 
    return (
      <RootStyled>
        <Scene index={this.onIndexChange(index, nSlides)} sliderWidth={nSlides * 100}>
          {this.renderSlides(slides)}
        </Scene>

        <Paging>
          <h2> {this.pagingSlides(index+1,nSlides)} </h2>         
        </Paging> 

      </RootStyled>
    );
  }
}

const Slide = styled.div`
  width: ${props => props.slideWidth}%;
  margin: 2px;
}
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
`;


const Paging = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;
  display: flex;
  flex-direction: column;
  width: 100px;
  color: white;
  text-align:center;
  background: rgba(0, 0, 0, 0.6);
`;


export default Slider;
