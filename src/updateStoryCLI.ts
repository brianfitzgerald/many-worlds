import * as AWS from "aws-sdk"

import { awsKeys } from "./secrets"
import { readFileSync } from "fs"
import brimblewood from "./stories/brimblewood"
import { storiesTableName } from "./actions/StoryDB"

AWS.config.update(awsKeys)
const documentClient = new AWS.DynamoDB.DocumentClient()

const storyName = process.argv[2]

const stories = [brimblewood]

const story = stories.find(s => s.name === storyName)

const storyJSONString = JSON.stringify(story)
const storyJSONObject = JSON.parse(storyJSONString)

documentClient.put(
  {
    TableName: storiesTableName,
    Item: storyJSONObject
  },
  (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Updated.")
    }
  }
)
