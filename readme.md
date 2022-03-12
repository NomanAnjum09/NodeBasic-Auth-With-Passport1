
##  Program uses passport.js for authentication and authorization

### Some DEPENDECIES:

#### Run command "npm install" to install saved dependancies

### Install Application Dependencies with command "npm install"

## Working:

 1)User can register himself using http://localhost:4000/add-user
    Body:{
    "FullName":"Hello",
    "Email":"bcsd@gmail.com",
    "Gender":"Male",
    "DateOfBirth":"2014-04-03",
    "Password":"StrongPassword",
    "Scope":1
    }
    "Scope" variable is setted on front considering Role of user. Scope 1 means user has admin scope hence user can use /get-all-users api, no other user can get data from this api
 
 2) Admin can fetch details of all users using  http://localhost:4000/get-all-users
 
 3) Users must use http://localhost:4000/signin api to get their respective tokens.


    body:{
    "Email": "abcd@gmail.com",
    "Password": "StrongPassword"
}
Token obtained in response should be used in Headers of other requests as (Authorization : Bearer xxxxxxx)

 4) Users can use http://localhost:4000/edit-user to edit their details, 
    body:
    {
    "FullName":"HelloWorld" //updated Data here
}

5) Users can use http://localhost:4000/get-user/

There are some extra Routes to get a specific user info or delete a user
