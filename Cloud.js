import React from 'react';
import { Image, StyleSheet, Dimensions, Animated, Easing, TouchableWithoutFeedback } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const startX = deviceWidth+10;
const defaultY = 30;

class Cloud extends React.Component {

    constructor(props) {
        super(props);

        this.imgSrc = require('./resources/cloud.png');
        this.width = 150;
        this.height = 79;

        this.duration = this.props.dur || 4000; // milliseconds to move across screen

        this.state = {
          x: new Animated.Value(startX),
          y: new Animated.Value(this.props.y || defaultY)
        };
        this.state.x.addListener(({value}) => this._value = value);
        this.state.y.addListener(({value}) => this._value = value);


    }

    componentDidMount() {
      this.startMoving();
    }

    getDimensions() {
      return [this.state.x._value, this.state.y._value, this.width, this.height];
    }

    checkIfCollidedWith(x, y) {
      console.log('did collide with?', x, y);
    }

    startMoving() {
      Animated.timing(
        this.state.x, 
        {
          toValue: 0-this.width,
          duration: this.duration,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ).start();
    }

    getStyle() {
      return [
        styles.cloud,
        {
          transform: [
            {translateX: this.state.x},
            {translateY: this.state.y}
          ]
        }
      ];
    }

    isInViewport() {
      return (this.state.x + this.width > 0) && this.state.x < deviceWidth;
    }

    render() {
        return (
            <Animated.Image source={ this.imgSrc } style={ this.getStyle() } />
        );
    }
}

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: 150,
    height: 79,
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 30
  }
});

module.exports = Cloud;