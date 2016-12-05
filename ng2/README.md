## Prerequisites
* Checkout
* Go to the `ng2` folder
* Install dependancies :
   ```
   $ npm install
   ```
* You will need a copy of `lucca-icons` in `node_modules` (the folder in `ng2`)
   * Use bower or download it from Github
* Build `ng2-select` :
   * Go to `ng2/node_modules/ng2-select`
   * Install node dependancies :
   ```
   $ npm install
   ```
   * Install typings :
   ```
   $ typings install
   ```
* Create LUI Website on IIS :
   * Binding : `localhost` on port `8080`
   * Source : `<lucca-ui path>/ng2/demo_dist`

## Src & dev workspace for lucca ui ng2 migration

- Write your sources and specs inside /src.
- Plug your component in /demo app, to see it live.

### To develop:
```
$ npm run watch
```
Then go to `http://localhost:8080/`.
### To test:
```
$ npm test
```

All other commands are visible inside the packages.json.