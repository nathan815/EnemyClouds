import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Bird from './Bird';
import Cloud from './Cloud';

const firstY = 40;
const baseDur = 4000;

class CloudManager extends React.Component {

  constructor(props) {
    super(props);
    this.birdComponent = props.birdComponent;
    this.prevId = 0;
    this.lastY = 0;
    this.components = {
      bird: null
    };
    this.state = {
        clouds: []
    };
  }

  componentDidMount() {
    //this.props.onRef(this);
    // spawn first cloud!
    this.spawnCloud();
    this.beginSpawning();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  deleteFirstCloud() {
      if(this.state.clouds.length <= 1)
          return;
      let state = this.state;
      state.clouds.splice(0,1);
      this.setState(state);
  }

  beginSpawning() {
      setInterval(() => {
          this.spawnCloud();
      }, 3000);
  }

  spawnCloud() {
    //console.log(this.props.birdComponent);
    this.deleteFirstCloud();
    let id = this.prevId+1;
    let clouds = this.state.clouds;
    let y = id == 1 ? firstY : (this.lastY = Math.random() * (200 - 100) + 100);
    let dur = baseDur - Math.random() * 2000;
    clouds.push({
      y: y,
      dur: dur,
      key: id
    })
    this.setState({
        clouds: clouds
    });
    this.prevId = id;
  }

  render() {
    let c = [];
    this.state.clouds.forEach( (cloud) => {
      c.push(<Cloud key={cloud.key} y={cloud.y} duration={cloud.dur} ref={'cloud'+cloud.key} />);
    });
    return c;

  }
}

module.exports = CloudManager;