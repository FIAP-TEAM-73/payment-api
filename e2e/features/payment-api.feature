Feature: Payment API

  Scenario: Process payment with an invalid issueId
    Given the API endpoint is "/api/v1/payment/hook"
    And the request payload is:
      """
      {
        "issueId": "invalid-issue-id",
        "status": "rejected"
      }
      """
    When I send a POST request to the endpoint
    Then the response status should be 404
    And the response should contain:
      | field            | value                                                 |
      | friendlyMessage  | Payment with order ID invalid-issue-id does not exist |
      | errorMessage     | Resource not found!                                   |
