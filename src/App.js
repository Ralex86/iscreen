import React from 'react';
import './App.css';
import styled from '@emotion/styled';
import socketIOClient from 'socket.io-client';

// import Carousel from './components/Carousel';
import Slider from './components/Slider';

import slide1 from './assets/1.jpg';
import slide2 from './assets/2.jpg';
import slide3 from './assets/3.jpg';
import slide4 from './assets/4.jpg';
import slide5 from './assets/5.jpg';

class App extends React.Component {
  state = {
    alpha: null,
    beta: null,
    gamma: null,
    x: 0,
    y: 0,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    hasWindowResized: false,
    screenWidth: 0,
    screenHeight: 0,
    slideIndex: 0,
    isPointerDisplayed: "false"
  };


  screenRef = React.createRef();
  endpoint = '/screen';
  socket = socketIOClient(this.endpoint);

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    this.socket.on('position', data => {
      const {alpha, beta, gamma, x, y} = data;
      this.setState({alpha, beta, gamma, x, y});
    });

    this.socket.on('slideIndex', data => {
      // const {index} = data;
      console.log('iscreen', data);
      this.setState({slideIndex: data});
    });

    this.socket.on('display', data => {
      this.setState({ isPointerDisplayed: data });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateScreenDimensions = () => {
    const {
      current: {clientHeight, clientWidth},
    } = this.screenRef;

    this.setState({
      screenWidth: clientWidth,
      screenHeight: clientHeight,
    });
  };

  updateWindowDimensions = () => {
    console.log('update');
    this.setState(
      {
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      },
      () => this.updateScreenDimensions(),
    );
  };

  getSlides = () => {
    const slides = [
      {id: 1, url: slide1},
      {id: 2, url: slide2},
      {id: 3, url: slide3},
      {id: 4, url: slide4},
      {id: 5, url: slide5},
    ];

    return slides.map((slide, index) => (
      <Slide key={index.toString()} slideBackground={slide.url} />
    ));
  };


  render() {
    const {
      alpha,
      beta,
      gamma,
      x,
      y,
      screenWidth,
      screenHeight,
      slideIndex,
      isPointerDisplayed 
    } = this.state;
    const i_x = (screenWidth * x) / 200 + screenWidth / 2;
    const i_y = (screenHeight * y) / 200 + screenHeight / 2;

    return (
      <RootStyled>
        <Screen ref={this.screenRef}>
           {isPointerDisplayed && <Cursor x={i_x} y={i_y}> <Aim></Aim> </Cursor>}
          <Slider index={slideIndex} slides={this.getSlides()} />
        </Screen>
        <Monitoring>
          <span>alpha: {alpha}</span>
          <span>beta: {beta}</span>
          <span>gamma: {gamma}</span>
          <span>x: {x.toFixed(2)}</span>
          <span>y: {y.toFixed(2)}</span>  
          <h2> {slideIndex}  </h2> 
        </Monitoring>
      </RootStyled>
    );
  }
}

const Slide = styled.div`
  height: 100%;
  background-size: cover;
  background-image: url(${props => props.slideBackground});
  border-radius:15px;
  border: 1px solid #9999ff;
  box-shadow: 2px 5px 5px #CCCCFF;
`;

const Monitoring = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  width: 100px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
`;

const Cursor = styled.div`
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 25px;
  height: 25px;
  background: black;
  border-radius: 100%;
  user-select: none;
  transform: ${props => `translate3d(${props.x}px,${props.y}px,0)`};
  display:flex;
  flex-direction: column;
  justify-content:center;
`;

const Aim = styled.div`
    position: relative;
    width:15px;
    height:15px;
    margin: 0 auto;
    border-radius: 100%;
    background: #9999ff;
`;




const Screen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  width: calc(100% - 80px);
  height: calc(100% - 80px);

  //border: 5px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
`;

const RootStyled = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: ;
`;

export default App;
