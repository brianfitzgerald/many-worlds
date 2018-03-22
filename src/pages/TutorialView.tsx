import * as React from "react"
import {
    Platform,
    StyleSheet,
    Text,
    ScrollView,
    StatusBar,
    View,
    ScrollViewProps,
    ScrollViewStatic,
    Button,
    TextInput,
    AsyncStorage
} from "react-native"
import { containerStyle, storyStyles as styles, titleInput } from "../styles/commonStyles";
import colors from "../styles/colors";
import { appStore } from "../stores/AppStore";
import HeroButton, { LightHeroButton } from "../components/HeroButton";
import { Story } from "../types/Story";
import StoryActionInput from "../components/StoryActionInput";
import { isFirstTimeKey } from "../utils";

type TutorialViewState = {
    step: number
    favoriteFood: string
}

const tutorialStory: Story = {
    id: '1',
    title: "A Froggy Tutorial",
    author: "Brian Fitzgerald",
    published: false,
    description: "The tutorial for the game",
    actions: [],
    defaultState: {}
}

export default class TutorialView extends React.Component<
    {},
    TutorialViewState
    > {
    constructor(props: {}) {
        super(props)

        this.state = {
            step: 0,
            favoriteFood: ''
        }
    }

    _incrementStep() {
        this.setState({
            step: this.state.step + 1
        })
    }

    _setFavoriteFood(favoriteFood: string) {
        this.setState({
            step: this.state.step + 1,
            favoriteFood
        })
    }

    _finishTutorial() {
        appStore.closeModal()
        AsyncStorage.setItem(isFirstTimeKey, 'false')
    }

    render() {

        let content = null
        const name = appStore.playerName

        switch (this.state.step) {
            case 0:
                content = (
                    <View style={containerStyle}>
                        <TextInput
                            placeholder="Enter your name"
                            value={name}
                            onChange={value => {
                                console.log(value.nativeEvent.text)
                                appStore.updatePlayerName(value.nativeEvent.text)
                            }}
                            placeholderTextColor={colors.grey}
                            style={titleInput}
                        />
                        <Button
                            color={colors.white}
                            title="Start"
                            onPress={() => this._incrementStep()}
                        />
                    </View>

                )
            case 1:
                const options = ["bananas", "eggs", "pancakes"]
                content = (
                    <View>
                        <Text style={styles.currentPromptText}>
                            A large frog blocks you path. "Tell me, adventurer, what is your favorite breakfast food?" he asks.
                        </Text>
                        {options.map((option, i) =>
                            <HeroButton
                                key={i}
                                title={option}
                                onPress={this._setFavoriteFood.bind(this, option)}
                                style={styles.promptButton}
                            />
                        )}
                    </View>
                )
            case 2:
                content = (
                    <View>
                        <Text style={styles.currentPromptText}>
                            You just made a choice! Adventures are full of choices.
                            But choose wisely, because the choices you make will affect the story you experience.
                        </Text>
                        <HeroButton
                            title="Go on"
                            onPress={this._incrementStep.bind(this)}
                            style={styles.promptButton}
                        />
                    </View>
                )
            case 3:
                content = (
                    <View>
                        <Text style={styles.currentPromptText}>
                            The frog returns, carrying a large plate of {this.state.favoriteFood}.
                            "Hope you're hungry", he says.
                        </Text>
                        <HeroButton
                            title="Dig in"
                            onPress={this._incrementStep.bind(this)}
                            style={styles.promptButton}
                        />
                    </View>
                )
            case 4:
                content = (
                    <View>
                        <Text style={styles.currentPromptText}>
                            As soon as you eat the first bite, you suddenly leave your body, and you seem to be floating above the scene.
                            You can see all possible paths, all possible decisions you could make, floating all around you.
                        </Text>
                        {tutorialStory.actions.map((action, i) => (
                            <View key={i}>
                                <StoryActionInput
                                    value={action.prompt}
                                    onChange={() => { }}
                                    hasFilter={action.filter !== undefined}
                                    onFilterPressed={() => { }}
                                    inputType="prompt"
                                />
                                {action.options
                                    ? action.options.map((action, k) => (
                                        <StoryActionInput
                                            value={action.title}
                                            hasFilter={action.filter !== undefined}
                                            onChange={() => { }}
                                            suppressFilterIcon={true}
                                            inputType="option"
                                        />
                                    ))
                                    : null}
                                <LightHeroButton
                                    title="Add an option"
                                    onPress={() => { }}
                                    style={{ minWidth: 100, alignSelf: "flex-end" }}
                                />
                            </View>
                        ))}
                    </View>
                )

        }

        return (
            <View style={containerStyle}>
                <StatusBar backgroundColor={colors.black} barStyle="light-content" />
                <ScrollView>
                    {content}
                </ScrollView>
            </View>
        )
    }
}
