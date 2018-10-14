# User Service
This is the user microservice. It will be in charge of the users CRUD, as well as reseting the password.

# This service should allow inbound HTTP requests on port 8087

## Admitted Requests

- New user:
> POST /user
```javascript
{
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  password: string
}
```

> Response:
```javascript
{
    user: user_object, 
    Error: string (default: "")
}
```

- Update user (all fields optional):
> PUT /user
```javascript
{
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  password: string
}
```

> Response:
```javascript
{
    user: user_object, 
    Error: string (default: "")
}
```

- Reset Password:
> GET /user/reset-password
```javascript
{
    "email": "string"
}
```
> Response:
```javascript
{
    Error: string (default: "")
}
```


- New Session (log in):
> POST /user/login
```javascript
{
    email: string,
    password: string
}
```

> Response:
```javascript
{
    token: string,
    user: user_object,
    Error: string (default: "")
}
```

- Delete Session (log out):
> POST /user/logout
```javascript
{}
```

> Response:
```javascript
{
    Error: string (default: "")
}
```

- Get User's channel subscriptions:
> GET /user/subscriptions
```javascript
{}
```

> Response:
```javascript
{
    channels: [channel_object]
    Error: string (default: "")
}
```

# Things to note:
- Given that OneSignal can make notification based on the tags the user makes, this could be a way of working with notifications. Just tag on which channels the user has subscribed.
- But on every new subcription, there will have to be a way of associating OneSignal's device_id to the user. This must be handled in this microservice.