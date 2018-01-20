import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar
} from 'react-native';

import PartyView from './pages/PartyView'


import outOfTheCave from './stories/outOfTheCave'
import appleDisaster from './stories/appleDisaster'


import commonStyles from './styles/commonStyles';

import { Player } from './types/Player';
import { Story } from './types/Story';
import HeroButton from './components/HeroButton';
import { joinRoom, createRoom, roomDefaultState } from './firebaseFunctions';
import { getStory } from './actions/StoryDB';
import colors from './styles/colors';

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
          story,
          roomCode
        })
      }).catch((e) => {
        console.log(e);
      })
    })
  }

  createRoom() {
    const { playerName } = this.state
    const dummyStoryID = roomDefaultState.storyID
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
          <StatusBar
                backgroundColor={colors.black}
                barStyle="light-content"
          />
          <Text style={commonStyles.headerText}>What is your name?</Text>
          <TextInput placeholder="Name" placeholderTextColor={colors.grey} style={commonStyles.textInput} value={this.state.playerName} onChangeText={(val) => this.setState({ playerName: val })} />
          <Text style={commonStyles.headerText}>Where are you going?</Text>
          <TextInput placeholder="Room Code" placeholderTextColor={colors.grey} style={commonStyles.textInput} value={this.state.roomCode} onChangeText={(val) => this.setState({ roomCode: val })} />
          <HeroButton title="Join" onPress={this.joinRoom.bind(this)} />
          <HeroButton title="Create Room" onPress={this.createRoom.bind(this)} />
        </View>
      )
    } else {
      page = (
        <PartyView
          currentPlayerName={this.state.playerName}
          story={this.state.story}
          roomCode={this.state.roomCode}
        />
      )  
    }

    return page
  }
}