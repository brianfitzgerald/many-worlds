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
  View,
  TextInput
} from 'react-native';

import PartyView from './pages/PartyView'


import outOfTheCave from './stories/outOfTheCave'
import appleDisaster from './stories/appleDisaster'


import commonStyles from './styles/commonStyles';

import { Provider, connect } from 'react-redux'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Player } from './types/Player';
import { Story } from './types/Story';

type AppState = {
  story: Story
  players: Player[]
  playerName: string
  roomID: string
  inRoom: boolean
}

type AppProps = {}

export default class App extends React.Component<AppProps,AppState>  {

  constructor(props: any) {
    super(props)

    const player: Player = {
      name: 'Gary',
      conditions: [],
      inventory: [],
      abilities: []
    }
    const players = [player]
    const story = outOfTheCave

    this.state = {
      playerName: '',
      story,
      players: [player],
      roomID: '',
      inRoom: false
    }

  }

  render() {

    let page = null

    if (!this.state.inRoom) {
      page = (
        <View style={commonStyles.container}>
          <Text style={commonStyles.headerText}>What is your name?</Text>
          <TextInput style={commonStyles.textInput} value={this.state.playerName} />
        </View>
      )
    }

    page = (
      <PartyView
        currentPlayerName={this.state.playerName}
        story={this.state.story}
        roomID={this.state.roomID}
      />
    )

    return page
  }
}

