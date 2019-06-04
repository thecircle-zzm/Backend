# Backend

## Enviroment Variables
- `MONGO` (config: `mongodb://localhost/mango`)
- `PORT` (config: `8080`)

## Folder Structure
```
.
├── config
│   └── config.json
├── controllers
│   └── example.controller.js
├── routes
│   └── example.routes.js
│   └── routes.js
├── utils
│   ├── database.util.js
│   └── extension.util.js
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Coding Style

### Language
- All variables, functions and comments should be in English
- All documentation for the API should be in English

### Code
- All variables, functions and comments should be in `lowerCamelCase`
- Make use of promises instead of callbacks when useful
- Make use of fat arrow functions, `function()` is deprecated

### Files & Structure
- Use the folders for config, routes, utils and controllers respectively. Names of folders are plural (except for config).
- Name files `name.type.extension`. For example `user.routes.js`
- Use the singular forms of entities. For example `user`, `person`, `student`

### Routing
- Declare routing in `routes/routes.js` by declaring a controller for the parent link (`/users`). 
- Create a corresponding routing file for the children (`routes/user.routes.js`).
