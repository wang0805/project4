React boilerplate with ES2015, Express.js, and Webpack

# Fxchange Social

Fxchange Social is a different concept from its predecessor Fxchange whereby it focuses more on the social aspect. The problem statement is that the regular people like you and me has little or no alternatives other than to use money changers as a means to get foreign currency. The social aspect aims to match people with opposing needs and USDSGD currency pair is being used as an example for this project.

This project also aims to get a personal exposure to different features such as google maps API as well as socket.io and also built purposely and entirely on ReactJs.

### Demo

You can see how the web application works below:

![GIF](https://github.com/wang0805/project4/blob/master/src/assets/04.gif)

[Link to Application](https://sheltered-badlands-12857.herokuapp.com)

## Tools Being Used

* React (v16)
* Express.js (v4) as production and development server
* Webpack 4 (production and development configurations)
* SCSS support (+ sanitize.css included)
* ES2015+
* [React Router](https://reacttraining.com/react-router/) - Declarative routing for React
* [Material-Ui](https://material-ui.com/) - React components that implement Google's Material Design
* [nodeJS](https://nodejs.org/en/) - backend Javascript
* [Postgresql](https://www.postgresql.org/) - Object-relational database system
* [Socket.Io](https://socket.io/) - Handle real-time updating of orders and chatroom

### Development Roadmap

* Entire application is meant to be a single page application whereby different components of the app are being rendered separately by ReactJs when called upon
* Authentication was done initially in Auth0 (check groceryList repo) but afterwards changed to using normal SHA256 hashing so as to have a more hollistic application of react routers
* After a user sign up and login, he/she is automatically greeted by a Map with green and red markers whereby green represents buy orders and red represents sell orders of other users. Prices are always marked at market mid price which users can calculate the equivalent amount at the currentPrice component on the right hand side
* Should the user be happy with other user(s) orders, they can click to chat with them to arrange for a meet-up via the Map icons
* Note that chat records are not being stored into database (as it is meant for a socket.io practice but this could be done by calling fetch on the chat msg API after creating an Express route)
* Users can add orders (which reflects in real-time) and cancel orders which affects both changes in state and the database.

## Author(s)

* Wenhao Wang

## Features

* preconfigured eslint and Prettier code formatter
* React Hot Loader
* Linux/MacOS/Windows

## Usage

### Make sure you have nodemon installed globally

```
npm install -g nodemon
```

### Installation

```bash
git clone https://github.com/wang0805/project4
cd project4
npm install


# remove boilerplate git references
rm ./.git
```

### Scripts

```bash
# run development mode
npm run dev

# run production mode
npm run build
npm start

# run prettier
npm run prettier

# run lint
npm run lint

# run on a different port
HTTP_PORT=3001 npm run dev
```

## Credits

Webpack derived from git@github.com:antonfisher/react-express-webpack.git

## License

MIT License. Free use and change.
