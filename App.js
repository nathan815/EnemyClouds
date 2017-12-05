import React from 'react';
import { 
  StyleSheet, 
  Text, 
  Image, 
  View,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
  Alert
} from 'react-native';

import Cloud from './Cloud';
import CloudManager from './CloudManager';
import Bird from './Bird';
import GameElements from './GameElements';

export default class Game extends React.Component {

  constructor(props) {
    super(props);

    this.grassImgSrc = require('./resources/grass.png');

    this.components = {
      bird: null,
      cloudManager: null
    };

  }

  componentDidMount() {
    this.checkForCollisions();
  }

  checkForCollisions() {
    //console.log(this.refs.cloudManager);
    this.refs.cloudManager.state.clouds.map((cloud) => {
      //console.log(cloud);
    });
    setInterval(() => {
      //console.log(this.refs.bird.getDimensions());
    },1000);
  }

  birdJump() {
    this.refs.bird.jump();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={()=>this.birdJump()}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />

          <Bird ref="bird" />
          <CloudManager ref="cloudManager" />

          <Image source={this.grassImgSrc} style={styles.grass} />
        </View>
      </TouchableWithoutFeedback>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    flex: 4,
    backgroundColor: '#96E5FF',
    alignItems: 'center',
    position: 'relative'
  },
  grass: {
    position: 'absolute',
    bottom: 0,
    left: -80
  }
});
