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
import HeroButton from './components/HeroButton';
import { joinRoom, createRoom } from './firebaseFunctions';
import { getStory } from './actions/StoryDB';

type AppState = {
  story: Story
  playerName: string
  roomCode: string
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
      roomCode: '',
      inRoom: false
    }

  }

  joinRoom() {
    const { roomCode, playerName } = this.state
    joinRoom(roomCode, playerName).then((storyID: string) => {
      const story = getStory(storyID).then((story: Story) => {
        this.setState({
          inRoom: true,
          story
        })
      })
    })
  }

  createRoom() {
    const { playerName } = this.state
    const dummyStoryID = '239c41f0-9c9f-4f30-b322-e7d288eadd8e'
    createRoom(playerName).then((roomCode: string) => {
      const story = getStory(dummyStoryID).then((story: Story) => {
        this.setState({
          inRoom: true,
          roomCode,
          story
        })  
      })
    })
  }

  render() {

    let page = null

    if (!this.state.inRoom) {
      page = (
        <View style={commonStyles.container}>
          <Text style={commonStyles.headerText}>What is your name?</Text>
          <TextInput style={commonStyles.textInput} value={this.state.playerName} onChangeText={(val) => this.setState({ playerName: val })} />
          <Text style={commonStyles.headerText}>Where are you going?</Text>
          <TextInput style={commonStyles.textInput} value={this.state.roomCode} onChangeText={(val) => this.setState({ roomCode: val })} />
          <HeroButton title="Join" onPress={this.joinRoom.bind(this)} />
          <HeroButton title="Create Room" onPress={this.createRoom.bind(this)} />
        </View>
      )
    }

    page = (
      <PartyView
        currentPlayerName={this.state.playerName}
        story={this.state.story}
        roomCode={this.state.roomCode}
      />
    )

    return page
  }
}