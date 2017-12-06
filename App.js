import React from 'react';
import { 
  StyleSheet, 
  Text, 
  Image, 
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Animated
} from 'react-native';

import { Asset, AppLoading } from 'expo';

import CloudManager from './CloudManager';
import Bird from './Bird';

const deviceHeight = Dimensions.get('window').height;
const startScreenHiddenPos = deviceHeight+400;
const startScreenVisiblePos = 0;

export default class Game extends React.Component {

  constructor(props) {
    super(props);

    this.grassImgSrc = require('./resources/grass.png');

    this.state = {
      gameStarted: false,
      gameOver: false,
      isReady: false,
      startScreenPos: new Animated.Value(startScreenHiddenPos),
      score: 0
    };

    this.components = {
      bird: null,
      cloudManager: null
    };

  }

  componentDidMount() {
    this.checkForCollisions();
    this.showStartScreen();
  }

  checkForCollisions() {
    setInterval(() => {
      if(!this.state.gameStarted)
        return;

      for(cloud of this.refs.cloudManager.getCloudPositions()) {
        let birdDim = this.refs.bird.getDimensions();

        if(cloud.inViewport &&
           birdDim.x < cloud.x+cloud.width && 
           birdDim.x + birdDim.width > cloud.x &&
           birdDim.y < cloud.y + cloud.height &&
           birdDim.height + birdDim.y > cloud.y) {
          this.gameOver();
        }

      }
    },50);
  }

  birdJump() {
    this.refs.bird.jump();
  }

  gameOver() {
    this.refs.bird.gameOver();
    this.refs.cloudManager.gameOver();
    this.setState({
      gameOver: true,
      gameStarted: false
    });
    setTimeout(() => {
      this.showStartScreen();
    }, 1500);
  }

  hideStartScreen() {
    Animated.timing(
      this.state.startScreenPos,
      {
        duration: 500,
        toValue: startScreenHiddenPos
     }).start();
  }

  showStartScreen() {
    Animated.timing(
      this.state.startScreenPos,
      {
        duration: 500,
        toValue: startScreenVisiblePos
     }).start();
  }

  newGame() {
    this.setState({
      gameStarted: true,
      gameOver: false
    });
    this.hideStartScreen();
    this.refs.bird.jump(true);
    this.refs.cloudManager.begin();
  }

  async _cacheResourcesAsync() {
    const images = [
        require('./resources/grass.png'),
        require('./resources/bird.png'),
        require('./resources/cloud.png')
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages)

  }

  _handleLoadingError(error) {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  }

  _handleFinishLoading() {
    this.setState({ isReady: true });
  }

  updateScore(score) {
    setTimeout(() => {
      this.setState({
        score: score
      });
    },1500);
  }

  render() {

    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      )
    }

    return (
      <TouchableWithoutFeedback onPress={()=>this.birdJump()}>
        <View style={styles.container}>

          <StatusBar barStyle="dark-content" />

          <Animated.View style={[styles.startScreen, {'top': this.state.startScreenPos}]}>
            <Text style={styles.startScreenHeaderText}>Enemy Clouds</Text>
            <TouchableOpacity style={styles.newGameBtn} onPress={()=>this.newGame()}>
              <Text style={styles.newGameBtnText}>{ this.state.gameOver ? 'New Game' : 'Start Game' }</Text>
            </TouchableOpacity>
            <Text style={[styles.gameOverText,{opacity:this.state.gameOver ? 1 : 0}]}>
              Game Over
            </Text>
            <Text style={[styles.gameOverScoreText,{opacity:this.state.gameOver ? 1 : 0}]}>
              Your Score: {this.state.score}
            </Text>
          </Animated.View>

          <Bird 
            ref="bird" 
            gameStarted={this.state.gameStarted} 
            gameOver={this.state.gameOver} 
          />
          <CloudManager 
            ref="cloudManager" 
            gameStarted={this.state.gameStarted} 
            gameOver={this.state.gameOver} 
            setScore={(score)=>{this.updateScore(score)}}
          />

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
    left: -80,
    zIndex: 2
  },
  newGameBtn: {
    padding: 25,
    backgroundColor: '#CCF2FF',
    borderRadius: 20,
    marginTop: 60,
    borderWidth: 1,
    borderColor: '#ABEAFF'
  },
  newGameBtnText: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#008FBF'
  },
  startScreen: {
    marginTop: 70
  },
  startScreenHeaderText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#008FBF'
  },
  gameOverText: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 40,
    color: '#008FBF',
    fontWeight: 'bold'
  },
  gameOverScoreText: {
    fontSize: 26,
    textAlign: 'center',
    marginTop: 10,
    color: '#008FBF'
  }
});
