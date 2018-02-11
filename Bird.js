import React from 'react';
import { Image, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const hiddenY = -70;
const defaultX = 50;
const defaultY = 50;

class Bird extends React.Component {

    constructor(props) {
        super(props);
        this.imgSrc = require('./resources/bird.png');
        this.width = 70;
        this.height = 70;
        this.jumpAnimation = null;
        this.idleAnimationHandle = null;
        this.state = {
        x: new Animated.Value(defaultX),
        y: new Animated.Value(hiddenY),
        rotate: new Animated.Value(0)
      };
        this.state.x.addListener(({value}) => this._value = value);
        this.state.y.addListener(({value}) => this._value = value);
    }

    componentDidUpdate() {
      this.idleAnimation(this.props.gameStarted);
    }

    begin() {
      Animated.sequence([
        Animated.timing(
          this.state.y,
          {
            toValue: defaultY+100,
            duration: 1000
          }
        ),
        Animated.timing(
          this.state.y,
          {
            toValue: defaultY,
            duration: 1000
          }
        )
      ]).start();
    }

    gameOverAnimation() {
      Animated.parallel([
        Animated.timing(
          this.state.y,
          {
            toValue: deviceHeight,
            duration: 1000
          }
        ),
        Animated.timing(
          this.state.rotate,
          {
            toValue: 360,
            duration: 1000
          }
        )
      ]).start(() => {
        this.setState({
          x: new Animated.Value(defaultX),
          y: new Animated.Value(hiddenY),
          rotate: new Animated.Value(0)
        });
      });
    }

    gameOver() {
      this.gameOverAnimation();
    }

    getDimensions() {
      return {
        x: this.state.x._value, 
        y: this.state.y._value, 
        width: this.width, 
        height: this.height
      };
    }

    idleAnimation(run=true) {
      if(!this.props.gameStarted) 
        return;
      this.idleAnimationHandle = Animated.sequence([
        Animated.timing(
          this.state.rotate,
          {
            toValue: 20,
            duration: 1000
          }
        ),
        Animated.timing(
          this.state.rotate,
          {
            toValue: 0,
            duration: 1000
          }
        )
      ]).start(() => {
        this.idleAnimation();
      });
    }

    jump(override=false) {
      if(!this.props.gameStarted && !override)
        return;

      this.jumpAnimation = Animated.sequence([
        Animated.timing(
          this.state.y,
          {
            toValue: deviceHeight-300,
            duration: 1000
          }
        ),
        Animated.timing(
          this.state.y,
          {
            toValue: defaultY,
            duration: 1000
          }
        )
      ]).start();

    }

    getStyle() {
      let spin = this.state.rotate.interpolate({
        inputRange: [-360, 360],
        outputRange: ['-360deg', '360deg']
      });
      return [
          styles.bird, 
          {
            left: this.state.x,
            top: this.state.y,
            transform: [{rotate:spin}]
          }
      ];
    }

    render() {
        return (
            <Animated.Image source={ this.imgSrc } style={ this.getStyle() } ref="bird" />
        );
    }
}

const styles = StyleSheet.create({
  bird: {
    resizeMode: 'stretch',
    width: 70,
    height: 70,
    position: 'absolute',
    top: hiddenY,
    left: defaultX,
    zIndex: 1,
    //borderWidth: 1,
    //borderColor: '#ff0000'
  }
});

module.exports = Bird;