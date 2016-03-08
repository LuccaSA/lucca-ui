# Change log

## 2.0.14 - in dev

### New features
- Menu: Removes relative positioning that messes up some Angular directives
- Dropdowns no longer have absolute width
- Fancy links now have baseline vertical positioning
- Updated to Lucca-icons 1.1.5 (`sliders` icon added)

### Resolved issues
- [issue #143](https://github.com/LuccaSA/lucca-ui/issues/143) Tooltips & Popovers: now supports "top-left", "top-right", "left-top", etc...
- [issue #149](https://github.com/LuccaSA/lucca-ui/issues/149) Dropdown [FIX] Adds support for `.direction-up` dropdowns
- Popover now has a lower z-index than modals

## 2.0.13 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.13)

### New features
- luidTableGrid : tittle attribute - shows full value on hoover, usefull for long strings
- Icons [REF] Implements templating for lucca-icons dependency + adds support for the "createClasses" option in theme

### Resolved issues

## 2.0.12 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.12)

### HOTFIX
 - some major hotsif inluifFriendlyRange when moment.locale() was different to the supported locales

### New features

### luid-table-grid
The demo of this directive is [here](https://luccasa.github.io/lucca-ui/#/directives#luid-table-grid)

#### Features:
 - show datas as a table.
 - handles fixed colums and scrollable columns.
 - can take any form of data as an input.
 - filtering and sorting supported.
 - virtualized scroll.

#### Advanced features:
 - show custom html in cells.
 - handles nested headers.
 - text alignment property : left/center/right

#### Dependencies
 - [angular](https://github.com/angular/angular.js) - obv

### Resolved issues
- Tablegrid: fixes table width

## 2.0.11 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.11)

### New features
- tagged search input : mimicks ui-select in multiple mode. There's probably a sizing issue with IE9.
- deutsche support for `luifFriendlyRange` and the user picker

### Resolved issues

## 2.0.10 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.10)

### Hotfix
- luid-timespan was behaving differently when incrementing with the mouse wheel or keyboard arrows and directly editing the value

## 2.0.9 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.9)

### New features
- [issue #47](https://github.com/LuccaSA/lucca-ui/issues/47) - Adds support for uib-pagination styling
- [#132](https://github.com/LuccaSA/lucca-ui/issues/132) - luifTimespan - supports negative values

### Resolved issues
- [#115](https://github.com/LuccaSA/lucca-ui/issues/115) - Switch input: fixes sizing and offset in Firefox
- [#120](https://github.com/LuccaSA/lucca-ui/issues/120) - Fixes modal sizing, also supports sizes defined in your theme's breakpoints

## 2.0.8 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.8)

### New features
- [#123](https://github.com/LuccaSA/lucca-ui/issues/123)luifFriendlyRange : Now shows day of week when range is one day

### Resolved issues
- Nguibs/Modals: Support for all modal sizes. Header and footer margin fix.
- Nguibs/UI-Select: now supports search-enabled="false"
- Table: the bottom border of theads on .lui.table comes back from the dead
- Input: adds support for the "x-short" length in default theme
- Input: replaces `height` with `min-height`
- Menus: adds opacity effect on dividing menus + fixes the default color of active items in default color pills menus
- Menus: right items no longer have any right margin
- Typography: fixes the ".lui.bold / .strong" class

## 2.0.7 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.7)

### New features
- Directive `luid-user-picker-multiple`to handle multiple selection. See [demo](http://lucca.ui/demo/index.html#/lucca#luid-user-picker)
- added `size` attribute to `luid-user-picker` and `luid-user-picker-multiple`

### Resolved issues
 - [#91](https://github.com/LuccaSA/lucca-ui/issues/91) - sizing for ui-select
 - [#118](https://github.com/LuccaSA/lucca-ui/issues/118) - use moments locale instead of angular i18n to define the first day of the week in the datepickers inside luid-daterange

## 2.0.6 -[release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.6)


### New features
- Adds support for timespanpicker, dropdown and momentpicker inside an `.inline.field`
- Datepicker now has a leaving animation
- Adds support for headings inside breadcrumbs item
- Adds sizing support for nguibs-dropdown and nguibs-ui-select
- [#108](https://github.com/LuccaSA/lucca-ui/issues/108) - upd dependency of [angular-ui-bootstrap](https://angular-ui.github.io/bootstrap/) from 0.14.x to 1.0.x
- angular ui bootstrap's [modal](http://angular-ui.github.io/bootstrap/#/modal) is now properly supported by the angyular reskin plugin, see [demo page](http://luccasa.github.io/lucca-ui/#/nguibs#luid-modal) for more info

### Resolved issues
- [#101](https://github.com/LuccaSA/lucca-ui/issues/101) - ui-select, clicking on the arrow did not open the dropdown
- [#100](https://github.com/LuccaSA/lucca-ui/issues/100) & [#91](https://github.com/LuccaSA/lucca-ui/issues/91) - multiple ui-select is no longer resized when adding new items if a size has been set
- Fixes some issues with nested menus + adds support for dotted and dashed divider style as well as for `.centered` menu style
- Fixes a minor checkbox position issue
- Adds support for `.spaced.columns`
- Small changes over how menu color is handled in themes
- [#105](https://github.com/LuccaSA/lucca-ui/issues/105) - `luid-moment` values manually entered over max were not properly handled, as a result there was a desynch between ng-model and isolate scope
- [#104](https://github.com/LuccaSA/lucca-ui/issues/104) - `luid-moment` reworked validators for better utilisation in forms

## 2.0.5 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.5)

### New features
 - directive `luid-day-block` that displays a date in a bloc like fashion, see [demo page](http://luccasa.github.io/lucca-ui/#/directives#luid-luid-day-block) for more info
 - Better css layout for checkbox inputs: now adopts a table-style layout
 - Adds support for pulse "up" and "down" animations
 - nguibs-datepicker calendar icon is now displayed on the right of the input
 - Adds support for progress bars attached to callouts.

### Resolved issues
 - bug with luifDuration when trying to dislay `1.0005d` with unit = day and precision = day - should have displayed `1d` but displayed `1.00d`
 - luid-timespan now supports `undefined` as value, before default value was 0 sec

## 2.0.4 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.4)

### New features
 - [sass] Checkboxes now support '.readonly' state
 - [#86](https://github.com/LuccaSA/lucca-ui/issues/86) - `spe-lucca` directive `luid-translations`, see [demo page](http://luccasa.github.io/lucca-ui/#/lucca-spe#luid-translations) for more info

### Resolved issues

## 2.0.3 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.3)

### New features
 - [#83](https://github.com/LuccaSA/lucca-ui/issues/83) - You can now use a button as an input addon.
 - [#84](https://github.com/LuccaSA/lucca-ui/issues/84) - luid-daterange, added `close-label` and `close-action` attributes, see [demo page](http://luccasa.github.io/lucca-ui/#/directives#luid-daterange) for more info
 - [#85](https://github.com/LuccaSA/lucca-ui/issues/85) - .dividing class is now supported for nguibs dropdown items
 - [#87](https://github.com/LuccaSA/lucca-ui/issues/87) - luifDuration, improved support of `unit="day"` and `precision="day"`

### Resolved issues
 - [#89](https://github.com/LuccaSA/lucca-ui/issues/83) - luifDuration displayed nothing when it had to display 48h

## 2.0.2 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.2)

### New features
 - [#54](https://github.com/LuccaSA/lucca-ui/issues/54) - directive luid-keydown, se the [demo page](http://luccasa.github.io/lucca-ui/#/directives#luid-keydown) for more infos.
 - [#73](https://github.com/LuccaSA/lucca-ui/issues/73) - luid-user-picker displays selected user first
 - [#50](https://github.com/LuccaSA/lucca-ui/issues/50) - luid-user-picker displays "me" first
 - [#79](https://github.com/LuccaSA/lucca-ui/issues/79) - luid-user-picker displays option "all users"
 - vertical buttons group - se the [demo page](http://luccasa.github.io/lucca-ui/#/sass#lui-button) for more info

### Custom distributions
 - the custom js distributions are available in minified form
 - custom distribution lucca-ui-light is no more

## 2.0.1 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.1)

### Updated dependencies
 - [#39](https://github.com/LuccaSA/lucca-ui/issues/39) - angularlar-bootstrap from 0.13.x to 0.14.x

### New features
 - [#70](https://github.com/LuccaSA/lucca-ui/issues/70) - luid-timespan supports min/max attributes
 - [#71](https://github.com/LuccaSA/lucca-ui/issues/71) - luid-daterange the popover closes when clicking outside the popover

### Resolved issues


## 2.0.0 [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.0)

### Breaking changes
 - migration to sass due to a missing feature in less
 - removed dependency to bootstrap.css - now having bootstrap.css in your page will break the nguibs plugin.
 - [#25](https://github.com/LuccaSA/lucca-ui/issues/25) - changed luifDuration arguments to take `mainUnit` and `precision` and not `format`. See the [demo page](http://luccasa.github.io/lucca-ui/#/filters#luifDuration) for more info

### New features
 - added the directive luid-user-picker. only available in distribution /dist/custom/lucca-ui-spe.js. demo page [here](http://luccasa.github.io/lucca-ui/#/lucca-spe)
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
