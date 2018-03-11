import { StoryAction, StoryState, StoryOption, Story } from "../types/Story"
import { Player } from "../types/Player"
import { RoomState } from "../types/Network"

export const next = { title: "->" }

export function getActionByIndex(story: Story, index: number): StoryAction {
  return story.actions[index]
}

export function validateFilter(
  filter: StoryState | undefined,
  currentState: StoryState
): boolean {
  // will need to write a DSL to parse text options soon

  if (filter !== undefined) {
    const isValid =
      Object.keys(filter)
        .map(k => filter && filter[k] === currentState[k])
        .filter(t => t !== true).length === 0
    return isValid
  }
  return true
}

export const getPlayersWhoSelectedOption = (
  optionIndex: number,
  roomState: RoomState
) =>
  roomState.connectedPlayers.filter(p => p.selectedChoiceIndex === optionIndex)

export const getCurrentBestSelection = (roomState: RoomState): number => {
  const playerVotes = roomState.connectedPlayers.map(
    (p: Player, i: number) => ({
      index: i,
      amount: p.selectedChoiceIndex ? p.selectedChoiceIndex : 0
    })
  )
  const sortedPlayerVotes = playerVotes.sort(
    (a, b) => (a && b ? a.amount - b.amount : -1)
  )
  return sortedPlayerVotes[0].index
}

export function getViableOptions(
  options: StoryOption[] | undefined,
  currentState: StoryState
): StoryOption[] {
  if (!options) {
    return []
  }
  const viableOptions = options.filter(o =>
    validateFilter(o.filter, currentState)
  )
  return viableOptions
}

export function getNextActionIndex(
  story: Story,
  currentState: StoryState,
  currentStoryIndex: number
): number {
  let nextStoryIndex = currentStoryIndex + 1

  if (story.actions.length === nextStoryIndex) {
    return nextStoryIndex
  }
  while (!validateFilter(story.actions[nextStoryIndex].filter, currentState)) {
    nextStoryIndex++
  }

  return nextStoryIndex
}

export function doAction(
  roomState: RoomState,
  story: Story,
  currentStoryIndex: number,
  selectedOption: StoryOption
): RoomState {
  roomState.connectedPlayers.forEach((player: Player) => {
    if (selectedOption.playerStateChange) {
      // add similar conditions and abilities logic here
      if (
        selectedOption.playerStateChange.allPlayers &&
        selectedOption.playerStateChange.allPlayers.newItems
      ) {
        player.inventory = player.inventory.concat(
          selectedOption.playerStateChange.allPlayers.newItems
        )
      }
    }
  })

  if (selectedOption.response) {
    roomState.history.push(selectedOption.response)
  }

  const lastActionBeforeNewOne = getActionByIndex(story, currentStoryIndex)
    .prompt
  roomState.history.push(lastActionBeforeNewOne)

  if (selectedOption.action) {
    const newState: StoryState = {
      ...roomState.storyState,
      ...selectedOption.action
    }
    roomState.storyState = newState
  }

  return roomState
}
