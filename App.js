/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Party from './src/pages/Party'

export default class App extends Component {
  render() {
    return <Party />
  }
}

