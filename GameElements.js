import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import CloudManager from './CloudManager';
import Bird from './Bird';

class GameElements extends React.Component {

  constructor(props) {
    super(props);
    this.components = {
      bird: null
    };
  }

  render() {
      return (
          <View>
            
          </View>
      );
  }
}

module.exports = GameElements;