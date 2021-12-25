# Image processing API

This is a simple endpoint that accepts height, width, and filename (one of the files that exist in assets/images), then return with a newly resized image, check the API reference section to see how to use it.

## Installation

Install my-project with npm

```bash
  npm install
  or
  yarn
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/HagarAyad/image_processing_API.git
```

Go to the project directory

```bash
  cd image_processing_API
```

Install dependencies

```bash
  npm install
  or
  yarn
```

Start the server

```bash
  npm run start
  or
  yarn start
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
  or
  yarn test
```

## API Reference

#### Get all items

```http
  GET /image?fileName=${fileName}&height=${height}&width=${width}
```

| Parameter  | Type     | Description                                                     |
| :--------- | :------- | :-------------------------------------------------------------- |
| `fileName` | `string` | **Required**. one of the file names that exist in assets/images |
| `height`   | `number` | **Required**. height of a desired resized image                 |
| `width`    | `number` | **Required**. width of a desired resized image                  |
