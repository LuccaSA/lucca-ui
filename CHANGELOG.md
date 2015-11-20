# Change log

## 2.0.1 - not released yet

### Breaking changes
none

### New features
 - [#70](https://github.com/LuccaSA/lucca-ui/issues/70) - luid-timespan supports min/max attributes
 - [#71](https://github.com/LuccaSA/lucca-ui/issues/71) - luid-daterange the popover closes when clicking outside the popover


### Resolved issues


## 2.0.0 [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.0)

### Breaking changes
 - migration to sass due to a missing feature in less
 - removed dependency to bootstrap.css - now having bootstrap.css in your page will break the nguibs plugin.
 - [#25](https://github.com/LuccaSA/lucca-ui/issues/25) - changed luifDuration arguments to take `mainUnit` and `precision` and not `format`. See the [demo page](http://luccasa.github.io/lucca-ui/filters.html#luifDuration) for more info

### New features
 - added the directive luid-user-picker. only available in distribution /dist/custom/lucca-ui-spe.js. demo page [here](http://luccasa.github.io/lucca-ui/lucca-spe.html)
 - [#31](https://github.com/LuccaSA/lucca-ui/issues/31) - support for popover-title
 - [#46](https://github.com/LuccaSA/lucca-ui/issues/46) - nguibs-modal can have a specific prefix defined in themes
 - The `nguibs-` class prefix for nguibs elements can now be changed (and removed!) through theming
 - [#26](https://github.com/LuccaSA/lucca-ui/issues/26) - added a directive luid-daterange see below for detailed features
 - luid-timespan - added a parameter `mode` to tell if the ng-model is a `timespan` (default) or a `moment.duration`
 - visibilty classes to affect `display` and `opacity`. `hidden`, `show` affect display ; `invisible`, `faded`, `faded lightly` and `faded stringly` affect opacity and visibility.

### Resolved issues
 - [#35](https://github.com/LuccaSA/lucca-ui/issues/35) - changed luifNumber filter support for `undefined`, `NaN` and `null` values.
 - [#32](https://github.com/LuccaSA/lucca-ui/issues/32) - display bug in the nguibs-datepicker inline
 - [#29](https://github.com/LuccaSA/lucca-ui/issues/29) - absurd values in the luid-moment (such as 12:99)
 - [#28](https://github.com/LuccaSA/lucca-ui/issues/28) - fix displayed value not updating when `$viewValue` set to `undefined`
 - `stuck` adjective now adds a default/themable z-index

### luid-user-picker
The demo of this directive is [here](https://luccasa.github.io/lucca-ui/#/lucca#luid-user-picker)

This directive has a ui-select plugged to `/api/v3/users/find` with a more powerful search.

#### Features:
 - handles former employees: if you choose to fetch former employees, their date of contract end will be clearly displayed.
 - detects and handles homonyms: in case of homonyms, specific informations are displayed in order to easily differentiate them.
 - custom filtering: filter the set of results fetched by the api according to a specific need
 - pagination: by default, only 5 users are displayed in the dropdown menu. If the user you are looking for is not displayed, it encourages you to specify your search.

#### Advanced features: 
 - custom properties to handle homonyms: inject custom properties to sort homonyms according to your needs.
 - application id and scope of operations: only fetch users that have access to the specified application, with the given set of operations for that application.
 - [#51](https://github.com/LuccaSA/lucca-ui/issues/51) possibility to pass a fuction to display custom info next to the user's name (number of apple eaten last week for example) in the dropdown. the function can be sync or async

#### Dependencies
 - [angular ui select](https://github.com/angular-ui/ui-select) - obv
 - [angular sanitize](https://github.com/angular/bower-angular-sanitize) - it's a dependency of ui-select, also we use the filter `highlight`
 - [momentjs](http://momentjs.com/) - to handle former employees
 - [underscorejs](http://underscorejs.org/) - for lists manipulation
 - [angular translate](https://github.com/angular-translate/angular-translate) - for all the labels like `5 displayed results of 37`


### luid-daterange
The demo of this directive is [here](https://luccasa.github.io/lucca-ui/#/directives#luid-daterange)

#### Features
 - uses the `luifFriendlyRange` to display the selected range
 - can bind to strings, dates or moments
 - can display ranges that are with the end excluded in the scope
 - you can define a list of preset periods to be easily accessible

#### Dependencies
 - [momentjs](http://momentjs.com/)
 - [angular ui bootstrap](https://angular-ui.github.io/bootstrap/#/datepicker) for the datepickers
