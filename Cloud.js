import React from 'react';
import { Image, StyleSheet, Dimensions, Animated, Easing, TouchableWithoutFeedback } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const startX = deviceWidth;
const defaultY = 30;
const defaultSpeed = 5000;

class Cloud extends React.Component {

    constructor(props) {
        super(props);

        this.width = 150;
        this.height = 79;

        this.speed = this.props.speed || defaultSpeed;  // milliseconds to move across the screen

        this.state = {
          x: new Animated.Value(startX),
          y: new Animated.Value(this.props.y || defaultY)
        };
        this.state.x.addListener(({value}) => this._value = value);
        this.state.y.addListener(({value}) => this._value = value);

        this.startMoving();
    }

    isInViewport() {
      return (this.state.x._value + this.width > 0) && this.state.x._value < deviceWidth;
    }

    getDimensions() {
      return {
        x: this.state.x._value, 
        y: this.state.y._value,
        width: this.width, 
        height: this.height,
        inViewport: this.isInViewport()
      };
    }

    startMoving() {
      Animated.timing(
        this.state.x, 
        {
          toValue: 0-this.width,
          duration: this.speed,
          easing: Easing.linear
        }
      ).start(() => {
        if(!this.isInViewport())
          this.props.offScreen();
      });
    }

    getStyle() {
      return [
        styles.cloud,
        {
          left: this.state.x,
          top: this.state.y
        }
      ];
    }

    render() {
        return (
            <Animated.Image source={ this.props.imgSrc } style={ this.getStyle() } />
        );
    }
}

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    top: 0,
    left: deviceWidth,
    width: 150,
    height: 79,
    zIndex: 2
  }
});

module.exports = Cloud;