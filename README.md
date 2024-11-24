# AsyncPI Renderer Standalone Bundle Study Project

## Description

This project is a JavaScript template that uses Parcel as a bundler and includes dependencies such as `@asyncapi/react-component` and ESLint. The project also includes an example of using the `@asyncapi/react-component` library to render an AsyncAPI specification.


**NOTE:** This project is a proof-of-concept and learning tool for using AsyncPI Renderer as a standalone bundle. It is not intended for production use.

**Feel free to fork and experiment:** If you'd like to try out AsyncPI Renderer Standalone bundle for yourself, you're welcome to fork this repository and use it as a starting point for your own experiments.

## Features

* Uses Parcel as a bundler
* Includes `@asyncapi/react-component` library for rendering AsyncAPI specifications
* Uses ESLint for code linting
* Includes a basic example of rendering an AsyncAPI specification

## Installation

To install the project dependencies, run the following command:
```bash
npm install
```

## Usage

To start the development server, run the following command:
```bash
yarn install
```
This will start the Parcel development server and make the application available at http://localhost:1234.

## Running the Local Server

Note: We do not have a dedicated server for this project. However, you can use the `http-server` command to serve the files locally and fetch `specs.yaml`.

To do this, follow these steps:

1. Install the required dependencies, including CORS:
 ```bash
npm install cors
```
2. Open a terminal and run
```bash
 http-server -p 8000 --cors
``` 
3. To fetch `specs.yaml`, you can make a GET request to `http://localhost:8000/src/specs.yaml`

This will allow you to access the files locally and fetch `specs.yaml` without needing a dedicated server.

## Contributing
Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.

License
None

Acknowledgments
This project uses the following third-party libraries:

@asyncapi/react-component
parcel
eslint
babel-eslint

~ Sarah