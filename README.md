# mlc-translate-server


`mlc-translate-server` is a minimal server which stores translations. It is designed to work with [mlc-angularjs-translate](https://github.com/moonlight-coding/mlc-angularjs-translate).

## How to use it

This server is **supposed to be accessible only for admins/translators** on your website.

This server is **not designed to be accessible from any user**. You should implement a proxy system from your website to cache the translations fetched via `/query`.

Example:
- I assume your website consist of 2 projects `admin` and `website`
- At each deployment you can use `/query` to download both translations
- Store the translations in files, 1 translation file per locale per group per project. For example:
  - `translations/admin/group1/locale1.json`
  - `translations/website/login/en_GB.json`
  - `translations/website/login/fr_FR.json`
  - `translations/website/signup/en_GB.json`
- Store the timestamps in `translations/admin_timestamps.json` and `translations/website_timestamp.json`
- Write a POST endpoint `/query` in your backend, which takes the parameters `locale`, `project` and `group`, and returns the content of the file `translations/$project/$group/$locale.json`.
- Now you can add custom rules, to forbid specific users to fetch some translations groups / projects:
  - only admin users should fetch the `/admin` translation groups, excepted the `login` group available for anyone, else you cannot translate the login page ..
  - you could store the translations of your emails in a group `emails`, and it should be accessible only from the backend, not on the frontend.

An upgrade could be to update the translations:
- periodically, using cron for example
- at each saved translation: this server could make a POST request on a specific endpoint of your backend, to inform it that there is a new translation available in a specific project/group.

## Translation definition

A translation is made of several fields:
- `locale`: the locale of that translation (en_GB, fr_FR ...)
- `project`: in your website, you may have several distinct areas. You may wanna separate them, if so, use different projects names.
- `group`: in a project, the translation keys are stored in groups too. Helps to structure the translations inside a single project.
- `key`: the key to translate.
- `value`: the translation

Note: The database schema is clearly optimizable.

## Features

- Stores the translations in a sqlite3 database.
- Each translation is stored by default, in order to show the different versions of a single translation through the time
- Has api endpoints to:
  - create a translation
  - remove a translation
  - make a query to fetch the translations which interest us (can select a locale, a project, a group etc...), with or without the history of each translation. Each group can be combined with its timestamp, to only fetch the groups that have expired.
- stores the creation date in the translations for cache support

## TODO

- store in a cache file the timestamps, currently the timestamps are rebuilt by using the endpoints of the API.

## Installation

### Via Git

```
git clone https://github.com/moonlight-coding/mlc-translate-server.git
cd mlc-translate-server
npm i
# if you wanna use `mlc-translate-server` command
sudo npm link
```

### Via NPM

`npm install --save mlc-translate-server`

## Usage

```
mlc-translate-server [config_path]
```

### Git installation

By default, you can create a `config.js` in this folder, use `config.example.js`. The command `mlc-translate-server` uses that default `config.js`.

### NPM installation

First, you need to create the config file from `config.example.js`. I suggest to name it `mlc-translate-server.config.js`.

You can run it via `./node_modules/.bin/mlc-translate-server mlc-translate-server.config.js`.

Another way is to add in `package.json` a script command to do it:

```
"scripts": {
  "translate-server": "mlc-translate-server mlc-translate-server.config.js"
},
```

Doing so, you just need to use `npm run translate-server` to start the `mlc-translate-server`.

