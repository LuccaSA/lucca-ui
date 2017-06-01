# Change log

## in dev
### Bug fixes
- `luid-user-picker`: fixed a bug where user were duplicated

## 3.1.11 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.11)
### Changes (non-breaking)
 - `luid-daterange-picker`: add `range-format` attribute

## 3.1.10 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.10)
### Bug fixes
- `luid-moment`: `disabled` attribute is now `is-disabled` for IE support

## 3.1.9 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.9)
### Bug fixes
- `luid-user-picker`: `allow-clear` attribute

## 3.1.8 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.8)
### Changes (non-breaking)
- `luid-translations-list` - added unique identifiers for inputs, to display the directive multiple times in the same page
 - `luid-translations-list` - added ng-invalid handling
 - `luid-translations-list` - fixed issue which happened when ng-model was empty or undefined
 - `luid-translations-list` & `luid-iban` - fixed issue with ng-paste when JQuery was loaded before Angular

## 3.1.7 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.7)
### Changes (non-breaking)
 - `luid-translations` now supports ng-required: ng-model.$viewValue is set to undefined when all the multilingual variables are empty
 - `luid-translations` now supports ng-disabled
 - `luid-translations` now supports Lucca proprietary format
 - Added `luid-translations-list`, a directive to input multilingual lists

## 3.1.6 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.6)
### Bug fixes
 - `luid-moment` - fix support time on multiple days - when your min = today 8AM and max = tomorrow 2AM, it was impossible to have the time 1AM tomorrow even if it was a correct time - would automatically set it to today 1AM -> invalid-min

## 3.1.5 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.5)
### Bug fixes
 - `luid-moment` - adds a delay before we register the mousewheel event to avoid a scroll from the page being highjacked by a scroll inside the moment picker

## 3.1.4 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.4)
### Bug fixes
 - daterange picker - fix startStr and endStr displayed when using moment format
 - fix `a.wired.button` style

## 3.1.3 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.3)
### Bug fixes
 - user-picker - add attribute allow-clear

## 3.1.2 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.2)
### Bug fixes
 - user-picker - rem attribute `disable-paging` to prevent you from trashing your DOM
 - user-picker - fixed paging + custom filter interactions

## 3.1.1 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.1)
### Bug fixes
 - user-picker - fix the attr display-all-users was used in to disable the paging and created BC for when it is used for its normal function - added attr `disable-paging` instead

## 3.1.0 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.1.0)
### BREAKING CHANGES
- New compact inputs (breaking change for all inputs)
 - refactored the way the angular modules are defined, so now each module has a fixed number of dependencies. allows you to use lucca-ui without having to9 add `ng-crop-extended` or `formly` to your list of dependencies
 - refactored the definitions that will apprear in `lucca-ui.d.ts`, all definitions you need should be under `lui`, ex: `lui.IFilterService`, `lui.IProgressBarService`, `lui.IConfig`
 - except for the tablegrid, its under `lui.tablegrid`, ex: `lui.tablegrid.IHeader`, `lui.tablegrid.FilterType.SELECT`

### Changes (non-breaking)
 - added infinite scroll to `luid-api-select`
 - added `order-by` param to `luid-api-select`

### Bug fixes
 - [issue #358](https://github.com/LuccaSA/lucca-ui/issues/358) datepicker and daterangepicker popover position
 - [issue #377](https://github.com/LuccaSA/lucca-ui/issues/377) iban validity issue due to spaces in viewvalue
 - Tablegrid: table headers should share the same text-align than cells
 - added class `.clickable` for `.lui.table`
 - z-index fix for modals & overlays

## 3.0.10 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.0.10)

### Changes (non-breaking)
- image-picker : attribute to enable emptying input

### Bug fixes
- Modal: !important on z-index is conflicting with automatic z-index increment handled by angular-ui-bootstrap


## 3.0.9 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.0.9)
### Bug fixes
- Z-index fix for translation-picker

## 3.0.8 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.0.8)

### Changes (non-breaking)
- added keyboard support in luid-date-picker-popup and luid-daterage-picker

### Bug fixes
- Higher z-index for dropdowns

## 3.0.7 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.0.7)

### Bug fixes
- Checkbox: adds support for partially checked
- Minor fix on side-panel modals appearance
- Popover: adds cursor pointer on triggering element when click is the triggering
- Tooltip: break words that are too long
- Timespanpicker: prevent browser from trying to autocorrect and spellcheck input value
- UI-select: disabled style refactoring
- user-picker: display 15 results instead of 10
- user-picker: display lastname firstname isteand of firstname lastname

## 3.0.6 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.0.6)

This version was skipped on bower but was necessary to register to npm

### Changes (non-breaking)

- Updated `package.json` in order to match bower version.

## 3.0.5 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.0.5)

### Changes (non-breaking)
- Applayout navigation is now fixed by default
- Momentpicker: adds support for [disabled-keyboard="{bool}"]
- Momentpicker: prevent browser spell checking the input value
- Field: support for a labelled input without a field parent via the `labelled` class
- Field: support for a fitting input without a field parent
- Popover: no more hidden overflow on inner
- Modal: z-index is now important to circumvent the lucca-banner authoritarian css
- Tooltip: now displays a help cursor icon on hover
- New `side-panel` style for modals
- Pagination: prev and next buttons now have arrow icons

### Bug fixes
- Fixes issue #353
- Applayout: the navigation arrow positioning is now correct
- Datepicker: z-index fix
- Momentpiker: vertical-align fix
- Checkbox: solo checkbox now display properly
- Buttons: fixes border-radius on last child when accompanied with a label
- Tablegrid: fixes the filters margin + adds shadow to thead
- Fixes issue #301

## 3.0.4 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.0.4)

### Bug fixes
- `.field` inside .`column` had no margin
- user-picker placeholder was binded once
- changed paging for api-select
- api-select and user-picker have class ng-open when the dropdown is open
- `luid-iban` removed ng-patterns in the internal inputs cuz it caused bugs, the iban validity is still checked by the 3rd party lib

## 3.0.3 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.0.3)

### Bug fixes
- uib-collapse was mistakenly removed and thus is back!
- Datepicker sizing fix
- UI-select: adds support for dividers and groups
- UI-select: scss refactoring (absolute positionning) to hide the potential lag in ng-hide toggling
- appLayout: progress-bar is now affected by topOffset
- Dropdown: removed default width
- appLayout: Active state =/= hover state on navigation items
- Points towards: triangles are more squarish
- New behaviour for active item in AppLayout plugin navigation
- Fixes issue #342

## 3.0.2 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.0.2)

### Bug fixes
- user-picker - fix nullrefex due to the new rights on api/v3/users

## 3.0.1 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.0.1)

### Bug fixes
- input tag were inheriting some styles from normalize
- margin for fields inside lui columns

## 3.0.0 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/3.0.0)

### Dependencies

the following dependencies have been updated to their latest version at time of release. This might introduce breaking changes

- moment `2.15`
- angular-ui-bootstrap `2.1` - this one has breaking-changes if you're using a popover or tooltip with custom trigger
- ui-select `0.19`
- angular-translate `2.12`

The following dependencies have been added

- normalize `5.0` - this one might have breaking changes too
- angular-formly `8.4`
- iban `0.0.6`

### Breaking changes
- Major refactoring of the raised adjective, based upon material design guidelines. The `lui_theme_shadow` function thus disappears, and the `.lui.raised` class should not be @extended any longer.
- Major refactoring of fields and inputs: material style, no more addon support
- Search input is replaced with a simple `searchable` class to be added to the `div.lui.input`
- changed the `luid-keydown` directive, it does not automatically call `e.preventDefault()`
- removed directive `luid-daterange`, use `luid-daterange-picker` instead
- `luid-user-picker` doesn't have a placeholder by default

### New features
- Default border-radius is now 2px instead of 3px
- `luid-iban` new directive to input and display ibans
- `luid-user-picker` supports `allow-clear` attribute

## Resolved issues
- Adds support for line-breaks in tooltip content
- [issue #301](https://github.com/LuccaSA/lucca-ui/issues/301) (appLayout plugin) - adds support for .top.stuck on #main-header
- [issue #298](https://github.com/LuccaSA/lucca-ui/issues/298) (grid) - fixes same height columns (fitting columns)
- Fixes some styling inconsistencies on the tablegrid component
- [issue #292](https://github.com/LuccaSA/lucca-ui/issues/292) - `.progress-bar` was drooling on other people style cuz it was ignoring the prefix

## 2.3.0 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.3.0)

### Breaking changes
 - added a dependency to [ng-img-crop-full-extended](https://github.com/CrackerakiUA/ngImgCropFullExtended), see the `luid-image-picker` to understand why
 - removed method `luisNotify.config({...})` in favor of the `luisConfigProvider.setConfig({...})` that does more.
 - `luisProgressBar.add` method mow only takes a palette as argument, the parent element being fixed during the `luisConfigProvider.setConfig` method

### New features
 - `luid-image-picker` directive that display an image and allows to upload a cropped one to a lucca web app through `/api/files`. see [demo page](https://luccasa.github.io/lucca-ui/#/lucca#luid-image-picker) for more info.
 - `luisConfigProvider` provider with a method `setConfig()` to allow you to configure lucca-ui once and for all
 - `luid-date-picker` - an equivalent to [ui bootstrap datepicker](https://angular-ui.github.io/bootstrap/#/datepicker). see [demo page](https://luccasa.github.io/lucca-ui/#/directives#luid-date-picker) for more info
 - `luid-daterange-picker` - the new and improved version of the luid-daterange. see [demo page](https://luccasa.github.io/lucca-ui/#/directives#luid-daterange-picker) for more info

### Resolved issues
- UI-select disabled styling fix
- UI-select: JS would sometimes mess up search input size
- tablegrid : fixes a translation typo
- [issue #276](https://github.com/LuccaSA/lucca-ui/issues/276) - tablegrid does not evaluate expression when injecting HTML as ui-select-choices
- Inputs: fixes input addon sizing
- [issue #280](https://github.com/LuccaSA/lucca-ui/issues/280) - Adds support for the disabled style on lui checkbox

## 2.2.3 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.2.2)

### New features
- UI-Select now supports class `.invalid`
- `luisNotify` - add method `loading`, see [demo](https://luccasa.github.io/lucca-ui/#/directives#luis-notify) for more info
- `tablegrid` - add the attribute `height-type` in order to specify if the given height should be applied on the whole tablegrid (`global`), or on the body (`body`)
- `tablegrid` filter is now accent insensitive
- new filter `luifStripAccent` in order to replace accented chars with non-accented chars

### New features still in beta - use at your own risks
- `luid-date-picker` - an equivalent to [ui bootstrap datepicker](https://angular-ui.github.io/bootstrap/#/datepicker). see [demo page](https://luccasa.github.io/lucca-ui/#/directives#luid-date-picker) for more info
- `luid-daterange-picker` - the new and improved version of the luid-daterange. see [demo page](https://luccasa.github.io/lucca-ui/#/directives#luid-daterange-picker) for more info

### Resolved issues
 - fix invalid inputs with addon were not bordered correctly
 - fix links in tablegrid do not trigger `onRowClick` anymore
 - Adds support for disabled state on ui-selet (issue #264)

## 2.2.2 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.2.2)

### Resolved issues
 - fix style of table grid and notify that was disabled by default

## 2.2.1 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.2.1)

### New features
Major refactoring of the sass code structure. Here are the consequences:
- should prevent "You may not extend an outer selector from within media" errors (sass-node >3.7.x) thanks to accessible mixin definitions
- makes the "namespaced | global" distinction null and void: framework adapts itself
- any element now implements a `enabled: true|false` theme variable
Note: should not contain any breaking change (unless mistakes were made) as of now, but both `lucca-ui.namespaced.scss` and `lucca-ui.global.scss` files should eventually merge into one as they are now identical and a breaking change it will be.

### Resolved issues

## 2.2.0 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.2.0)

### Important

Some problems have been identified with the sass code structure right after this release. This version builds with node-sass v3.4.2 but not with node-sass ^3.5. It is highly recommended to use release 2.2.1 that fixed this issue and builds with the latest version of node-sass (3.7 at time of writing)

### Breaking changes

- tablegrid - the property `isChecked` is now wrapped in object `luiTableGridRow`
- UI-select - fixes the sizing bug on opening

### Dependencies
- updated angular from 1.4 to 1.5
- updated angular-ui-bootstrap from 1.1 to 1.3
- updated angular-translate from 2.8 to 2.11
- updated ui.select from 0.12 to 0.16
- updated lucca-icons 1.1.8 - fix Breaking bug in the sass of lucca-icons
- updated moment 2.10 -> 2.13

### New features
- luidTableGrid: on-row-click attribute - possibility to call a function when the user click on a row of the tablegrid
- `luisProgressBar` : Display a progress bar depending on get http requests
- luidTableGrid: default-order attribute - possibility to specify the default column on which the sort order will be apply at first load.
- directive deferred-cloak : Used to prevent the Angular html template from being briefly displayed by the browser in its raw (uncompiled) form while your application is loading.
Based on ng-cloak angular's directive but use link directive function instead of compile function.
- luidUserPicker: `bypass-operations-for` attribute - bypass operations filter for a list of user ids
- lui icon - supports palette adjectives to change the icon color
- ui-select - adds support for the timmi-like 'natural' styling
- `luisNotify` - wrapper of the library [angular-notify](https://github.com/cgross/angular-notify) with some templates. see [demo page](https://luccasa.github.io/lucca-ui/#/directives#luis-notify) for more info
- `userpicker` - displays the 10 first results instead of just 5
- luidTableGrid : if dataset contains less than 200 elements, virtual scroll is not activate.
- tablegrid - possibility to retrieve the number of row in the filtered dataset

### Resolved issues
- Popover: unnecessary !important property removed - may break things unexpectedly
- day block - fix issue with july and june displayed the same in french
- Libsass: moving to Delorean version caused transpilation fails
- tooltip : Adds a max-width to tooltips

## 2.1.0 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.1.0)

Moved to 2.1.0 because of all the shenanigans with the table grid

it is recommended to not use releases 2.0.12 onwards and move to this release. If you were not using the table grid directive, you are not concerned by the breaking changes

### Breaking changes
- Table-Grid directive has been removed from the standard distribution and add to the specific Lucca distribution because of many specifics dependancies it uses.

### New features
- Directive `luid-user-picker` to handle custom $http service.
- Directive `luid-user-picker-multiple` to handle custom $http service.

### Resolved issues

## 2.0.16 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.16)

### New features
- luidTableGrid: selectable attribute - possibility to display checkboxes as fixed first column.

### Resolved issues
- [issue #178](https://github.com/LuccaSA/lucca-ui/issues/178) - Clicking on datepicker icon now opens the datepicker popup
- [issue #179](https://github.com/LuccaSA/lucca-ui/issues/179) - Checkbox now supports partial state (add the `partial` class to the checkbox input)
- [issue #181](https://github.com/LuccaSA/lucca-ui/issues/181) - checkbox with empty label
- [issue #193](https://github.com/LuccaSA/lucca-ui/issues/193) - Frantic static animations
- Fixes input addon sizing
- Adds relative positioning to tabbed menus (fix)
- Fixes afterglow for animations in Chrome

## 2.0.15 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.15)

### New features
- lucca-icons 1.1.7
- [issue #169](https://github.com/LuccaSA/lucca-ui/issues/169) - radio input styling

### Resolved issues
- General consensus was default animation durations were too long.

### Dirty hotfix
- Tablgrid hotfix in case of scrollable body

## 2.0.14 - [release](https://github.com/LuccaSA/lucca-ui/releases/tag/2.0.14)

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
