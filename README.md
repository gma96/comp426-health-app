# comp426-health-app
RESTful Web App: Class Project

# API Routing
For API routing we will be documenting using [RAML](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md/).
We will be using displayName property as the context of our routes.
```raml
#%RAML 1.0
title: 426 REST API
mediaType: application/json
version: v1
protocols: [ HTTP, HTTPS ]
baseUri: http://127.0.0.1:8080/api/{version}/

types:
  User:
    type: object
    properties:
      first_name: string
      last_name:  string
      birthdate:  date
      email: string
      password: string

/users:
  post:
    displayName: user.create

    description: Create a new user
    responses:
      200:
        body:
          application/json:
            type: User
          example: |
            {
              "meta": {"code": 200, "message": "User Created"}
              "data": [{
                  "resource": "user",
                  "_id": 12345,
                  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
                }]
            }
```
<br>

**Interacting With API Routes in the Frontend** <br>
You will need to import the rest-requestor lib and the RAML genrated API route
defintions (available is JS and JSON).
```javascript
/**
 * Action Constants (Assumes we are in frontend folder)
 * and you could import action functions with constants in that file
 **/
const { USER_SAVE } = require('./config/action_constants');
// Import reducers
const reducers = require('./config/reducers');
// Rest Requestor library
const Rest = require('../../libs/rest-requestor');
// Load JS route definitions
const api_route_map = require('../../backend/dist/config/routes');

// Load Routes
Rest.load(api_route_map);
// View route object in console
console.log(Rest.viewRoutes());

// Store
const store = createStore(reducers);


// Example route usage
Rest.routes.user.create({
  data: {
    first_name: 'Joe',
    last_name: 'Smith',
    birthdate: '1980-10-10',
    email: 'joe.smith@email.com',
    password: 'password'
  }
}).then(function(user) {
  let data = user.data;
  console.log(data);

  // Save to store (would normally be a function)
  store.dispatch({
    type: USER_SAVE
    data: {
      _id: data._id,
      token: data.token
    }
  });
}).catch(function(e){
  alert('Error Occurred');
  console.log(e);
});
```

