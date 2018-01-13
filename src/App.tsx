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
    const dummy = new Player(playerName)
    const players = [dummy]
    const story =  new Story(appleDisaster.defaultState, appleDisaster.actions)

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

