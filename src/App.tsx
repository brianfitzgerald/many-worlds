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

import PartyView from './pages/PartyView'

import Story from './Story'

import outOfTheCave from './stories/outOfTheCave'
import appleDisaster from './stories/appleDisaster'

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
    const player = new Player(playerName)
    const players = [player]
    const story = new Story(outOfTheCave.defaultState, outOfTheCave.actions)

    this.state = {
      playerName,
      story,
      players
    }

  }

  render() {
    return <PartyView currentPlayerName={this.state.playerName} players={this.state.players} story={this.state.story} />
  }
}

