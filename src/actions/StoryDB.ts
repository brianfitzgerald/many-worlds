import * as AWS from "aws-sdk"

import { Story } from "../types/Story"

import brimblewood from "../stories/brimblewood"
import { awsKeys } from "../secrets"
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client"

AWS.config.update(awsKeys)

const documentClient = new AWS.DynamoDB.DocumentClient()

export const tableNames = {
  stories: "midnight-sun-stories"
}

export const getStory = (id: string) =>
  new Promise<Story>((resolve, reject) => {
    const params: DocumentClient.GetItemInput = {
      TableName: tableNames.stories,
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

export const getFeaturedStories = () =>
  new Promise<Story[]>((resolve, reject) => {
    const params: DocumentClient.ScanInput = {
      TableName: tableNames.stories
    }
    documentClient.scan(
      params,
      (err: AWS.AWSError, data: DocumentClient.QueryOutput) => {
        if (err != null) {
          reject(err)
        }

        const stories = data.Items as Story[]

        resolve(stories)
      }
    )
  })

export const getMyStories = (userId: string) =>
  new Promise<Story[]>((resolve, reject) => {
    const params: DocumentClient.ScanInput = {
      TableName: tableNames.stories,
      FilterExpression: "author = :author",
      ExpressionAttributeValues: {
        ":author": userId
      }
    }
    documentClient.scan(
      params,
      (err: AWS.AWSError, data: DocumentClient.ScanOutput) => {
        if (err != null) {
          reject(err)
        }

        if (!data.Items) {
          resolve([])
        }

        const stories = data.Items as Story[]
        resolve(stories)
      }
    )
  })

export const updateStory = (story: Story, publish: boolean) =>
  new Promise((resolve, reject) => {
    const storyToPublish = story
    storyToPublish.published = publish
    const params: DocumentClient.PutItemInput = {
      TableName: tableNames.stories,
      Item: storyToPublish
    }
    documentClient.put(
      params,
      (err: AWS.AWSError, data: DocumentClient.QueryOutput) => {
        if (err) {
          reject(err)
        }
        resolve()
      }
    )
  })
