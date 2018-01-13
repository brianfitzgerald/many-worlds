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
import Player from './Player';

type AppState = {
  story: Story
  players: Player[],
  playerName: string
}

type AppProps = {}

export default class App extends React.Component<AppProps,AppState>  {

  constructor(props: any) {
    super(props)

    const playerName = 'Mark'
    const dummy = new Player(playerName)
    const players = [dummy]
    const story =  new Story(outOfTheSun.defaultState, outOfTheSun.actions)

    this.state = {
      playerName,
      story,
      players
    }

  }

  render() {
    return <Party currentPlayerName={this.state.playerName} players={this.state.players} story={this.state.story} />
  }
}

