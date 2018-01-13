/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Party from './pages/Party'

import Story from './Story'

import outOfTheSun from './stories/outOfTheSun'

export default class App extends React.Component {

  componentDidMount() {
    const story = new Story(outOfTheSun.defaultState, outOfTheSun.actions)
    const player = new Player('Mark')
  }

  render() {
    return <Party />
  }
}

