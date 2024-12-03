import { Given, When, Then, type IWorld } from '@cucumber/cucumber'
import axios from 'axios'
import assert from 'assert'

interface IStep {
  endpoint: string
  response: Record<string,any>
}

Given('the API endpoint is {string}', function (this: IWorld<IStep>, apiEndpoint: string): void {
  this.parameters.endpoint = `http://localhost:9003${apiEndpoint}`
})

Given('the request payload is:', function (payload: string): void {
  this.requestPayload = JSON.parse(payload)
})

When('I send a POST request to the endpoint', async function (this: IWorld<IStep>): Promise<void> {
  try {
    this.parameters.response = await axios.post(this.parameters.endpoint, this.requestPayload, {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      this.parameters.response = error.response as any
      return
    }
    throw error
  }
})

Then('the response status should be {int}', function (this: IWorld<IStep>, statusCode: number): void {
  const { status } = this.parameters.response
  assert.strictEqual(status, statusCode, `Expected status ${statusCode}, but got ${status}`)
})

Then('the response should contain:', function (this: IWorld<IStep>, dataTable: any): void {
  const responseBody = this.parameters.response.data
  dataTable.hashes().forEach((field: { field: string, value: string }) => {
    assert.strictEqual(
      responseBody[field.field],
      field.value,
            `Expected ${field.field} to be "${field.value}", but got "${responseBody[field.field]}"`
    )
  })
})
