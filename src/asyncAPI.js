 export const specMock = `
asyncapi: '2.6.0'
id: 'urn:com:smartylighting:streetlights:server'
info:
  title: Streetlights API
  version: '1.0.0'
  description: |
    The Smartylighting Streetlights API allows you to remotely manage the city lights.

    ### Check out its awesome features:

    * Turn a specific streetlight on/off 🌃
    * Dim a specific streetlight 😎
    * Receive real-time information about environmental lighting conditions 📈

  termsOfService: http://asyncapi.org/terms/
  contact:
    name: API Support
    url: http://www.asyncapi.org/support
    email: support@asyncapi.org
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
tags:
  - name: root-tag1
    externalDocs:
      description: External docs description 1
      url: https://www.asyncapi.com/
  - name: root-tag2
    description: Description 2
    externalDocs:
      url: "https://www.asyncapi.com/"
  - name: root-tag3
  - name: root-tag4
    description: Description 4
  - name: root-tag5
    externalDocs:
      url: "https://www.asyncapi.com/"
externalDocs:
  description: Find more info here
  url: https://example.com
defaultContentType: application/json

servers:
  production:
    url: api.streetlights.smartylighting.com:{port}
    protocol: mqtt
    description: |
      Private server that requires authorization.
      Once the socket is open you can subscribe to private-data channels by sending an authenticated subscribe request message.

      The API client must request an authentication "token" via the following REST API endpoint "GetWebSocketsToken" to connect to WebSockets Private endpoints. For more details read https://support.kraken.com/hc/en-us/articles/360034437672-How-to-retrieve-a-WebSocket-authentication-token-Example-code-in-Python-3

      The resulting token must be provided in the "token" field of any new private WebSocket feed subscription: 
      '''json
      {
        "event": "subscribe",
        "subscription":
        {
          "name": "ownTrades",
          "token": "WW91ciBhdXRoZW50aWNhdGlvbiB0b2tlbiBnb2VzIGhlcmUu"
        }
      }
      '''

      '''elixir
      defmodule Hello do
        def world do
          IO.puts("hello")
        end
      end
      '''
    variables:
      port:
        description: Secure connection (TLS) is available through port 8883.
        default: '1883'
        enum:
          - '1883'
          - '8883'
    tags:
      - name: 'env:production'
    security:
      - apiKey: []
      - supportedOauthFlows:
        - streetlights:on
        - streetlights:off
        - streetlights:dim
      - openIdConnectWellKnown: []
  dummy-mqtt:
    url: mqtt://localhost
    protocol: mqtt
    description: |
      Private server

      '''csharp
      using System;

      namespace HelloWorld
      {
        class Program
        {
          static void Main(string[] args)
          {
            Console.WriteLine("Hello World!");    
          }
        }
      }
      '''
    bindings:
      mqtt:
        clientId: guest        
        cleanSession: false
        keepAlive: 60
        bindingVersion: 0.1.0
        lastWill:
          topic: smartylighting/streetlights/1/0/lastwill
          qos: 1
          message: so long and thanks for all the fish
          retain: false
  dummy-amqp:
    url: amqp://localhost:{port}
    protocol: amqp
    description: dummy AMQP broker
    protocolVersion: "0.9.1"
    variables:
      port:
        enum:
          - '15672'
          - '5672'
  dommy-kafka:
    url: http://localhost:{port}
    protocol: kafka
    description: dummy Kafka broker
    variables:
      port:
        default: '9092'

channels:
  smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured:
    x-security:
      $ref: '#/components/securitySchemes/supportedOauthFlows/flows/clientCredentials'
    description: The topic on which measured values may be produced and consumed.
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    servers:
      - production
      - dommy-kafka
    subscribe:
      summary: Receive information about environmental lighting conditions of a particular streetlight.
      operationId: receiveLightMeasurement
      externalDocs:
        description: Find more info here
        url: https://example.com
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/lightMeasured'
      bindings:
        mqtt:
          qos: 1
          bindingVersion: 0.1.0
        http:
          type: request
          method: GET
          query:
            type: object
            required:
            - companyId
            properties:
              companyId:
                type: number
                minimum: 1
                description: The Id of the company.
            additionalProperties: false

  smartylighting/streetlights/1/0/action/{streetlightId}/turn/on:
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    servers:
      - production
      - dummy-amqp
    publish:
      operationId: turnOn
      security:
        - supportedOauthFlows:
          - streetlights:on
      externalDocs:
        description: Find more info here
        url: https://example.com
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/turnOnOff'

  smartylighting/streetlights/1/0/action/{streetlightId}/turn/off:
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    publish:
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/turnOnOff'

  smartylighting/streetlights/1/0/action/{streetlightId}/dim:
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    servers:
      - production
      - dummy-amqp
    publish:
      operationId: dimLight
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/dimLight'

components:
  messages:
    lightMeasured:
      messageId: lightMeasured Message ID
      name: lightMeasured
      title: Light measured
      summary: Inform about environmental lighting conditions for a particular streetlight.
      contentType: application/json
      correlationId:
        $ref: "#/components/correlationIds/sentAtCorrelator"
      externalDocs:
        url: "https://www.asyncapi.com/"
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: "#/components/schemas/lightMeasuredPayload"
      bindings:
        mqtt:
          bindingVersion: 0.1.0
      examples:
        - headers:
            my-app-header: 12
          payload:
            lumens: 1
            sentAt: "2020-01-31T13:24:53Z"
        - headers:
            my-app-header: 13
        - payload:
            lumens: 3
            sentAt: "2020-10-31T13:24:53Z"
      x-schema-extensions-as-object:
        type: object
        properties:
          prop1:
            type: string
          prop2:
            type: integer
            minimum: 0
      x-schema-extensions-as-primitive: dummy
      x-schema-extensions-as-array: 
        - "item1"
        - "item2"
    LwM2mOjbects:
      payload:
        type: object
        properties:
          objectLinks:
            type: string
        example:
          objectLinks: "lwm2m=1.1, </0/0>, </1/1>;ssid=1, </2>, </3/0>"
    turnOnOff:
      name: turnOnOff
      title: Turn on/off
      summary: Command a particular streetlight to turn the lights on or off.
      payload:
        $ref: "#/components/schemas/turnOnOffPayload"
      headers: 
        type: object
        properties:
          $ref: '#/components/schemas/streamHeaders'
    dimLight:
      name: dimLight
      title: Dim light
      summary: Command a particular streetlight to dim the lights.
      correlationId:
        $ref: "#/components/correlationIds/sentAtCorrelator"
      externalDocs:
        url: "https://www.asyncapi.com/"
      tags:
        - name: operation-tag1
          externalDocs:
            description: External docs description 1
            url: https://www.asyncapi.com/
        - name: operation-tag2
      payload:
        $ref: "#/components/schemas/dimLightPayload"
      headers:
        $ref: "#/components/schemas/streamHeaders"
      examples:
        - headers:
            my-app-header: 12
          payload:
            percentage: 80
        - headers:
            my-app-header: 13
        - payload:
            percentage: 55
  schemas:
    lightMeasuredPayload:
      type: object
      properties:
        lumens:
          type: integer
          description: |
            The total luminous flux, in lumens, emitted by the streetlight.
        sentAt:
          type: string
          format: date-time
          description: The timestamp when the data was measured.
    turnOnOffPayload:
      type: object
      properties:
        action:
          type: string
          enum:
            - on
            - off
    dimLightPayload:
      type: object
      properties:
        percentage:
          type: integer
          description: The percentage of light to be emitted by the streetlight.
    streamHeaders:
      type: object
      properties:
        my-app-header:
          type: integer
    correlationIds:
      sentAtCorrelator:
        description: Sent at correlation id
        type: string
        format: date-time
        example: "2020-01-31T13:24:53Z"
  operationTraits:
    kafka:
      description: Kafka operation trait
      x-traitExtensions: ""
  parameters:
    streetlightId:
      description: A unique identifier for the streetlight.
      schema:
        type: string
        pattern: '^[a-z0-9]+$'
    correlationId:
      description: A unique identifier to correlate requests.
      schema:
        type: string
        format: uuid
  securitySchemes:
    supportedOauthFlows:
      type: oauth2
      flows:
        clientCredentials:
          authorizationUrl: 'https://streetlights.smartylighting.com/oauth2/auth'
          tokenUrl: 'https://streetlights.smartylighting.com/oauth2/token'
          scopes:
            streetlights:on: Turn lights on
            streetlights:off: Turn lights off
            streetlights:dim: Dim lights
  security:
    - supportedOauthFlows: []
    - openIdConnectWellKnown: []

 `