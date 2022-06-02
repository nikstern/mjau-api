# Mjau API

Welcome to the Mjau cat picture API.

> **Mjau**: The Swedish onomatopoeia for the sound a cat makes. Similar to the English "meow" and pronounced the same.

## Running with Docker

To run the application via Docker, make sure Docker is installed on your system then run:

`docker run -p 4000:4000 nikstern/mjau`

The server should now be running and have its endpoints accessible via:

`0.0.0.0:4000`

### Setting Up Postman

On a local client of Postman, we can import a collection of useful preset requests using the following URL:

`https://www.getpostman.com/collections/721f4063d15f2bb8d619`

To import open a workspace and click Import in the upper right corner. Then click the link tab and paste the link above inside.

Note: Sometimes Postman seems to struggle to use the images saved in the collection. Upload your own images if there are any saved in the collection.

## Non-Authenticated Routes

### Register

We are able to register for a new Mjau API account by posting to:

`0.0.0.0:4000/register`

The endpoint expects a body containing an email and a password:

```json
{
  "email": "nik@gmail.com",
  "password": "BinkyBinkyBinky"
}
```

On successful account creation a body containing the created username, the encrypted password, and a JWT token will be returned. Example response:

```json
{
  "email": "nik@gmail.com",
  "password": "$2a$10$asCgWzTd21UriVbvD.kb9O5ztWwnNlxYeg8gVXkfn6iZbLG0uWLwu",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pY2tAY29kZWNhZGVteS5jb20iLCJpYXQiOjE2NTQxMDg0NTEsImV4cCI6MTY1NDExNTY1MX0.4ki3WO9VJBv8331me73Br2LVlYyhf6_4ZItzoohut1U"
}
```

#### Errors

Not providing an email and password will result in a 400 status response.

Trying to register an account that already exists will result in a 409 status response.

### Login

We are able to login to an existing Mjau API account by posting to:

`0.0.0.0:4000/login`

The endpoint expects a body containing an email and a password:

```json
{
  "email": "nik@gmail.com",
  "password": "BinkyBinkyBinky"
}
```

On successful login a body containing the created username, the encrypted password, and a JWT token will be returned. Example response:

```json
{
  "email": "nick@codecademy.com",
  "password": "$2a$10$xsv0gXAbLz1F4yiH5OM17uFZSnbUKy0K.CbTGZXWHPw7iAKS3D0E.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pY2tAY29kZWNhZGVteS5jb20iLCJpYXQiOjE2NTQxMDcyMTcsImV4cCI6MTY1NDExNDQxN30.ifOVek7VTGPoxKPuC_A8AzLq01PgM0hqgX4YhR6oNog"
}
```

### Errors

Login will reject a non existent email or an invalid password with a response of 400. This is intentional to prevent people from knowing whether an email has signed up for an account or not.

## Authenticated Routes

The token from either registering or logging in will expire after 2 hours. Note that the user information will reset each time the server restarts, but the tokens will continue to work until they expire.

Authentication is handled by setting the header `x-access-token` to the token value provided by the `register` or `login` routes.

The remainder of the endpoints are authenticated routes.

If they are attempted to be accessed without an authentication token they will return a 403 status code.

If they are attempted to be accessed with an invalid token, the endpoint will return a 401 status code.

### Setting the token in Postman

The token value can be set via the `{{JWT}}` variable in the Headers section of the Postman requests under `x-access-token`. Once set, it should work for every authenticated endpoint. Just use the `token` value, without quotes, from a successful `register` or `login` request.

### Create a Cat

We are able to create a cat by sending an image in the `form-data` of a POST or PUT request to:

`0.0.0.0:4000/cats/:name` where `:name` is the name of the cat you would like to store the image under. For example, creating an entry for a cat named "Stinky" would use the url `0.0.0.0:4000/cats/Stinky`.

The image must be stored under the field `image` in the form data.

On a successful response, the endpoint will return a message indicating the name of the cat and the original name of the image file. Note that the file is actually stored under a different name in order to prevent conflicts. The response code will be 201.

```json
{
  "message": "Added a cat named Tiger with an image Jerry.png"
}
```

#### Errors

Making a POST request where the name of the cat already exists in the system will return a 400 status and a message indicating that the cat already exists.

Storing multiple cats (with different names) with the same image/image name will not result in a problem.

Missing an image file will result in a 400 error. This is also true for files that do not have the extension `.png`, `.jpg`, or `.jpeg`.

### Get a Cat

We are able to retrieve a cat image by sending a GET request to:

`0.0.0.0:4000/cats/:name` where `:name` is the name of the cat you would like to retrieve the image of. For example, retrieving the picture of a cat named "Stinky" would use the url `0.0.0.0:4000/cats/Stinky`.

On a successful response, the endpoint will return a buffer containing the bytes of the cat image within the response's `body`. In Postman, the image will render. In curl its not very pretty. The status code will be 200 on a successful response.

#### Errors

Trying to access a cat who is not stored will result in a 404 error.

### List Cats

We are able to retrieve a list of the names of the cats stored in the system by sending a GET request to:

`0.0.0.0:4000/cats/`

This will return an array of names in the body of the response. For example, if no cats have been added, the body will contain `[]`. For multiple cats, Jerry and Berry, the body would contain `[Jerry, Berry]`. The order of the cats in the list is not necessarily the order in which they were added. The status for a successful request will be 200.

### Errors

Outside of authentication errors, this has no error conditions.

### Update a Cat

We can update the image associated with an existing cat by sending an image in the `form-data` of PUT request to:

`0.0.0.0:4000/cats/:name` where `:name` is the name of the cat you would like to update the image of. For example, updating the entry for "Stinky" would use the url `0.0.0.0:4000/cats/Stinky`.

The image must be stored under the field `image` in the form data.

On a successful response, the endpoint will return a message indicating the name of the cat and the original name of the new image file. Note that the file is actually stored under a different name in order to prevent conflicts. The response code will be 200.

```json
{
  "message": "Binky now has the image Moe.png"
}
```

#### Errors

Missing an image file will result in a 400 error. This is also true for files that do not have the extension `.png`, `.jpg`, or `.jpeg`.

### Delete a Cat

We can delete a cat from the system by sending a DELETE request to:

`0.0.0.0:4000/cats/:name` where `:name` is the name of the cat you would like to delete. For example, updating the entry for "Binky" would use the url `0.0.0.0:4000/cats/Binky`.

On a successful response, the endpoint will return a message indicating the name of the cat deleted. Note that the file is actually stored under a different name in order to prevent conflicts. The response code will be 200.

#### Errors

Attempting to delete a cat that doesn't exist will result in a 404 error.

## Running Tests

You can also interact with the application via the command line by running:

```
docker run -it --entrypoint /bin/sh nikstern/mjau
```

At this point you should be able to run:

```
npm run test
```

To see the output of the tests for the application. It should look like:

```
Mjau Authentication Tests
    ✔ /cats/* Rejects all data endpoints without Authorization with 403
    ✔ /cats/* Rejects all data endpoints with an invalid token with 401
    ✔ /register POST rejects signup with missing emails or passwords with 400
    ✔ /register POST allows valid user signup with 201 (95ms)
    ✔ /register POST rejects duplicate account creation with 409 (74ms)
    ✔ /login POST allows valid user login with 200 (145ms)
    ✔ /login POST rejects wrong password with 400 (146ms)
    ✔ /login POST rejects wrong user with 400 (74ms)

  Mjau DELETE Tests
    ✔ /cats/Binky DELETE with no Binky gets 404
    ✔ /cats/Binky DELETE with Binky deletes Binky with 200
    ✔ /cats/Binky DELETE can't delete Binky twice with 404
    ✔ /cats/Jerry DELETE with Jerry, Binky, and Moe has Binky and Moe remain (121ms)

  Mjau Get Tests
    ✔ /cats/Binky GET with no Binky gets 404
    ✔ /cats/Binky GET with Binky gets Binky image with 200
    ✔ /cats/:id GET with 3 cats gets each cat with 200 (73ms)
    ✔ /cats GET with no cats returns empty list [] with 200
    ✔ /cats GET with just Binky gets just [Binky] with 200
    ✔ /cats GET with two cats gets [Binky, Jerry] with 200

  Mjau POST Tests
    ✔ /cats/Binky POST with no Binky makes Binky and gets 201
    ✔ /cats/ POST with no name field gets 404
    ✔ /cats/Binky POST with a text file image gets 400
    ✔ /cats/Binky POST with Binky already gets 400

  Mjau PUT Tests
    ✔ /cats/Binky PUT with no Binky adds Binky with 201
    ✔ /cats/Binky PUT with Binky already updates Binky with Jerry picture with 200 (54ms)
    ✔ /cats/ PUT with no name gets 404
    ✔ /cats/Binky PUT with no image gets 400
    ✔ /cats/Binky PUT with a text file gets 400

  27 passing (1s)

```

You should be able to get a pretty good idea of how the application is supposed to work and how you can use it by reading the tests in the `/tests/` folder.

## Design Decisions

### Actual Implementation

When designing this application I tried to make the architecture as simple as necessary to accomplish the Cat API requirements. The design also needed to be achievable without consulting anyone. Persistent, concurrency safe, or cloud storage was not required, nor the handling of removal of old files. Given these constraints these were the architectural components I decided on:

#### Javascript/Typescript:

Javascript is what I am most comfortable with when it comes to API implementation, Typescript assisted in catching errors.

#### Backend/Routes/API Endpoints:

Express/Node (seemed like the simplest choice for a Javascript backend with no frontend)

#### Storage:

Local filesystem/Multer. This seemed to be the simplest storage mechanism to use. I _think_ I could've gotten away with not using the Multer middleware, but it was recommended by various sources. It did seem to simplify aspects of file naming and filtering. At a certain point I figured I could get away with not storing the images at all other than in memory, but I couldn't justify the memory inefficiency.

#### Authentication:

JWT. I encountered this during the Hackathon as what we use in Codecademy's codebase, so I really wanted to learn it. Also found it to be simple to implement. Authentication was implemented by custom middleware.

#### "Database":

I used maps for storing the user information as well as the cat name/filename. Given that I didn't need to persist file association information I just used a map. This provided constant time access and an easy interface for get, add, update, delete, list operations. I made a Cat model object though I could've just stored strings, since I felt like that was more extensible.

#### Testing:

Mocha and Chai. I love Mocha and Chai for writing tests, I like being able to read how my code is supposed to work, and think it functions pretty effectively as documentation when you read the test implementations and the output gives a pretty good idea of the routes/response codes.

### Scalable Cloud Implementation

Were this an application designed for scale I would have approached this completely differently. In my last job I created APIs in the following fashion:

#### Serverless API:

YAML declarations to quickly put up and tear down all of the following architecture.

#### Compute

Lambda: Automatic scaling for Backend implementation/handling of almost all infrastructure concerns. Furthermore each endpoint functions completely independently and can't take down the others.

#### Storage

S3: File Storage

#### Database

Dynamodb: Associating cat information to image locations (Could do this with just S3 file pathing but in case I wanted to add additional cat information)

#### Routing

API Gateway: To route URL endpoints to appropriate Lambda functions

#### Authentication

IAM/Cognito

Given the time constraints, the simple requirements, the need to be able to share the application with my coworkers without much hassle, I decided to not go with that approach.

## Areas for Improvement

There are several areas where I would like to see improvement.
Overall many of these areas stemmed from being outside of my typical set of technologies, not collaborating with others, and being limited on time.

### Error Handling for Multer:

I was not very familiar with using Multer for file storage as I would normally use S3. I struggled to handle file handling errors coming from the multer middleware. With more time I would have added some additional error handling callbacks.

### Testing

I think that overall I created a pretty robust set of tests given the time constraints and the takehome situation. If I were doing this in a professional environment I likely would have randomized much more of the test inputs, and would have reset the user pool at the end of each test similar to what I did for the image store.

I would also have likely tried to simplify the amount of assertions happening in each unit test, and had more tests covering many simple aspects of the code. While many of my tests started out as unit tests, as I made the API more complex, many of them became integration tests because the different API pieces allowed me to more throughly test each other piece.

Also I would have liked to do more Test Driven Development throughout the project, but I did often switch between testing code and development code rather than testing at the end.

### Seperation of Concerns, Modularity, Extendability

Given more time and a production project I would have worked to reduce the amount of logic within each function of the controller. That and testing I think are where I have the most logic, everything else is pretty small and separated.

## Overall Reflections

This was a lot of fun, I missed building things.
