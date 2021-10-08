# Mybrary Web Application

Mybrary is a full-stack web application that showcases an online personal library. 
![Alt Text](https://github.com/vicentefb/Mybrary/blob/master/public/demo.gif)

### Build

```sh
git clone https://github.com/vicentefb/Mybrary.git
cd Mybrary
npm install
npm run devStart
```
Go to **localhost:3000**

### Tech

Following the MVC (Model, View, Controller) pattern, Mybrary uses some open source projects to work properly:

* HTML and CSS for structuring and styling the web app
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework 
* [MongoDB] - database
* [Heroku] - cloud platform to run applications


   [MongoDB]: <https://www.mongodb.com/es>
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [Heroku]: <https://www.heroku.com/>

### Folder structure
```
.
├── model                   # Handles data logic and interacts with database
├── public                  # Contains CSS stylesheets
├── routes                  # Handles request flow
├── views                   # Handles data presentation and it is dynamically rendered
├── .gitignore                  
├── README.md
├── package-lock.json
├── package.json
└── server.js
```
