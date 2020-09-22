![tinylist](https://raw.githubusercontent.com/baggachipz/tinylist/master/src/assets/tinylist-yellow.svg)

A secure, anonymous, minimalist PWA checklists application.

* No advertisement or tracking
* Free to use and open source
* Does not require any registration
* Usable on any modern internet-connected device (but works offline!)
* Also installs as an app on your phone or tablet
* Secure and anonymous
* Share notes with others without exposing your data

Video description of the project:
https://tilvids.com/videos/watch/d0760bff-6e2a-4435-b056-766d03c85fe3

## Feature Roadmap
1. Squash bugs
2. ~~Undo delete of documents~~
3. ~~Alphabetical sort for checklists~~
4. ~~Markdown support for notes~~
5. Dark mode
6. Enhance PWA 'add to homescreen' functionality
7. True list view
8. Internationalization
9. ???

## Support If You're a Fan
If you like this project, please consider [supporting it](https://ko-fi.com/tinylist). I do not monetize the app and have to pay hosting costs.

## Tech Stack Employed (and shout-outs)
* [Quasar Framework](https://quasar.dev/)
* [Vue.js](https://vuejs.org/)
* [Vue-Draggable](https://github.com/SortableJS/Vue.Draggable)
* [PouchDB](https://pouchdb.com/)
* [CouchDB](http://couchdb.apache.org/)
* [markdown-it](https://github.com/markdown-it/markdown-it)

## Development
### Install the dependencies
```bash
npm install
```

### Install Quasar CLI ###
```bash
npm -g @quasar/cli
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build -m pwa
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

### Running the App on Docker
[Docker instructions](Docker.md) are available to run the app using docker-compose.

### Running your own database instance ###
[Instructions  here](https://github.com/baggachipz/tinylist/wiki/Configuring-CouchDB-for-use-with-TinyList) for installing and configuring your own CouchDB instance.