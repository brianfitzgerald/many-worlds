import * as AWS from "aws-sdk"

import { Story } from "../types/Story"

import brimblewood from "../stories/brimblewood"
import { awsKeys } from "../secrets"
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client"

export const storiesTableName = "midnight_sun-stories"

AWS.config.update(awsKeys)

const documentClient = new AWS.DynamoDB.DocumentClient()

export const getStory = (id: string) =>
  new Promise<Story>((resolve, reject) => {
    const params: DocumentClient.GetItemInput = {
      TableName: storiesTableName,
      Key: { id }
    }
    documentClient.get(
      params,
      (err: AWS.AWSError, data: DocumentClient.GetItemOutput) => {
        if (err) {
          reject(err)
        }
        const story = data.Item as Story
        resolve(story)
      }
    )
  })

export const getAllStories = () =>
  new Promise<Story[]>((resolve, reject) => {
    const params: DocumentClient.ScanInput = {
      TableName: "midnight_sun-stories"
    }
    documentClient.scan(
      params,
      (err: AWS.AWSError, data: DocumentClient.QueryOutput) => {
        if (err) {
          reject(err)
        }
        if (data.Count === 0) {
          reject()
        }

        const stories = data.Items as Story[]
        resolve(stories)
      }
    )
  })
