import React from 'react';
import { Image, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const defaultX = 20;
const defaultY = 40;

class Bird extends React.Component {

    constructor(props) {
        super(props);
        this.imgSrc = require('./resources/bird.png');
        this.width = 70;
        this.height = 70;
        this.state = {
            x: new Animated.Value(defaultX),
            y: new Animated.Value(defaultY),
            rotate: new Animated.Value(0)
        };
        this.state.x.addListener(({value}) => this._value = value);
        this.state.y.addListener(({value}) => this._value = value);
    }

    componentDidMount() {
      //this.props.onRef(this);
      this.idleAnimation();
    }
    componentWillUnmount() {
      this.props.onRef(undefined);
    }

    getDimensions() {
      return [this.state.x._value, this.state.y._value, this.width, this.height];
    }

    idleAnimation() {
      Animated.sequence([
        Animated.timing(
          this.state.rotate,
          {
            toValue: 20,
            duration: 1000,
            useNativeDriver: true
          }
        ),
        Animated.timing(
          this.state.rotate,
          {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
          }
        )
      ]).start(() => {
        this.idleAnimation();
      });
    }

    jump() {
      Animated.sequence([
        Animated.timing(
          this.state.y,
          {
            toValue: 260,
            duration: 1100,
            useNativeDriver: true
          }
        ),
        Animated.timing(
          this.state.y,
          {
            toValue: defaultY,
            duration: 1100,
            useNativeDriver: true
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
              transform: [
                { translateX: this.state.x },
                { translateY: this.state.y },
                { rotate: spin }
              ]
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
    top: defaultY,
    left: defaultX,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 15
  }
});

module.exports = Bird;