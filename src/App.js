import React from 'react';
import './App.css';
import styled from '@emotion/styled';
import socketIOClient from 'socket.io-client';

// import Carousel from './components/Carousel';
import Slider from './components/Slider';

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
      const {index} = data;
      console.log('iscreen', data);
      this.setState({slideIndex: data});
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
    return [
      <Slide>1</Slide>,
      <Slide>2</Slide>,
      <Slide>3</Slide>,
      <Slide>4</Slide>,
      <Slide>5</Slide>,
    ];
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
    } = this.state;
    const i_x = (screenWidth * x) / 200 + screenWidth / 2;
    const i_y = (screenHeight * y) / 200 + screenHeight / 2;

    return (
      <RootStyled>
        <Screen ref={this.screenRef}>
          <Cursor x={i_x} y={i_y} />
          <Slider index={slideIndex} slides={this.getSlides()} />
        </Screen>
        <Monitoring>
          <span>alpha: {alpha}</span>
          <span>beta: {beta}</span>
          <span>gamma: {gamma}</span>
          <span>x: {x.toFixed(2)}</span>
          <span>y: {y.toFixed(2)}</span>
        </Monitoring>
      </RootStyled>
    );
  }
}

const Slide = styled.div`
  height: 200px;
  width: 100px;
  background-color: green;
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
  width: 20px;
  height: 20px;
  background: red;
  border-radius: 100%;
  user-select: none;
  transform: ${props => `translate3d(${props.x}px,${props.y}px,0)`};
`;

const Screen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  width: calc(100% - 80px);
  height: calc(100% - 80px);

  border: 5px solid #ccc;
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
