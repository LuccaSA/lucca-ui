# Change log

## 2.0.0

### Breaking changes
 - migration to sass due to a missing feature in less
 - removed dependency to bootstrap.css - now having bootstrap.css in your page will break the nguibs plugin.
 - [#25](https://github.com/LuccaSA/lucca-ui/issues/25) - changed luifDuration arguments to take `mainUnit` and `precision` and not `format`. See the [demo page](http://luccasa.github.io/lucca-ui/filters.html#luifDuration) for more info

### New features
 - added the directive luid-user-picker. only available in distribution /dist/custom/lucca-ui-spe.js. demo page [here](http://luccasa.github.io/lucca-ui/lucca-spe.html)
 - [#31](https://github.com/LuccaSA/lucca-ui/issues/31) - support for popover-title
 - [#46](https://github.com/LuccaSA/lucca-ui/issues/46) - nguibs-modal can have a specific prefix defined in themes
 - The `nguibs-` class prefix for nguibs elements can now be changed (and removed!) through theming
 - [#26](https://github.com/LuccaSA/lucca-ui/issues/26) - added a directive luid-daterange

### resolved issues
 - [#35](https://github.com/LuccaSA/lucca-ui/issues/35) - changed luifNumber filter support for `undefined`, `NaN` and `null` values.
 - [#32](https://github.com/LuccaSA/lucca-ui/issues/32) - display bug in the nguibs-datepicker inline
 - [#29](https://github.com/LuccaSA/lucca-ui/issues/29) - absurd values in the luid-moment (such as 12:99)
 - [#28](https://github.com/LuccaSA/lucca-ui/issues/28) - fix displayed value not updating when `$viewValue` set to `undefined`
 - `stuck` adjective now adds a default/themable z-index

### luid-user-picker
This directive has a ui-select plugged to /api/v3/users/find with a more powerful search.

####Features:
- handles former employees: if you choose to fetch former employees, their date of contract end will be clearly displayed.
- detects and handles homonyms: in case of homonyms, specific informations are displayed in order to easily differentiate them.
- custom filtering: filter the set of results fetched by the api according to a specific need
- pagination: by default, only 5 users are displayed in the dropdown menu. If the user you are looking for is not displayed, it encourages you to specify your search.

####Advanced features: 
- custom properties to handle homonyms: inject custom properties to sort homonyms according to your needs.
- application id and scope of operations: only fetch users that have access to the specified application, with the given set of operations for that application.
