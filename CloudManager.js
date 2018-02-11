import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Cloud from './Cloud';

const firstY = 40;
const baseSpeed = 5000;
const maxSpeed = 2000;
const spawnIntervalTime = 3500;
const imgSrc = require('./resources/cloud.png');

class CloudManager extends React.Component {

  constructor(props) {
    super(props);
    this.prevId = 0;
    this.lastY = 0;
    this.spawnInterval = null;
    this.spawnCounter = 0;
    this.cloudRefs = [];
    this.state = {
        clouds: [],
        score: 0
    };
  }

  componentDidUpdate() {
    //console.log('update cloudmanager')
  }

  gameOver() {
    this.cloudRefs = [];
    this.prevId = 0;
    this.spawnCounter = 0;
    this.setState({
      clouds: []
    });
    this.props.setScore(this.state.score);
  }

  componentDidMount() {
    this.beginSpawning();
  }

  begin() {
    this.setState({
      score: 0
    });
  }

  getCloudPositions() {
    let pos = [];
    this.cloudRefs.forEach((cloud) => {
      if(cloud) {
        pos.push(cloud.getDimensions());
      }
    });
    return pos;
  }

  beginSpawning() {

      if(this.spawnInterval)
        return;
      
      if(this.props.gameStarted)
        this.spawnCloud();

      this.spawnInterval = setInterval(() => {
          if(!this.props.gameStarted)
            return;
          this.spawnCloud();
      }, spawnIntervalTime);
  }

  randBetween(max,min) {
    return (Math.random() * (max - min) + min);
  }

  spawnCloud() {
    //console.log('spawning cloud');
    //this.spawnCounter++;
    let id = this.prevId+1;
    let clouds = this.state.clouds;
    let num = this.randBetween(1,2)-3;
    let y = (id == 1 ? firstY : this.randBetween(25, 300));
    this.lastY = y;
    let speed = baseSpeed;// - this.spawnCounter * 50;
    //speed = speed < maxSpeed ? maxSpeed : speed;
    
    if(this.state.clouds.length > 1) 
      clouds.splice(0,1);// delete first one

    clouds.push({
      y: y,
      speed: speed,
      key: id
    });

    this.setState({
        clouds: clouds
    });
    this.prevId = id;
  }

  incrementScore() {
    let newScore = this.state.score+1;
    this.setState({
      score: newScore
    });
  }

  render() {
    this.cloudRefs = [];
    return [
        <Text key={0} style={[styles.scoreText,{opacity:this.props.gameStarted ? 1 : 0}]}>
          Score: {this.state.score}
        </Text>, 
        this.state.clouds.map( (cloud) => {
          return <Cloud 
                    key={cloud.key} 
                    id={cloud.key} 
                    y={cloud.y} 
                    speed={cloud.speed} 
                    ref={(el) => {this.cloudRefs.push(el)}} 
                    imgSrc={imgSrc} 
                    offScreen={()=>this.incrementScore()}
                  />;
        })
    ];

  }
}

const styles = StyleSheet.create({
  scoreText: {
    fontSize: 25,
    color: '#fff',
    position: 'absolute',
    bottom: 10,
    left: 10,
    zIndex: 3,
    backgroundColor: 'transparent'
  }
});


module.exports = CloudManager;