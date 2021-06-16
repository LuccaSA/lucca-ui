var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lui;
(function (lui) {
    "use strict";
    angular.module("moment", []).factory("moment", function () { return moment; });
    angular.module("underscore", []).factory("_", function () { return _; });
    angular.module("iban", []).factory("iban", function () { return IBAN; });
    angular.module("lui", ["ngSanitize", "ui.bootstrap", "ui.select", "moment", "underscore"]);
    angular.module("lui.translate", ["lui", "pascalprecht.translate"]);
    angular.module("lui.notify", ["lui", "cgNotify"]);
    angular.module("lui.formly", ["lui", "formly"]);
    angular.module("lui.crop", ["lui", "lui.translate", "uiCropper"]);
    angular.module("lui.iban", ["lui", "iban"]);
    angular.module("lui.tablegrid", ["lui", "lui.translate"]);
})(lui || (lui = {}));
var lui;
(function (lui) {
    var cloak;
    (function (cloak) {
        "use strict";
        angular.module("lui").directive("luiCloak", ["$timeout", function ($timeout) {
                return {
                    restrict: "A",
                    link: function (scope, element, attrs) {
                        $timeout(function () {
                            attrs.$set("luiCloak", undefined);
                            element.removeClass("lui-cloak");
                        }, 0);
                    },
                };
            }]);
    })(cloak = lui.cloak || (lui.cloak = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    "use strict";
})(lui || (lui = {}));
var lui;
(function (lui) {
    var config;
    (function (config_1) {
        "use strict";
        var LuipConfig = (function () {
            function LuipConfig($uibModalProvider) {
                var _this = this;
                this.$get = ["$log", function ($log) {
                        return new Config(_this.config, $log);
                    }];
                this.config = {};
                this.$uibModalProvider = $uibModalProvider;
            }
            LuipConfig.prototype.setConfig = function (config) {
                this.config = config;
                var conf = new Config(this.config);
                this.configureNguibs(conf);
            };
            LuipConfig.prototype.configureNguibs = function (config) {
                this.$uibModalProvider.options = {
                    windowClass: config.prefix,
                    backdropClass: config.prefix,
                    animation: true,
                    backdrop: true,
                    appendTo: config.parentElt,
                    size: "large",
                };
            };
            LuipConfig.$inject = ["$uibModalProvider"];
            return LuipConfig;
        }());
        var Config = (function () {
            function Config(conf, $log) {
                _.extend(this, conf);
                if (!this.parentElt && !!this.parentTagIdClass) {
                    var parentTagIdClass = this.parentTagIdClass || "body";
                    var byTag = document.getElementsByTagName(parentTagIdClass);
                    var byId = document.getElementById(parentTagIdClass);
                    var byClass = document.getElementsByClassName(parentTagIdClass);
                    if (!!byTag && byTag.length) {
                        this.parentElt = angular.element(byTag[0]);
                    }
                    else if (!!byId) {
                        this.parentElt = angular.element(byId);
                    }
                    else if (!!byClass && byClass.length) {
                        this.parentElt = angular.element(byClass[0]);
                    }
                    else if (!!$log) {
                        $log.warn("luisConfig - could not find a suitable element for tag/id/class: " + parentTagIdClass);
                    }
                }
                this.prefix = this.prefix || "lui";
                this.startTop = this.startTop || 40;
                this.okLabel = this.okLabel || "Ok";
                this.cancelLabel = this.cancelLabel || "Cancel";
                this.canDismissConfirm = this.canDismissConfirm;
            }
            return Config;
        }());
        angular.module("lui").provider("luisConfig", LuipConfig);
    })(config = lui.config || (lui.config = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var datepicker;
    (function (datepicker) {
        "use strict";
        var CalendarDate = (function () {
            function CalendarDate(date) {
                this.date = moment(date);
            }
            return CalendarDate;
        }());
        datepicker.CalendarDate = CalendarDate;
        var Calendar = (function () {
            function Calendar(date) {
                this.date = moment(date);
                this.weeks = [];
                this.months = [];
                this.years = [];
                this.currentYear = this.date.year() === moment().year();
            }
            return Calendar;
        }());
        datepicker.Calendar = Calendar;
        var CalendarWeek = (function () {
            function CalendarWeek() {
            }
            return CalendarWeek;
        }());
        datepicker.CalendarWeek = CalendarWeek;
        var CalendarDay = (function (_super) {
            __extends(CalendarDay, _super);
            function CalendarDay(date) {
                _super.call(this, date);
                this.dayNum = date.date();
            }
            return CalendarDay;
        }(CalendarDate));
        datepicker.CalendarDay = CalendarDay;
        var Shortcut = (function () {
            function Shortcut() {
            }
            return Shortcut;
        }());
        datepicker.Shortcut = Shortcut;
        (function (CalendarMode) {
            CalendarMode[CalendarMode["Days"] = 0] = "Days";
            CalendarMode[CalendarMode["Months"] = 1] = "Months";
            CalendarMode[CalendarMode["Years"] = 2] = "Years";
        })(datepicker.CalendarMode || (datepicker.CalendarMode = {}));
        var CalendarMode = datepicker.CalendarMode;
    })(datepicker = lui.datepicker || (lui.datepicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var datepicker;
    (function (datepicker) {
        "use strict";
        var CalendarController = (function () {
            function CalendarController($scope, $log) {
                this.minMode = datepicker.CalendarMode.Days;
                this.$scope = $scope;
                this.$log = $log;
                this.initCalendarScopeMethods($scope);
                this.setMinMode($scope.minMode);
                this.$scope.mode = this.minMode;
                $scope.direction = "init";
            }
            CalendarController.prototype.setCalendarCnt = function (cntStr, inAPopover) {
                this.calendarCnt = parseInt(cntStr, 10) || 1;
                if (inAPopover && this.calendarCnt > 2) {
                    this.calendarCnt = 2;
                    this.$log.warn("no more than 2 months displayed in a date-picker popover");
                }
            };
            CalendarController.prototype.constructCalendars = function () {
                var _this = this;
                return _.map(_.range(this.calendarCnt), function (offset) {
                    return _this.constructCalendar(_this.currentDate, offset);
                });
            };
            CalendarController.prototype.constructDayLabels = function () {
                return _.map(_.range(7), function (i) {
                    return moment().startOf("week").add(i, "days").format("dd");
                });
            };
            CalendarController.prototype.assignClasses = function () {
                switch (this.$scope.mode) {
                    case datepicker.CalendarMode.Days:
                        return this.assignDayClasses();
                    case datepicker.CalendarMode.Months:
                        return this.assignMonthClasses();
                    case datepicker.CalendarMode.Years:
                        return this.assignYearClasses();
                    default: break;
                }
            };
            CalendarController.prototype.setMinMode = function (mode) {
                switch ((mode || "").toLowerCase()) {
                    case "0":
                    case "d":
                    case "day":
                    case "days":
                        this.minMode = datepicker.CalendarMode.Days;
                        break;
                    case "1":
                    case "m":
                    case "month":
                    case "months":
                        this.minMode = datepicker.CalendarMode.Months;
                        break;
                    case "2":
                    case "y":
                    case "year":
                    case "years":
                        this.minMode = datepicker.CalendarMode.Years;
                        break;
                    default:
                        this.minMode = datepicker.CalendarMode.Days;
                        break;
                }
            };
            CalendarController.prototype.assignDayClasses = function () {
                var _this = this;
                var days = this.extractDays();
                _.each(days, function (day) {
                    day.selected = false;
                    day.start = false;
                    day.end = false;
                    day.inBetween = false;
                    if (!!_this.selected && day.date.format("YYYYMMDD") === moment(_this.selected).format("YYYYMMDD")) {
                        day.selected = true;
                    }
                    if (!!_this.start && day.date.format("YYYYMMDD") === moment(_this.start).format("YYYYMMDD")) {
                        day.start = true;
                    }
                    if (!!_this.end && day.date.format("YYYYMMDD") === moment(_this.end).format("YYYYMMDD")) {
                        day.end = true;
                    }
                    if (!!_this.start && !!_this.end && day.date.isSameOrAfter(_this.start) && day.date.isSameOrBefore(_this.end)) {
                        day.inBetween = true;
                    }
                    if (!!_this.min && _this.min.diff(day.date) > 0) {
                        day.disabled = true;
                    }
                    if (!!_this.max && _this.max.diff(day.date) < 0) {
                        day.disabled = true;
                    }
                    if (!!_this.$scope.customClass) {
                        day.customClass = _this.$scope.customClass(day.date, datepicker.CalendarMode.Days);
                    }
                });
            };
            CalendarController.prototype.assignMonthClasses = function () {
                var _this = this;
                var months = this.extractMonths();
                _.each(months, function (month) {
                    month.selected = false;
                    month.start = false;
                    month.end = false;
                    month.inBetween = false;
                    if (!!_this.selected && month.date.format("YYYYMM") === moment(_this.selected).format("YYYYMM")) {
                        month.selected = true;
                    }
                    if (!!_this.start && month.date.format("YYYYMM") === moment(_this.start).format("YYYYMM")) {
                        month.start = true;
                    }
                    if (!!_this.end && month.date.format("YYYYMM") === moment(_this.end).format("YYYYMM")) {
                        month.end = true;
                    }
                    if (!!_this.start && !!_this.end && !month.start && !month.end && month.date.isSameOrAfter(_this.start) && month.date.isSameOrBefore(_this.end)) {
                        month.inBetween = true;
                    }
                    if (!!_this.min && _this.min.diff(moment(month.date).endOf("month")) > 0) {
                        month.disabled = true;
                    }
                    if (!!_this.max && _this.max.diff(month.date) < 0) {
                        month.disabled = true;
                    }
                    if (!!_this.$scope.customClass) {
                        month.customClass = _this.$scope.customClass(month.date, datepicker.CalendarMode.Months);
                    }
                });
            };
            CalendarController.prototype.assignYearClasses = function () {
                var _this = this;
                var years = this.extractYears();
                _.each(years, function (year) {
                    year.selected = false;
                    year.start = false;
                    year.end = false;
                    year.inBetween = false;
                    if (!!_this.selected && year.date.format("YYYY") === moment(_this.selected).format("YYYY")) {
                        year.selected = true;
                    }
                    if (!!_this.start && year.date.format("YYYY") === moment(_this.start).format("YYYY")) {
                        year.start = true;
                    }
                    if (!!_this.end && year.date.format("YYYY") === moment(_this.end).format("YYYY")) {
                        year.end = true;
                    }
                    if (!!_this.start && !!_this.end && !year.start && !year.end && year.date.isSameOrAfter(_this.start) && year.date.isSameOrBefore(_this.end)) {
                        year.inBetween = true;
                    }
                    if (!!_this.min && _this.min.diff(moment(year.date).endOf("year")) > 0) {
                        year.disabled = true;
                    }
                    if (!!_this.max && _this.max.diff(year.date) < 0) {
                        year.disabled = true;
                    }
                    if (!!_this.$scope.customClass) {
                        year.customClass = _this.$scope.customClass(year.date, datepicker.CalendarMode.Years);
                    }
                });
            };
            CalendarController.prototype.initCalendarScopeMethods = function ($scope) {
                var _this = this;
                $scope.dayLabels = this.constructDayLabels();
                $scope.next = function () {
                    _this.changeCurrentDate(1);
                    $scope.calendars = _this.constructCalendars();
                    $scope.direction = "next";
                    _this.assignClasses();
                };
                $scope.previous = function () {
                    _this.changeCurrentDate(-1);
                    $scope.calendars = _this.constructCalendars();
                    $scope.direction = "previous";
                    _this.assignClasses();
                };
                $scope.switchToMonthMode = function () {
                    $scope.mode = datepicker.CalendarMode.Months;
                    $scope.direction = "mode-change out";
                    _this.currentDate.startOf("year");
                    $scope.calendars = _this.constructCalendars();
                    _this.assignClasses();
                };
                $scope.switchToYearMode = function () {
                    $scope.mode = datepicker.CalendarMode.Years;
                    $scope.direction = "mode-change out";
                    $scope.calendars = _this.constructCalendars();
                    _this.assignClasses();
                };
                $scope.selectDay = function (day) {
                    _this.selectDate(day.date);
                };
                $scope.selectMonth = function (month) {
                    if (_this.minMode === datepicker.CalendarMode.Months) {
                        _this.selectDate(month.date);
                    }
                    else {
                        _this.currentDate = month.date;
                        $scope.mode = datepicker.CalendarMode.Days;
                        $scope.direction = "mode-change in";
                        $scope.calendars = _this.constructCalendars();
                        _this.assignClasses();
                    }
                };
                $scope.selectYear = function (year) {
                    if (_this.minMode === datepicker.CalendarMode.Years) {
                        _this.selectDate(year.date);
                    }
                    else {
                        _this.currentDate = year.date;
                        $scope.mode = datepicker.CalendarMode.Months;
                        $scope.direction = "mode-change in";
                        $scope.calendars = _this.constructCalendars();
                        _this.assignClasses();
                    }
                };
            };
            CalendarController.prototype.constructCalendar = function (start, offset) {
                var calendar;
                switch (this.$scope.mode) {
                    case datepicker.CalendarMode.Days:
                        calendar = new datepicker.Calendar(moment(start).startOf("month").add(offset, "month"));
                        calendar.weeks = this.constructWeeks(calendar.date);
                        return calendar;
                    case datepicker.CalendarMode.Months:
                        calendar = new datepicker.Calendar(moment(start).startOf("year").add(offset, "year"));
                        calendar.months = this.constructDates(calendar.date, "months");
                        return calendar;
                    case datepicker.CalendarMode.Years:
                        calendar = new datepicker.Calendar(moment(start).startOf("year").add(offset * 12, "year"));
                        calendar.years = this.constructDates(calendar.date, "years");
                        return calendar;
                    default: break;
                }
            };
            CalendarController.prototype.constructDates = function (start, unitOfTime) {
                return _.map(_.range(12), function (i) {
                    return new datepicker.CalendarDate(moment(start).add(i, unitOfTime));
                });
            };
            ;
            CalendarController.prototype.constructWeeks = function (monthStart) {
                var weeks = [];
                var weekStart = moment(monthStart).startOf("week");
                while (weekStart.month() === monthStart.month() || moment(weekStart).endOf("week").month() === monthStart.month()) {
                    weeks.push(this.constructWeek(weekStart, monthStart));
                    weekStart.add(1, "week");
                }
                return weeks;
            };
            CalendarController.prototype.constructWeek = function (weekStart, monthStart) {
                var week = { days: [] };
                week.days = _.map(_.range(7), function (i) {
                    var day = new datepicker.CalendarDay(moment(weekStart).add(i, "days"));
                    if (day.date.month() !== monthStart.month()) {
                        day.empty = true;
                    }
                    return day;
                });
                return week;
            };
            CalendarController.prototype.extractDays = function () {
                return _.chain(this.$scope.calendars)
                    .pluck("weeks")
                    .flatten()
                    .pluck("days")
                    .flatten()
                    .reject(function (day) {
                    return day.empty;
                })
                    .value();
            };
            CalendarController.prototype.extractMonths = function () {
                return _.chain(this.$scope.calendars)
                    .pluck("months")
                    .flatten()
                    .value();
            };
            CalendarController.prototype.extractYears = function () {
                return _.chain(this.$scope.calendars)
                    .pluck("years")
                    .flatten()
                    .value();
            };
            CalendarController.prototype.changeCurrentDate = function (offset) {
                switch (this.$scope.mode) {
                    case datepicker.CalendarMode.Days:
                        this.currentDate.add(offset, "months");
                        break;
                    case datepicker.CalendarMode.Months:
                        this.currentDate.add(offset, "years");
                        break;
                    case datepicker.CalendarMode.Years:
                        this.currentDate.add(offset * 12, "years");
                        break;
                    default: break;
                }
            };
            return CalendarController;
        }());
        datepicker.CalendarController = CalendarController;
    })(datepicker = lui.datepicker || (lui.datepicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var datepicker;
    (function (datepicker) {
        "use strict";
        var LuidDatePicker = (function () {
            function LuidDatePicker() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/date-picker/datepicker-inline.html";
                this.require = ["ngModel", "luidDatePicker"];
                this.scope = {
                    format: "@",
                    displayedCalendars: "@",
                    minMode: "@",
                    min: "=",
                    max: "=",
                    customClass: "=",
                };
                this.controller = LuidDatePickerController.IID;
            }
            LuidDatePicker.factory = function () {
                var directive = function () {
                    return new LuidDatePicker();
                };
                return directive;
            };
            LuidDatePicker.prototype.link = function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var datePickerCtrl = ctrls[1];
                datePickerCtrl.setFormat(scope.format);
                datePickerCtrl.setNgModelCtrl(ngModelCtrl);
                datePickerCtrl.setCalendarCnt(scope.displayedCalendars);
            };
            LuidDatePicker.IID = "luidDatePicker";
            return LuidDatePicker;
        }());
        var LuidDatePickerPopup = (function () {
            function LuidDatePickerPopup() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/date-picker/datepicker-popup.html";
                this.require = ["ngModel", "luidDatePickerPopup"];
                this.scope = {
                    format: "@",
                    displayFormat: "@",
                    displayedCalendars: "@",
                    minMode: "@",
                    min: "=",
                    max: "=",
                    customClass: "=",
                    placeholder: "@",
                    shortcuts: "=",
                    groupedShortcuts: "=",
                    disableKeyboardInput: "="
                };
                this.controller = LuidDatePickerController.IID;
            }
            LuidDatePickerPopup.factory = function () {
                var directive = function () {
                    return new LuidDatePickerPopup();
                };
                return directive;
            };
            LuidDatePickerPopup.prototype.link = function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var datePickerCtrl = ctrls[1];
                datePickerCtrl.setElement(element);
                datePickerCtrl.setFormat(scope.format, scope.displayFormat);
                datePickerCtrl.setNgModelCtrl(ngModelCtrl);
                datePickerCtrl.setCalendarCnt(scope.displayedCalendars, true);
                datePickerCtrl.setPopoverTrigger(element, scope);
            };
            LuidDatePickerPopup.IID = "luidDatePickerPopup";
            return LuidDatePickerPopup;
        }());
        var LuidDatePickerController = (function (_super) {
            __extends(LuidDatePickerController, _super);
            function LuidDatePickerController($scope, $log, $timeout) {
                var _this = this;
                _super.call(this, $scope, $log);
                this.$scope = $scope;
                $scope.togglePopover = function ($event) {
                    _this.togglePopover($event);
                };
                $scope.openPopover = function ($event) {
                    _this.openPopover($event);
                };
                $scope.closePopoverOnKeyPress = {
                    9: function ($event) { _this.closePopover(); _this.$scope.$apply(); },
                    13: function ($event) { _this.closePopover(); _this.$scope.$apply(); _this.element.find("input")[0].blur(); }
                };
                $scope.$watch("min", function () {
                    _this.min = _this.formatter.parseValue($scope.min);
                    _this.validate();
                    _this.selected = _this.getViewValue();
                    _this.assignClasses();
                });
                $scope.$watch("max", function () {
                    _this.max = _this.formatter.parseValue($scope.max);
                    _this.validate();
                    _this.selected = _this.getViewValue();
                    _this.assignClasses();
                });
                $scope.clear = function ($event) {
                    _this.setViewValue(undefined);
                    _this.$scope.displayStr = "";
                    _this.closePopover();
                    _this.selected = undefined;
                    _this.assignClasses();
                    $event.stopPropagation();
                };
                $scope.selectShortcut = function (shortcut) {
                    var date = _this.formatter.parseValue(shortcut.date);
                    _this.setViewValue(date);
                    _this.$scope.displayStr = _this.getDisplayStr(date);
                    _this.closePopover();
                    _this.selected = date;
                    _this.assignClasses();
                };
                $scope.onDisplayStrChanged = function ($event) {
                    var displayStr = $scope.displayStr;
                    var dateFromStr = moment(displayStr, $scope.displayFormat);
                    if (dateFromStr.isValid()) {
                        _this.setViewValue(dateFromStr);
                        _this.render();
                        $scope.displayStr = displayStr;
                    }
                    else {
                        dateFromStr = moment(displayStr, $scope.format);
                        if (dateFromStr.isValid()) {
                            _this.setViewValue(dateFromStr);
                            _this.render();
                            $scope.displayStr = displayStr;
                        }
                    }
                    _this.validate();
                };
            }
            LuidDatePickerController.prototype.setNgModelCtrl = function (ngModelCtrl) {
                var _this = this;
                this.ngModelCtrl = ngModelCtrl;
                ngModelCtrl.$render = function () { _this.render(); };
                ngModelCtrl.$validators.min = function (modelValue, viewValue) {
                    var min = _this.min;
                    var value = _this.getViewValue();
                    return !value || !min || min.diff(value) <= 0;
                };
                ngModelCtrl.$validators.max = function (modelValue, viewValue) {
                    var max = _this.max;
                    var value = _this.getViewValue();
                    return !value || !max || max.diff(value) >= 0;
                };
                if (!!this.$scope.customClass) {
                    ngModelCtrl.$validators.customClass = function (modelValue, viewValue) {
                        var value = _this.getViewValue();
                        if (!!_this.$scope.customClass && !!value) {
                            var customClass = _this.$scope.customClass(value, datepicker.CalendarMode.Days).toLowerCase();
                            return customClass.indexOf("disabled") === -1 && customClass.indexOf("forbidden") === -1;
                        }
                        return true;
                    };
                }
            };
            LuidDatePickerController.prototype.setFormat = function (format, displayFormat) {
                this.formatter = new lui.formatter.MomentFormatter(format);
                if (format !== "moment" && format !== "date") {
                    this.displayFormat = displayFormat || format || "L";
                }
                else {
                    this.displayFormat = displayFormat || "L";
                }
            };
            LuidDatePickerController.prototype.selectDate = function (date) {
                this.setViewValue(date);
                this.$scope.displayStr = this.getDisplayStr(date);
                this.selected = date;
                this.assignClasses();
                this.closePopover();
            };
            LuidDatePickerController.prototype.setPopoverTrigger = function (elt, $scope) {
                var _this = this;
                var onClosing = function () {
                    _this.ngModelCtrl.$setTouched();
                    _this.closePopover();
                };
                this.popoverController = new lui.popover.ClickoutsideTrigger(elt, $scope, onClosing);
                $scope.popover = { isOpen: false };
                $scope.togglePopover = function ($event) {
                    _this.togglePopover($event);
                };
            };
            LuidDatePickerController.prototype.setElement = function (element) {
                this.element = element;
            };
            LuidDatePickerController.prototype.setViewValue = function (value) {
                this.ngModelCtrl.$setViewValue(this.formatter.formatValue(value));
                this.ngModelCtrl.$setTouched();
            };
            LuidDatePickerController.prototype.getViewValue = function () {
                return this.formatter.parseValue(this.ngModelCtrl.$viewValue);
            };
            LuidDatePickerController.prototype.validate = function () {
                this.ngModelCtrl.$validate();
            };
            LuidDatePickerController.prototype.render = function () {
                var date = this.formatter.parseValue(this.ngModelCtrl.$viewValue);
                this.currentDate = moment(date).startOf("month");
                this.$scope.mode = this.minMode;
                this.$scope.calendars = this.constructCalendars();
                this.selected = date;
                this.min = this.formatter.parseValue(this.$scope.min);
                this.max = this.formatter.parseValue(this.$scope.max);
                this.assignClasses();
                this.$scope.displayStr = this.getDisplayStr(date);
            };
            LuidDatePickerController.prototype.togglePopover = function ($event) {
                if (this.$scope.popover.isOpen) {
                    this.closePopover();
                }
                else {
                    this.openPopover($event);
                }
            };
            LuidDatePickerController.prototype.closePopover = function () {
                this.$scope.displayStr = this.getDisplayStr(this.getViewValue());
                this.$scope.direction = "";
                this.element.removeClass("ng-open");
                if (!!this.popoverController) {
                    this.popoverController.close();
                }
            };
            LuidDatePickerController.prototype.openPopover = function ($event) {
                this.element.addClass("ng-open");
                this.$scope.direction = "init";
                if (!!this.popoverController) {
                    this.render();
                    this.popoverController.open($event);
                }
                if (!this.$scope.disableKeyboardInput) {
                    var input = this.element.children().children()[0];
                    input.select();
                }
            };
            LuidDatePickerController.prototype.getDisplayStr = function (date) {
                return !!date ? date.format(this.displayFormat || "L") : undefined;
            };
            LuidDatePickerController.IID = "luidDatePickerController";
            LuidDatePickerController.$inject = ["$scope", "$log", "$timeout"];
            return LuidDatePickerController;
        }(datepicker.CalendarController));
        angular.module("lui").controller(LuidDatePickerController.IID, LuidDatePickerController);
        angular.module("lui").directive(LuidDatePicker.IID, LuidDatePicker.factory());
        angular.module("lui").directive(LuidDatePickerPopup.IID, LuidDatePickerPopup.factory());
    })(datepicker = lui.datepicker || (lui.datepicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var datepicker;
    (function (datepicker) {
        "use strict";
        angular.module("lui").directive("autoFocus", function () {
            return { restrict: "A", link: function ($scope, element) { element[0].focus(); } };
        });
        var LuidDaterangePicker = (function () {
            function LuidDaterangePicker() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/date-picker/daterangepicker.html";
                this.require = ["ngModel", "luidDaterangePicker"];
                this.scope = {
                    format: "@",
                    displayFormat: "@",
                    rangeFormat: "@",
                    minMode: "@",
                    min: "=",
                    max: "=",
                    customClass: "=",
                    excludeEnd: "@",
                    startProperty: "@",
                    endProperty: "@",
                    placeholder: "@",
                    shortcuts: "=",
                    groupedShortcuts: "=",
                    disableKeyboardInput: "="
                };
                this.controller = LuidDaterangePickerController.IID;
            }
            LuidDaterangePicker.factory = function () {
                return function () { return new LuidDaterangePicker(); };
            };
            LuidDaterangePicker.prototype.link = function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var drCtrl = ctrls[1];
                drCtrl.setNgModelCtrl(ngModelCtrl);
                drCtrl.setFormat(scope.format, scope.displayFormat);
                drCtrl.setCalendarCnt("2", true);
                drCtrl.setPopoverTrigger(element, scope);
                drCtrl.setExcludeEnd(scope.excludeEnd);
                drCtrl.setProperties(scope.startProperty, scope.endProperty);
                drCtrl.setElement(element);
            };
            LuidDaterangePicker.IID = "luidDaterangePicker";
            return LuidDaterangePicker;
        }());
        var LuidDaterangePickerController = (function (_super) {
            __extends(LuidDaterangePickerController, _super);
            function LuidDaterangePickerController($scope, $filter, $log) {
                var _this = this;
                _super.call(this, $scope, $log);
                this.$scope = $scope;
                this.$filter = $filter;
                $scope.internal = {};
                switch (moment.locale()) {
                    case "fr":
                        $scope.fromLabel = "Du";
                        $scope.toLabel = "Au";
                        break;
                    default:
                        $scope.fromLabel = "From";
                        $scope.toLabel = "To";
                        break;
                }
                this.rangeFormatDictionary = {
                    en: {
                        other: $scope.rangeFormat
                    }
                };
                $scope.internal.startDisplayStr = "";
                $scope.internal.endDisplayStr = "";
                $scope.focusEndInputOnTab = { 9: function ($event) { _this.$scope.editEnd($event); } };
                $scope.closePopoverOnTab = { 9: function ($event) { _this.closePopover(); _this.$scope.$apply(); } };
                $scope.selectShortcut = function (shortcut) {
                    $scope.period = _this.toPeriod(shortcut);
                    $scope.displayStr = _this.$filter("luifFriendlyRange")(_this.$scope.period, false, _this.rangeFormatDictionary);
                    _this.setViewValue($scope.period);
                    _this.closePopover();
                };
                $scope.onStartDisplayStrChanged = function ($event) {
                    var displayStr = $scope.internal.startDisplayStr;
                    var format = $scope.displayFormat || "L";
                    var dateFromStr;
                    if (moment(displayStr, format).isValid()) {
                        dateFromStr = moment(displayStr, format);
                    }
                    else if (moment(displayStr, $scope.format).isValid()) {
                        dateFromStr = moment(displayStr, $scope.format);
                    }
                    else {
                        return;
                    }
                    _this.selectDate(dateFromStr, false, false);
                    _this.currentDate = _this.$scope.period.start;
                    _this.start = _this.$scope.period.start;
                    $scope.calendars = _this.constructCalendars();
                    _this.assignClasses();
                };
                $scope.onEndDisplayStrChanged = function ($event) {
                    var displayStr = $scope.internal.endDisplayStr;
                    var format = $scope.displayFormat || "L";
                    var dateFromStr;
                    if (moment(displayStr, format).isValid()) {
                        dateFromStr = moment(displayStr, format);
                    }
                    else if (moment(displayStr, $scope.format).isValid()) {
                        dateFromStr = moment(displayStr, $scope.format);
                    }
                    else {
                        return;
                    }
                    _this.selectDate(dateFromStr, false, false);
                    _this.currentDate = moment(_this.$scope.period.end);
                    _this.end = _this.currentDate;
                    $scope.calendars = _this.constructCalendars();
                    _this.assignClasses();
                };
                $scope.editStart = function ($event) {
                    if (!!$event) {
                        $event.stopPropagation();
                    }
                    $scope.editingStart = true;
                    if (!!_this.$scope.period.start && moment(_this.currentDate).diff(_this.$scope.period.start) > 0) {
                        _this.currentDate = moment(_this.$scope.period.start).startOf("month");
                        _this.$scope.calendars = _this.constructCalendars();
                        _this.assignClasses();
                    }
                };
                $scope.editEnd = function ($event) {
                    if (!!$event) {
                        $event.stopPropagation();
                    }
                    $scope.editingStart = false;
                    if (!!_this.$scope.period.end && moment(_this.currentDate).add(_this.calendarCnt, "months").diff(_this.$scope.period.end) <= 0) {
                        _this.currentDate = moment(_this.$scope.period.end).add(-_this.calendarCnt + 1, "months").startOf("month");
                        _this.$scope.calendars = _this.constructCalendars();
                        _this.assignClasses();
                    }
                };
                $scope.onMouseEnter = function (day, $event) {
                    if (!$scope.editingStart && !_this.$scope.period.end) {
                        _this.end = day.date;
                        _this.assignClasses();
                    }
                };
                $scope.onMouseLeave = function (day, $event) {
                    if (!$scope.editingStart && !_this.$scope.period.end) {
                        _this.end = undefined;
                        _this.assignClasses();
                    }
                };
                $scope.popover = { isOpen: false };
                $scope.clear = function ($event) {
                    $scope.period.start = undefined;
                    $scope.period.end = undefined;
                    _this.setViewValue(undefined);
                    _this.closePopover();
                    $event.stopPropagation();
                };
            }
            LuidDaterangePickerController.prototype.setElement = function (element) {
                this.element = element;
            };
            LuidDaterangePickerController.prototype.setNgModelCtrl = function (ngModelCtrl) {
                var _this = this;
                this.ngModelCtrl = ngModelCtrl;
                ngModelCtrl.$render = function () {
                    if (ngModelCtrl.$viewValue) {
                        _this.$scope.period = _this.getViewValue();
                        _this.$scope.displayStr = _this.$filter("luifFriendlyRange")(_this.$scope.period, false, _this.rangeFormatDictionary);
                        _this.$scope.internal.startDisplayStr = _this.$scope.period.start ? _this.$scope.period.start.format(_this.$scope.displayFormat || "L") : "";
                        _this.$scope.internal.endDisplayStr = _this.$scope.period.end ? _this.$scope.period.end.format(_this.$scope.displayFormat || "L") : "";
                    }
                    else {
                        _this.$scope.period = undefined;
                        _this.$scope.displayStr = undefined;
                        _this.$scope.internal.startDisplayStr = undefined;
                        _this.$scope.internal.endDisplayStr = undefined;
                    }
                };
                ngModelCtrl.$isEmpty = function (value) {
                    var period = _this.toPeriod(value);
                    return !period || (!period.start && !period.end);
                };
                ngModelCtrl.$validators.min = function (modelValue, viewValue) {
                    var start = _this.getViewValue().start;
                    var min = _this.formatter.parseValue(_this.$scope.min);
                    return !start || !min || min.diff(start) <= 0;
                };
                ngModelCtrl.$validators.max = function (modelValue, viewValue) {
                    var end = _this.getViewValue().end;
                    var max = _this.formatter.parseValue(_this.$scope.max);
                    return !end || !max || max.diff(end) >= 0;
                };
                if (!!this.$scope.customClass) {
                    ngModelCtrl.$validators.customClass = function (modelValue, viewValue) {
                        var value = _this.getViewValue();
                        if (!!_this.$scope.customClass && !!value) {
                            var resStart = true, resEnd = true;
                            if (!!value.start) {
                                var customClassStart = _this.$scope.customClass(value.start, datepicker.CalendarMode.Days).toLowerCase();
                                resStart = customClassStart.indexOf("disabled") === -1 && customClassStart.indexOf("forbidden") === -1;
                            }
                            if (!!value.end) {
                                var customClassEnd = _this.$scope.customClass(value.end, datepicker.CalendarMode.Days).toLowerCase();
                                resEnd = customClassEnd.indexOf("disabled") === -1 && customClassEnd.indexOf("forbidden") === -1;
                            }
                            return resStart && resEnd;
                        }
                        return true;
                    };
                }
            };
            LuidDaterangePickerController.prototype.setProperties = function (startProperty, endProperty) {
                this.startProperty = startProperty || "start";
                this.endProperty = endProperty || "end";
            };
            LuidDaterangePickerController.prototype.setExcludeEnd = function (excludeEnd) {
                this.excludeEnd = excludeEnd === "true";
            };
            LuidDaterangePickerController.prototype.setFormat = function (format, displayFormat) {
                this.formatter = new lui.formatter.MomentFormatter(format);
                if (format !== "moment" && format !== "date") {
                    this.$scope.momentFormat = displayFormat || format || "L";
                }
                else {
                    this.$scope.momentFormat = displayFormat || "L";
                }
            };
            LuidDaterangePickerController.prototype.setPopoverTrigger = function (elt, scope) {
                var _this = this;
                var onClosing = function () { _this.closePopover(); };
                this.popoverController = new lui.popover.ClickoutsideTrigger(elt, scope, onClosing);
                scope.togglePopover = function ($event) { _this.togglePopover($event); };
            };
            LuidDaterangePickerController.prototype.selectDate = function (date, goToNextState, updateDisplayStrs) {
                if (goToNextState === void 0) { goToNextState = true; }
                if (updateDisplayStrs === void 0) { updateDisplayStrs = true; }
                if (this.$scope.editingStart) {
                    this.$scope.period.start = date;
                    this.start = date;
                    if (updateDisplayStrs) {
                        this.$scope.internal.startDisplayStr = date.format(this.$scope.displayFormat || "L");
                    }
                    if (goToNextState) {
                        this.$scope.editEnd();
                    }
                    if (!!this.$scope.period.end && this.$scope.period.start.isAfter(this.$scope.period.end)) {
                        this.$scope.period.end = undefined;
                        this.end = undefined;
                    }
                    this.assignClasses();
                }
                else {
                    switch (this.minMode) {
                        case datepicker.CalendarMode.Months:
                            this.$scope.period.end = date.endOf("month").startOf("day");
                            break;
                        case datepicker.CalendarMode.Years:
                            this.$scope.period.end = date.endOf("year").startOf("day");
                            break;
                        default:
                            this.$scope.period.end = date;
                            if (updateDisplayStrs) {
                                this.$scope.internal.endDisplayStr = date.format(this.$scope.displayFormat);
                            }
                    }
                    if (!!this.$scope.period.start) {
                        if (goToNextState) {
                            this.closePopover();
                        }
                    }
                    else {
                        this.$scope.editStart();
                    }
                }
            };
            LuidDaterangePickerController.prototype.setViewValue = function (value) {
                var period = _.clone(this.ngModelCtrl.$viewValue);
                if (!value && !period) {
                    this.$scope.internal.startDisplayStr = "";
                    this.$scope.internal.endDisplayStr = "";
                    return this.ngModelCtrl.$setViewValue(undefined);
                }
                period = period || {};
                if (!value) {
                    period[this.startProperty] = undefined;
                    period[this.endProperty] = undefined;
                    this.$scope.internal.startDisplayStr = "";
                    this.$scope.internal.endDisplayStr = "";
                }
                else {
                    period[this.startProperty] = !!value.start ? this.formatter.formatValue(moment(value.start)) : undefined;
                    period[this.endProperty] = !!value.end ? this.formatter.formatValue(this.excludeEnd ? moment(value.end).add(1, "day") : moment(value.end)) : undefined;
                    this.$scope.internal.startDisplayStr = !!value.start ? value.start.format(this.$scope.displayFormat || "L") : undefined;
                    this.$scope.internal.endDisplayStr = !!value.end ? value.end.format(this.$scope.displayFormat || "L") : undefined;
                }
                this.ngModelCtrl.$setViewValue(period);
            };
            LuidDaterangePickerController.prototype.getViewValue = function () {
                return this.toPeriod(this.ngModelCtrl.$viewValue);
            };
            LuidDaterangePickerController.prototype.toPeriod = function (v) {
                if (!v) {
                    return { start: undefined, end: undefined };
                }
                var iperiod = {};
                iperiod.start = v[this.startProperty];
                iperiod.end = v[this.endProperty];
                var period = new lui.Period(iperiod, this.formatter);
                if (this.excludeEnd && !!period.end) {
                    period.end.add(-1, "day");
                }
                return period;
            };
            LuidDaterangePickerController.prototype.togglePopover = function ($event) {
                if (this.$scope.popover.isOpen) {
                    this.closePopover();
                }
                else {
                    this.openPopover($event);
                }
            };
            LuidDaterangePickerController.prototype.closePopover = function () {
                if (!!this.$scope.period.start && !!this.$scope.period.end && this.$scope.period.start.isAfter(this.$scope.period.end)) {
                    var tmp = this.$scope.period.start;
                    this.$scope.period.start = this.$scope.period.end;
                    this.$scope.period.end = tmp;
                }
                this.$scope.direction = "";
                this.setViewValue(this.$scope.period);
                this.$scope.displayStr = this.$filter("luifFriendlyRange")(this.$scope.period, false, this.rangeFormatDictionary);
                this.element.removeClass("ng-open");
                this.popoverController.close();
            };
            LuidDaterangePickerController.prototype.openPopover = function ($event) {
                var vv = this.getViewValue();
                this.$scope.period = vv || { start: undefined, end: undefined };
                this.currentDate = (!!vv ? moment(vv.start) : moment()).startOf("month");
                this.$scope.mode = this.minMode;
                this.$scope.direction = "init";
                this.$scope.calendars = this.constructCalendars();
                if (!!vv) {
                    this.start = vv.start;
                    this.end = vv.end;
                }
                this.min = this.formatter.parseValue(this.$scope.min);
                this.max = this.formatter.parseValue(this.$scope.max);
                this.assignClasses();
                this.$scope.editingStart = true;
                this.element.addClass("ng-open");
                this.popoverController.open($event);
            };
            LuidDaterangePickerController.IID = "luidDaterangePickerController";
            LuidDaterangePickerController.$inject = ["$scope", "$filter", "$log"];
            return LuidDaterangePickerController;
        }(datepicker.CalendarController));
        angular.module("lui").controller(LuidDaterangePickerController.IID, LuidDaterangePickerController);
        angular.module("lui").directive(LuidDaterangePicker.IID, LuidDaterangePicker.factory());
    })(datepicker = lui.datepicker || (lui.datepicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var departmentpicker;
    (function (departmentpicker) {
        "use strict";
        function DepartmentFilter() {
            return function (departments, clue) {
                var loweredClue = clue.toLowerCase();
                var matching = _.filter(departments, function (department) {
                    return department.name.toLowerCase().indexOf(loweredClue) === 0;
                });
                var containing = _.chain(departments)
                    .difference(matching)
                    .filter(function (department) {
                    return department.name.toLowerCase().indexOf(loweredClue) > -1;
                })
                    .value();
                var childDepartments = _.filter(departments, function (department) {
                    return department.name.toLowerCase().indexOf(loweredClue) === -1
                        && !!department.ancestorsLabel
                        && department.ancestorsLabel.toLowerCase().indexOf(loweredClue) > -1;
                });
                return _.union(matching, containing, childDepartments);
            };
        }
        departmentpicker.DepartmentFilter = DepartmentFilter;
        angular.module("lui").filter("departmentFilter", DepartmentFilter);
    })(departmentpicker = lui.departmentpicker || (lui.departmentpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var departmentpicker;
    (function (departmentpicker) {
        "use strict";
    })(departmentpicker = lui.departmentpicker || (lui.departmentpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var departmentpicker;
    (function (departmentpicker) {
        "use strict";
        departmentpicker.MAGIC_PAGING = 15;
        var LuidDepartmentPickerController = (function () {
            function LuidDepartmentPickerController($scope, $filter, departmentPickerService) {
                this.$scope = $scope;
                this.$filter = $filter;
                this.departmentPickerService = departmentPickerService;
                this.initDepartments();
                this.initScope();
            }
            LuidDepartmentPickerController.prototype.setNgModelCtrl = function (ngModelCtrl) {
                var _this = this;
                this.ngModelCtrl = ngModelCtrl;
                this.ngModelCtrl.$render = function () {
                    if (!!_this.ngModelCtrl.$modelValue) {
                        _this.$scope.internal.selectedDepartment = _this.ngModelCtrl.$modelValue;
                    }
                };
            };
            LuidDepartmentPickerController.prototype.initScope = function () {
                var _this = this;
                this.$scope.internal = { selectedDepartment: undefined };
                this.$scope.selectDepartment = function () {
                    _this.setViewValue(_this.$scope.internal.selectedDepartment);
                };
                this.$scope.loadMore = function (clue) {
                    if (_this.$scope.departmentsToDisplay.length < _this.departments.length) {
                        _this.filterDepartments(clue);
                        _this.$scope.$apply();
                    }
                };
                this.$scope.getLevel = function (department) {
                    return new Array(department.level);
                };
                this.$scope.search = function (clue) {
                    _this.$scope.departmentsToDisplay = [];
                    _this.$scope.$apply();
                    _this.filterDepartments(clue);
                };
            };
            LuidDepartmentPickerController.prototype.initDepartments = function () {
                var _this = this;
                this.$scope.departmentsToDisplay = [];
                this.departmentPickerService.getDepartments()
                    .then(function (departments) {
                    _this.departments = departments;
                    _this.filterDepartments();
                });
            };
            LuidDepartmentPickerController.prototype.filterDepartments = function (clue) {
                if (clue === void 0) { clue = ""; }
                var filteredDepartments = this.$filter("departmentFilter")(this.departments, clue);
                this.$scope.departmentsToDisplay = _.first(filteredDepartments, this.$scope.departmentsToDisplay.length + departmentpicker.MAGIC_PAGING);
            };
            LuidDepartmentPickerController.prototype.setViewValue = function (department) {
                this.ngModelCtrl.$setViewValue(angular.copy(department));
            };
            LuidDepartmentPickerController.IID = "luidDepartmentPickerController";
            LuidDepartmentPickerController.$inject = ["$scope", "$filter", "departmentPickerService"];
            return LuidDepartmentPickerController;
        }());
        departmentpicker.LuidDepartmentPickerController = LuidDepartmentPickerController;
        angular.module("lui").controller(LuidDepartmentPickerController.IID, LuidDepartmentPickerController);
    })(departmentpicker = lui.departmentpicker || (lui.departmentpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var departmentpicker;
    (function (departmentpicker) {
        "use strict";
        var LuidDepartmentPicker = (function () {
            function LuidDepartmentPicker() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/department-picker/department-picker.html";
                this.require = ["^ngModel", LuidDepartmentPicker.IID];
                this.scope = {};
                this.controller = departmentpicker.LuidDepartmentPickerController.IID;
            }
            LuidDepartmentPicker.factory = function () {
                return function () { return new LuidDepartmentPicker(); };
            };
            LuidDepartmentPicker.prototype.link = function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var departmentPickerCtrl = ctrls[1];
                departmentPickerCtrl.setNgModelCtrl(ngModelCtrl);
                scope.onDropdownToggle = function (isOpen) {
                    if (isOpen) {
                        element.addClass("ng-open");
                    }
                    else {
                        element.removeClass("ng-open");
                    }
                };
            };
            LuidDepartmentPicker.IID = "luidDepartmentPicker";
            return LuidDepartmentPicker;
        }());
        angular.module("lui.translate").directive(LuidDepartmentPicker.IID, LuidDepartmentPicker.factory());
    })(departmentpicker = lui.departmentpicker || (lui.departmentpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var departmentpicker;
    (function (departmentpicker) {
        "use strict";
    })(departmentpicker = lui.departmentpicker || (lui.departmentpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var departmentpicker;
    (function (departmentpicker) {
        "use strict";
        var DepartmentPickerService = (function () {
            function DepartmentPickerService($http) {
                this.$http = $http;
            }
            DepartmentPickerService.prototype.getDepartments = function () {
                var _this = this;
                return this.getDepartmentsTree()
                    .then(function (tree) {
                    var departmentTrees = tree.children;
                    var departments = _this.buildDepartmentsArrayRecursively(departmentTrees);
                    return departments;
                });
            };
            DepartmentPickerService.prototype.getDepartmentsTree = function () {
                return this.$http.get("/api/v3/departments/tree?fields=id,name")
                    .then(function (response) {
                    return response.data.data;
                });
            };
            DepartmentPickerService.prototype.buildDepartmentsArrayRecursively = function (departmentTrees) {
                var _this = this;
                var departments = [];
                if (!!departmentTrees) {
                    _.each(departmentTrees, function (departmentTree) {
                        _this.setAncestry(departmentTree.node, departmentTree.children);
                        departments.push(departmentTree.node);
                        departments = _.flatten([departments, _this.buildDepartmentsArrayRecursively(departmentTree.children)]);
                    });
                }
                return departments;
            };
            DepartmentPickerService.prototype.setAncestry = function (department, departmentTrees) {
                var _this = this;
                if (department.level === undefined) {
                    department.level = 0;
                }
                if (departmentTrees.length > 0) {
                    department.hasChild = true;
                }
                _.each(departmentTrees, function (departmentTree) {
                    if (!departmentTree.node.ancestorsLabel) {
                        departmentTree.node.ancestorsLabel = "";
                    }
                    else {
                        departmentTree.node.ancestorsLabel += " > ";
                    }
                    departmentTree.node.ancestorsLabel += department.name;
                    departmentTree.node.level = department.level + 1;
                    _this.setAncestry(department, departmentTree.children);
                });
            };
            DepartmentPickerService.IID = "departmentPickerService";
            DepartmentPickerService.$inject = ["$http"];
            return DepartmentPickerService;
        }());
        angular.module("lui").service(DepartmentPickerService.IID, DepartmentPickerService);
    })(departmentpicker = lui.departmentpicker || (lui.departmentpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    "use strict";
    var Period = (function () {
        function Period(unformatted, formatter) {
            var start = unformatted.start || unformatted.startsOn || unformatted.startsAt;
            var end = unformatted.end || unformatted.endsOn || unformatted.endsAt;
            this.start = formatter.parseValue(start);
            this.end = formatter.parseValue(end);
        }
        return Period;
    }());
    lui.Period = Period;
})(lui || (lui = {}));
var Lui;
(function (Lui) {
    var Filters;
    (function (Filters) {
        "use strict";
        var diacriticsMap = [
            { "base": "A", "letters": /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g },
            { "base": "AA", "letters": /[\uA732]/g },
            { "base": "AE", "letters": /[\u00C6\u01FC\u01E2]/g },
            { "base": "AO", "letters": /[\uA734]/g },
            { "base": "AU", "letters": /[\uA736]/g },
            { "base": "AV", "letters": /[\uA738\uA73A]/g },
            { "base": "AY", "letters": /[\uA73C]/g },
            { "base": "B", "letters": /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g },
            { "base": "C", "letters": /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g },
            { "base": "D", "letters": /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g },
            { "base": "DZ", "letters": /[\u01F1\u01C4]/g },
            { "base": "Dz", "letters": /[\u01F2\u01C5]/g },
            { "base": "E", "letters": /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g },
            { "base": "F", "letters": /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
            { "base": "G", "letters": /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g },
            { "base": "H", "letters": /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g },
            { "base": "I", "letters": /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g },
            { "base": "J", "letters": /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
            { "base": "K", "letters": /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g },
            { "base": "L", "letters": /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g },
            { "base": "LJ", "letters": /[\u01C7]/g },
            { "base": "Lj", "letters": /[\u01C8]/g },
            { "base": "M", "letters": /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g },
            { "base": "N", "letters": /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g },
            { "base": "NJ", "letters": /[\u01CA]/g },
            { "base": "Nj", "letters": /[\u01CB]/g },
            { "base": "O", "letters": /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g },
            { "base": "OI", "letters": /[\u01A2]/g },
            { "base": "OO", "letters": /[\uA74E]/g },
            { "base": "OU", "letters": /[\u0222]/g },
            { "base": "P", "letters": /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g },
            { "base": "Q", "letters": /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
            { "base": "R", "letters": /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g },
            { "base": "S", "letters": /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g },
            { "base": "T", "letters": /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g },
            { "base": "TZ", "letters": /[\uA728]/g },
            { "base": "U", "letters": /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g },
            { "base": "V", "letters": /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g },
            { "base": "VY", "letters": /[\uA760]/g },
            { "base": "W", "letters": /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g },
            { "base": "X", "letters": /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
            { "base": "Y", "letters": /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g },
            { "base": "Z", "letters": /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g },
            { "base": "a", "letters": /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g },
            { "base": "aa", "letters": /[\uA733]/g },
            { "base": "ae", "letters": /[\u00E6\u01FD\u01E3]/g },
            { "base": "ao", "letters": /[\uA735]/g },
            { "base": "au", "letters": /[\uA737]/g },
            { "base": "av", "letters": /[\uA739\uA73B]/g },
            { "base": "ay", "letters": /[\uA73D]/g },
            { "base": "b", "letters": /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
            { "base": "c", "letters": /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g },
            { "base": "d", "letters": /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g },
            { "base": "dz", "letters": /[\u01F3\u01C6]/g },
            { "base": "e", "letters": /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g },
            { "base": "f", "letters": /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
            { "base": "g", "letters": /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g },
            { "base": "h", "letters": /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g },
            { "base": "hv", "letters": /[\u0195]/g },
            { "base": "i", "letters": /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g },
            { "base": "j", "letters": /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
            { "base": "k", "letters": /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g },
            { "base": "l", "letters": /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g },
            { "base": "lj", "letters": /[\u01C9]/g },
            { "base": "m", "letters": /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
            { "base": "n", "letters": /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g },
            { "base": "nj", "letters": /[\u01CC]/g },
            { "base": "o", "letters": /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g },
            { "base": "oi", "letters": /[\u01A3]/g },
            { "base": "ou", "letters": /[\u0223]/g },
            { "base": "oo", "letters": /[\uA74F]/g },
            { "base": "p", "letters": /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
            { "base": "q", "letters": /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
            { "base": "r", "letters": /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g },
            { "base": "s", "letters": /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g },
            { "base": "t", "letters": /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g },
            { "base": "tz", "letters": /[\uA729]/g },
            { "base": "u", "letters": /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g },
            { "base": "v", "letters": /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
            { "base": "vy", "letters": /[\uA761]/g },
            { "base": "w", "letters": /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g },
            { "base": "x", "letters": /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
            { "base": "y", "letters": /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g },
            { "base": "z", "letters": /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }
        ];
        function luifStripAccents() {
            return function (input) {
                if (input === null || input === undefined) {
                    return "";
                }
                _.each(diacriticsMap, function (row) {
                    input = input.replace(row.letters, row.base);
                });
                return input;
            };
        }
        angular.module("lui").filter("luifStripAccents", luifStripAccents);
    })(Filters = Lui.Filters || (Lui.Filters = {}));
})(Lui || (Lui = {}));
var Lui;
(function (Lui) {
    "use strict";
    angular.module("lui.formly")
        .config(["formlyConfigProvider", function (formlyConfigProvider) {
            formlyConfigProvider.setType({
                name: "text",
                templateUrl: "lui/templates/formly/fields/text.html",
            });
            formlyConfigProvider.setType({
                name: "textarea",
                templateUrl: "lui/templates/formly/fields/textarea.html",
            });
            formlyConfigProvider.setType({
                name: "number",
                templateUrl: "lui/templates/formly/fields/number.html",
            });
            formlyConfigProvider.setType({
                name: "email",
                templateUrl: "lui/templates/formly/fields/email.html",
            });
            formlyConfigProvider.setType({
                name: "date",
                templateUrl: "lui/templates/formly/fields/date.html",
            });
            formlyConfigProvider.setType({
                name: "daterange",
                templateUrl: "lui/templates/formly/fields/daterange.html",
            });
            formlyConfigProvider.setType({
                name: "select",
                templateUrl: "lui/templates/formly/fields/select.html",
            });
            formlyConfigProvider.setType({
                name: "checkbox",
                templateUrl: "lui/templates/formly/fields/checkbox.html",
            });
            formlyConfigProvider.setType({
                name: "radio",
                templateUrl: "lui/templates/formly/fields/radio.html",
            });
            formlyConfigProvider.setType({
                name: "picture",
                templateUrl: "lui/templates/formly/fields/picture.html",
            });
            formlyConfigProvider.setType({
                name: "portrait",
                templateUrl: "lui/templates/formly/fields/portrait.html",
            });
            formlyConfigProvider.setType({
                name: "user",
                templateUrl: "lui/templates/formly/fields/user.html",
            });
            formlyConfigProvider.setType({
                name: "user_multiple",
                templateUrl: "lui/templates/formly/fields/user-multiple.html",
            });
            formlyConfigProvider.setType({
                name: "api_select",
                templateUrl: "lui/templates/formly/fields/api-select.html",
            });
            formlyConfigProvider.setType({
                name: "api_select_multiple",
                templateUrl: "lui/templates/formly/fields/api-select-multiple.html",
            });
            formlyConfigProvider.setType({
                name: "iban",
                templateUrl: "lui/templates/formly/fields/iban.html",
            });
            formlyConfigProvider.setType({
                name: "department",
                templateUrl: "lui/templates/formly/fields/department.html",
            });
        }]);
})(Lui || (Lui = {}));
var lui;
(function (lui) {
    "use strict";
})(lui || (lui = {}));
var lui;
(function (lui) {
    var apiselect;
    (function (apiselect) {
        "use strict";
        var MAGIC_PAGING = 25;
        var ApiSelect = (function () {
            function ApiSelect() {
                this.restrict = "AE";
                this.templateUrl = "lui/templates/formly/inputs/api-select.html";
                this.scope = {
                    api: "=",
                    filter: "=",
                    orderBy: "=",
                    placeholder: "@",
                    allowClear: "="
                };
                this.controller = ApiSelectController.IID;
            }
            ApiSelect.factory = function () {
                var directive = function () {
                    return new ApiSelect();
                };
                return directive;
            };
            ApiSelect.prototype.link = function (scope, element) {
                scope.onDropdownToggle = function (isOpen) {
                    if (isOpen) {
                        element.addClass("ng-open");
                    }
                    else {
                        element.removeClass("ng-open");
                    }
                };
            };
            ApiSelect.IID = "luidApiSelect";
            return ApiSelect;
        }());
        var ApiSelectMultiple = (function () {
            function ApiSelectMultiple() {
                this.restrict = "AE";
                this.templateUrl = "lui/templates/formly/inputs/api-select-multiple.html";
                this.scope = {
                    api: "=",
                    filter: "=",
                    orderBy: "=",
                    placeholder: "@"
                };
                this.controller = ApiSelectController.IID;
            }
            ApiSelectMultiple.factory = function () {
                var directive = function () {
                    return new ApiSelectMultiple();
                };
                return directive;
            };
            ApiSelectMultiple.prototype.link = function (scope, element) {
                scope.onDropdownToggle = function (isOpen) {
                    if (isOpen) {
                        element.addClass("ng-open");
                    }
                    else {
                        element.removeClass("ng-open");
                    }
                };
            };
            ApiSelectMultiple.IID = "luidApiSelectMultiple";
            return ApiSelectMultiple;
        }());
        var ApiSelectController = (function () {
            function ApiSelectController($scope, $timeout, service) {
                var _this = this;
                this.offset = 0;
                var delayedReset;
                function resetResults() {
                    if (!!delayedReset) {
                        $timeout.cancel(delayedReset);
                    }
                    delayedReset = $timeout(function () {
                        $scope.refresh("");
                        delayedReset = undefined;
                    }, 250);
                }
                $scope.$watch("filter", function () {
                    resetResults();
                });
                $scope.$watch("api", function () {
                    resetResults();
                });
                $scope.$watch("order", function () {
                    resetResults();
                });
                $scope.refresh = function (clue) {
                    _this.offset = 0;
                    var paging = "0," + MAGIC_PAGING;
                    service.get(clue, $scope.api, $scope.filter, paging, $scope.orderBy)
                        .then(function (choices) {
                        $scope.choices = choices;
                        _this.offset = $scope.choices.length;
                    });
                };
                var loadingPromise;
                $scope.loadMore = function (clue) {
                    if (!loadingPromise) {
                        var paging = _this.offset + "," + (_this.offset + MAGIC_PAGING);
                        $scope.choices.push({ id: 0, loading: true, name: "" });
                        loadingPromise = service.get(clue, $scope.api, $scope.filter, paging, $scope.orderBy)
                            .then(function (nextChoices) {
                            $scope.choices = _.chain($scope.choices)
                                .reject(function (c) { return c.loading; })
                                .union(nextChoices)
                                .uniq(function (c) { return c.id; })
                                .value();
                            _this.offset = $scope.choices.length;
                            loadingPromise = undefined;
                        }, function () {
                            loadingPromise = undefined;
                        });
                    }
                };
            }
            ApiSelectController.IID = "luidApiSelectController";
            ApiSelectController.$inject = [
                "$scope",
                "$timeout",
                "luisStandardApiService",
            ];
            return ApiSelectController;
        }());
        angular.module("lui").controller(ApiSelectController.IID, ApiSelectController);
        angular.module("lui").directive(ApiSelect.IID, ApiSelect.factory());
        angular.module("lui").directive(ApiSelectMultiple.IID, ApiSelectMultiple.factory());
    })(apiselect = lui.apiselect || (lui.apiselect = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var apiselect;
    (function (apiselect) {
        "use strict";
        var StandardApiService = (function () {
            function StandardApiService($http) {
                this.$http = $http;
            }
            StandardApiService.prototype.get = function (clue, api, additionalFilter, paging, order) {
                var clueFilter = !!clue ? "name=like," + clue : undefined;
                var pagingFilter = paging ? "paging=" + paging : undefined;
                var fields = "fields=id,name";
                var orderBy = !!order ? "orderBy=" + order : undefined;
                var filter = _.reject([fields, clueFilter, pagingFilter, additionalFilter, orderBy], function (i) { return !i; }).join("&");
                return this.$http.get(api + "?" + filter)
                    .then(function (response) {
                    if (api.indexOf("/v3/") !== -1) {
                        return response.data.data.items;
                    }
                    else {
                        return response.data.data;
                    }
                });
            };
            StandardApiService.IID = "luisStandardApiService";
            StandardApiService.$inject = ["$http"];
            return StandardApiService;
        }());
        apiselect.StandardApiService = StandardApiService;
        angular.module("lui").service(StandardApiService.IID, StandardApiService);
    })(apiselect = lui.apiselect || (lui.apiselect = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var iban;
    (function (iban_1) {
        "use strict";
        var LuidIbanController = (function () {
            function LuidIbanController($scope, iban) {
                this.$scope = $scope;
                this.ibanChecker = iban;
                this.initScope();
            }
            LuidIbanController.prototype.setNgModelCtrl = function (ngModelCtrl) {
                var _this = this;
                this.ngModelCtrl = ngModelCtrl;
                this.ngModelCtrl.$render = function () {
                    var iban = _this.getViewValue() ? _this.getViewValue().replace(" ", "") : null;
                    if (!!iban) {
                        _this.$scope.countryCode = iban.substring(0, 2);
                        _this.$scope.controlKey = iban.substring(2, 4);
                        _this.$scope.bban = iban.substring(4);
                    }
                    else {
                        _this.$scope.countryCode = "";
                        _this.$scope.controlKey = "";
                        _this.$scope.bban = "";
                    }
                };
                this.ngModelCtrl.$validators.iban = function () {
                    if (!!_this.ngModelCtrl.$viewValue) {
                        return _this.ibanChecker.isValid(ngModelCtrl.$viewValue);
                    }
                    return true;
                };
                this.ngModelCtrl.$validators.maxlength = function () {
                    if (!!_this.ngModelCtrl.$viewValue) {
                        return _this.ngModelCtrl.$viewValue.length <= 34;
                    }
                    return true;
                };
            };
            LuidIbanController.prototype.setInputs = function (elt) {
                var inputs = elt.find("input");
                this.countryInput = angular.element(inputs[0]);
                this.controlInput = angular.element(inputs[1]);
                this.bbanInput = angular.element(inputs[2]);
            };
            LuidIbanController.prototype.initScope = function () {
                var _this = this;
                this.$scope.updateValue = function () {
                    _this.setViewValue(_this.$scope.countryCode.toUpperCase() + _this.$scope.controlKey.toUpperCase() + _this.$scope.bban.toUpperCase());
                };
                this.$scope.pasteIban = function (event) {
                    var originalEvent = event instanceof ClipboardEvent ? event : event.originalEvent;
                    _this.setViewValue(originalEvent.clipboardData.getData("text/plain").replace(/ /g, ""));
                    _this.ngModelCtrl.$render();
                    originalEvent.target.blur();
                };
                this.$scope.selectInput = function (event) {
                    event.target.select();
                };
                this.$scope.setTouched = function () {
                    _this.setTouched();
                };
                this.$scope.controlKeyMappings = {
                    8: function () {
                        if (!_this.$scope.controlKey) {
                            _this.focusCountryInput();
                        }
                    }
                };
                this.$scope.bbanMappings = {
                    8: function () {
                        if (!_this.$scope.bban) {
                            _this.focusControlInput();
                        }
                    }
                };
            };
            LuidIbanController.prototype.getViewValue = function () {
                return this.ngModelCtrl.$viewValue;
            };
            LuidIbanController.prototype.setViewValue = function (iban) {
                this.ngModelCtrl.$setViewValue(iban);
                this.ngModelCtrl.$setTouched();
            };
            LuidIbanController.prototype.setTouched = function () {
                this.ngModelCtrl.$setTouched();
            };
            LuidIbanController.prototype.focusCountryInput = function () {
                this.countryInput[0].focus();
                this.countryInput[0]["selectionStart"] = this.countryInput[0]["selectionEnd"];
            };
            LuidIbanController.prototype.focusControlInput = function () {
                this.controlInput[0].focus();
                this.controlInput[0]["selectionStart"] = this.controlInput[0]["selectionEnd"];
            };
            LuidIbanController.IID = "luidIbanController";
            LuidIbanController.$inject = ["$scope", "iban"];
            return LuidIbanController;
        }());
        iban_1.LuidIbanController = LuidIbanController;
        angular.module("lui.iban").controller(LuidIbanController.IID, LuidIbanController);
    })(iban = lui.iban || (lui.iban = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var iban;
    (function (iban) {
        "use strict";
        var LuidIban = (function () {
            function LuidIban() {
                this.restrict = "AE";
                this.templateUrl = "lui/templates/iban/iban.view.html";
                this.require = [LuidIban.IID, "^ngModel"];
                this.controller = iban.LuidIbanController.IID;
                this.scope = {};
            }
            LuidIban.factory = function () {
                var directive = function () {
                    return new LuidIban();
                };
                return directive;
            };
            LuidIban.prototype.link = function (scope, element, attrs, ctrls) {
                var ibanCtrl = ctrls[0];
                var ngModelCtrl = ctrls[1];
                ibanCtrl.setNgModelCtrl(ngModelCtrl);
                ibanCtrl.setInputs(element);
            };
            LuidIban.IID = "luidIban";
            return LuidIban;
        }());
        iban.LuidIban = LuidIban;
        angular.module("lui.iban").directive(LuidIban.IID, LuidIban.factory());
    })(iban = lui.iban || (lui.iban = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var iban;
    (function (iban) {
        "use strict";
    })(iban = lui.iban || (lui.iban = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var iban;
    (function (iban) {
        "use strict";
    })(iban = lui.iban || (lui.iban = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var iban;
    (function (iban) {
        "use strict";
        var LuidSelectNext = (function () {
            function LuidSelectNext() {
                this.restrict = "A";
            }
            LuidSelectNext.factory = function () {
                var directive = function () {
                    return new LuidSelectNext();
                };
                return directive;
            };
            LuidSelectNext.prototype.link = function (scope, element, attrs) {
                element.on("input", function (event) {
                    if (!!element[0].maxLength && (element[0].value.length === element[0].maxLength)) {
                        var nextElements = element.next();
                        if (nextElements.length) {
                            nextElements[0].select();
                        }
                    }
                });
            };
            LuidSelectNext.IID = "luidSelectNext";
            return LuidSelectNext;
        }());
        iban.LuidSelectNext = LuidSelectNext;
        angular.module("lui.iban").directive(LuidSelectNext.IID, LuidSelectNext.factory());
    })(iban = lui.iban || (lui.iban = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    "use strict";
})(lui || (lui = {}));
var lui;
(function (lui) {
    var imagepicker;
    (function (imagepicker) {
        "use strict";
        var LuidImageCropper = (function () {
            function LuidImageCropper() {
                this.controller = LuidImageCropperController.IID;
                this.restrict = "AE";
                this.scope = {
                    onCropped: "=",
                    onCancelled: "=",
                    croppingRatio: "=",
                    croppingDisabled: "=",
                };
                this.link = function (scope, element, attrs) {
                    var handleFileSelect = function (evt) {
                        var file = evt.currentTarget.files[0];
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            scope.$apply(function ($scope) {
                                scope.image = event.target.result;
                                scope.fileName = file.name;
                                if (!scope.croppingDisabled) {
                                    scope.openCropper();
                                }
                                else {
                                    scope.onCropped(scope.image, scope.fileName);
                                }
                                if (element[0] != null) {
                                    element[0].value = "";
                                }
                            });
                        };
                        reader.readAsDataURL(file);
                    };
                    angular.element(element[0]).on("change", handleFileSelect);
                };
            }
            LuidImageCropper.Factory = function () {
                var directive = function () { return new LuidImageCropper(); };
                directive.$inject = [];
                return directive;
            };
            ;
            ;
            LuidImageCropper.IID = "luidImageCropper";
            return LuidImageCropper;
        }());
        imagepicker.LuidImageCropper = LuidImageCropper;
        var LuidImageCropperController = (function () {
            function LuidImageCropperController($scope, moment, $uibModal, luisConfig) {
                $scope.image = "";
                $scope.cropped = "";
                $scope.openCropper = function () {
                    var modalOptions = {
                        templateUrl: "lui/templates/image-picker/image-cropper.modal.html",
                        controller: LuidImageCropperModalController.IID,
                        size: "desktop",
                        resolve: {
                            image: function () {
                                return $scope.image;
                            },
                            fileName: function () {
                                return $scope.fileName;
                            },
                            croppingRatio: function () {
                                return $scope.croppingRatio;
                            },
                            cancelLabel: function () {
                                return luisConfig.cancelLabel;
                            }
                        },
                    };
                    var modalInstance = $uibModal.open(modalOptions);
                    modalInstance.result.then(function (_a) {
                        var image = _a.image, cropped = _a.cropped;
                        $scope.cropped = image;
                        var tempFileName = cropped ? $scope.fileName.substr(0, $scope.fileName.lastIndexOf(".")) + ".png" : $scope.fileName;
                        $scope.onCropped(image, tempFileName);
                    }, function () {
                        if (!!$scope.onCancelled) {
                            $scope.onCancelled();
                        }
                    });
                };
            }
            LuidImageCropperController.IID = "luidImageCropperController";
            LuidImageCropperController.$inject = ["$scope", "moment", "$uibModal", "luisConfig"];
            return LuidImageCropperController;
        }());
        var LuidImageCropperModalController = (function () {
            function LuidImageCropperModalController($scope, $uibModalInstance, moment, image, fileName, croppingRatio, cancelLabel) {
                var doClose = false;
                $scope.image = image;
                $scope.fileName = fileName;
                $scope.cancelLabel = cancelLabel;
                $scope.croppingRatio = croppingRatio;
                $scope.crop = function () {
                    doClose = true;
                    $uibModalInstance.close({ image: $scope.cropped, cropped: true });
                };
                $scope.donotcrop = function () {
                    doClose = true;
                    $uibModalInstance.close({ image: $scope.image, cropped: false });
                };
                $scope.cancel = function () {
                    doClose = true;
                    $uibModalInstance.dismiss();
                };
                $scope.$on("modal.closing", function ($event) {
                    if (!doClose) {
                        $event.preventDefault();
                    }
                });
            }
            LuidImageCropperModalController.IID = "luidImageCropperModalController";
            LuidImageCropperModalController.$inject = ["$scope", "$uibModalInstance", "moment", "image", "croppingRatio", "cancelLabel"];
            return LuidImageCropperModalController;
        }());
        angular.module("lui.crop").directive(LuidImageCropper.IID, LuidImageCropper.Factory());
        angular.module("lui.crop").controller(LuidImageCropperController.IID, LuidImageCropperController);
        angular.module("lui.crop").controller(LuidImageCropperModalController.IID, LuidImageCropperModalController);
    })(imagepicker = lui.imagepicker || (lui.imagepicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var imagepicker;
    (function (imagepicker) {
        "use strict";
        var LuidImagePicker = (function () {
            function LuidImagePicker() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/image-picker/image-picker.html";
                this.require = ["ngModel", LuidImagePicker.IID];
                this.scope = {
                    placeholderUrl: "@",
                    croppingRatio: "=",
                    croppingDisabled: "=",
                    deleteEnabled: "=?",
                    hideEditHint: "=",
                    isDisabled: "="
                };
                this.controller = LuidImagePickerController.IID;
            }
            LuidImagePicker.factory = function () {
                var directive = function () {
                    return new LuidImagePicker();
                };
                return directive;
            };
            LuidImagePicker.prototype.link = function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var imgPickerCtrl = ctrls[1];
                imgPickerCtrl.setNgModelCtrl(ngModelCtrl);
                imgPickerCtrl.setPlaceholder(scope.placeholderUrl);
                imgPickerCtrl.setPopoverTrigger(element, scope);
                imgPickerCtrl.setElements(element);
            };
            LuidImagePicker.IID = "luidImagePicker";
            return LuidImagePicker;
        }());
        var LuidImagePickerController = (function () {
            function LuidImagePickerController($scope, uploaderService, $timeout) {
                var _this = this;
                this.$scope = $scope;
                this.$scope.deleteEnabled = this.$scope.deleteEnabled == null ? true : this.$scope.deleteEnabled;
                $scope.setTouched = function () {
                    _this.ngModelCtrl.$setTouched();
                };
                $scope.uploadNewImage = function ($event) {
                    $timeout(function () {
                        _this.inputElement.click();
                        _this.closePopover();
                    });
                };
                $scope.onCropped = function (cropped, fileName) {
                    $scope.uploading = true;
                    uploaderService.postDataURI(cropped, fileName)
                        .then(function (file) {
                        $scope.uploading = false;
                        _this.setViewValue(file);
                        _this.$scope.pictureStyle = { "background-image": "url('" + file.href + "')" };
                    }, function (message) {
                        _this.ngModelCtrl.$setTouched();
                        $scope.uploading = false;
                    });
                };
                $scope.onCancelled = function () {
                    $scope.file = undefined;
                    _this.ngModelCtrl.$setTouched();
                };
                $scope.onDelete = function () {
                    _this.setViewValue(undefined);
                    $scope.file = undefined;
                    _this.$scope.pictureStyle = { "background-image": "url('" + _this.placeholder + "')" };
                    _this.closePopover();
                };
            }
            LuidImagePickerController.prototype.setNgModelCtrl = function (ngModelCtrl) {
                var _this = this;
                this.ngModelCtrl = ngModelCtrl;
                ngModelCtrl.$render = function () {
                    _this.$scope.file = _this.getViewValue();
                    if (!!_this.$scope.file && !!_this.$scope.file.href) {
                        _this.$scope.pictureStyle = { "background-image": "url('" + _this.$scope.file.href + "')" };
                    }
                    else {
                        _this.$scope.pictureStyle = { "background-image": "url('" + _this.placeholder + "')" };
                    }
                };
            };
            LuidImagePickerController.prototype.setPlaceholder = function (placeholder) {
                this.placeholder = placeholder || "/static/common/images/placeholder-pp.png";
            };
            LuidImagePickerController.prototype.setPopoverTrigger = function (elt, scope) {
                var _this = this;
                var onClosing = function () {
                    _this.closePopover();
                };
                this.popoverController = new lui.popover.ClickoutsideTrigger(elt, scope, onClosing);
                scope.popover = { isOpen: false };
                scope.togglePopover = function ($event) {
                    $event.preventDefault();
                    if (!!scope.file && !!scope.file.href && !!scope.deleteEnabled) {
                        _this.togglePopover($event);
                    }
                    else {
                        _this.$scope.uploadNewImage($event);
                    }
                };
            };
            LuidImagePickerController.prototype.setElements = function (elt) {
                this.inputElement = elt.find("input")[0];
            };
            LuidImagePickerController.prototype.togglePopover = function ($event) {
                if (this.$scope.popover.isOpen) {
                    this.closePopover();
                }
                else {
                    this.openPopover($event);
                }
            };
            LuidImagePickerController.prototype.closePopover = function () {
                if (!!this.popoverController) {
                    this.popoverController.close();
                }
            };
            LuidImagePickerController.prototype.openPopover = function ($event) {
                if (!!this.popoverController) {
                    this.popoverController.open($event);
                }
            };
            LuidImagePickerController.prototype.getViewValue = function () {
                return this.ngModelCtrl.$viewValue;
            };
            LuidImagePickerController.prototype.setViewValue = function (file) {
                this.ngModelCtrl.$setTouched();
                this.ngModelCtrl.$setViewValue(file);
                this.$scope.file = file;
            };
            LuidImagePickerController.IID = "luidImagePickerController";
            LuidImagePickerController.$inject = ["$scope", "uploaderService", "$timeout"];
            return LuidImagePickerController;
        }());
        angular.module("lui.crop").directive(LuidImagePicker.IID, LuidImagePicker.factory());
        angular.module("lui.crop").controller(LuidImagePickerController.IID, LuidImagePickerController);
    })(imagepicker = lui.imagepicker || (lui.imagepicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var imagepicker;
    (function (imagepicker) {
        "use strict";
        angular.module("lui.crop").config(["$translateProvider", function ($translateProvider) {
                $translateProvider.translations("en", {
                    "LUIIMGPICKER_UPLOAD_IMAGE": "change picture",
                    "LUIIMGPICKER_MODIFY_IMAGE": "modify picture",
                    "LUIIMGPICKER_DELETE_IMAGE": "delete picture",
                    "LUIIMGCROPPER_CROP": "Crop",
                    "LUIIMGCROPPER_DO_NOT_CROP": "Do not crop",
                });
                $translateProvider.translations("de", {});
                $translateProvider.translations("es", {});
                $translateProvider.translations("fr", {
                    "LUIIMGPICKER_UPLOAD_IMAGE": "changer l'image",
                    "LUIIMGPICKER_MODIFY_IMAGE": "modifier l'image",
                    "LUIIMGPICKER_DELETE_IMAGE": "supprimer l'image",
                    "LUIIMGCROPPER_CROP": "Recadrer",
                    "LUIIMGCROPPER_DO_NOT_CROP": "Ne pas recadrer",
                });
                $translateProvider.translations("it", {});
                $translateProvider.translations("nl", {});
            }]);
    })(imagepicker = lui.imagepicker || (lui.imagepicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    "use strict";
})(lui || (lui = {}));
var lui;
(function (lui) {
    var notify;
    (function (notify_1) {
        "use strict";
        var Log = (function () {
            function Log(message, details) {
                this.message = message;
                this.details = details;
            }
            return Log;
        }());
        var errorTemplate = "lui/templates/notify-service/error.html";
        var warningTemplate = "lui/templates/notify-service/warning.html";
        var successTemplate = "lui/templates/notify-service/success.html";
        var loadingTemplate = "lui/templates/notify-service/loading.html";
        var alertTemplate = "lui/templates/notify-service/alert.html";
        var confirmTemplate = "lui/templates/notify-service/confirm.html";
        var ANotify = (function () {
            function ANotify(duration, templateUrl, message) {
                this.duration = duration;
                this.templateUrl = templateUrl;
                this.message = message;
            }
            return ANotify;
        }());
        var ErrorNotify = (function (_super) {
            __extends(ErrorNotify, _super);
            function ErrorNotify(message) {
                _super.call(this, 20000, errorTemplate, message);
            }
            return ErrorNotify;
        }(ANotify));
        var WarningNotify = (function (_super) {
            __extends(WarningNotify, _super);
            function WarningNotify(message) {
                _super.call(this, 10000, warningTemplate, message);
            }
            return WarningNotify;
        }(ANotify));
        var SuccessNotify = (function (_super) {
            __extends(SuccessNotify, _super);
            function SuccessNotify(message) {
                _super.call(this, 5000, successTemplate, message);
            }
            return SuccessNotify;
        }(ANotify));
        var LoadingNotify = (function (_super) {
            __extends(LoadingNotify, _super);
            function LoadingNotify(scope, message) {
                _super.call(this, 86400000, loadingTemplate, message);
                this.scope = scope;
            }
            return LoadingNotify;
        }(ANotify));
        var NotifyService = (function () {
            function NotifyService(notify, $q, $log, $rootScope, $timeout, $uibModal, luisConfig) {
                this.cgNotify = notify;
                this.$q = $q;
                this.$log = $log;
                this.$rootScope = $rootScope;
                this.$timeout = $timeout;
                this.$uibModal = $uibModal;
                this.luisConfig = luisConfig;
                this.cgNotify.config({
                    container: this.luisConfig.parentElt,
                    startTop: this.luisConfig.startTop,
                });
            }
            NotifyService.prototype.error = function (message, details) {
                this.$log.error(new Log(message, details));
                this.cgNotify(new ErrorNotify(message));
            };
            NotifyService.prototype.warning = function (message, details) {
                this.$log.warn(new Log(message, details));
                this.cgNotify(new WarningNotify(message));
            };
            NotifyService.prototype.success = function (message, details) {
                this.$log.log(new Log(message, details));
                this.cgNotify(new SuccessNotify(message));
            };
            NotifyService.prototype.alert = function (message, okLabel, cancelLabel) {
                return this.openModal(alertTemplate, message, okLabel || this.luisConfig.okLabel, cancelLabel || this.luisConfig.cancelLabel, false);
            };
            NotifyService.prototype.confirm = function (message, okLabel, cancelLabel) {
                return this.openModal(confirmTemplate, message, okLabel || this.luisConfig.okLabel, cancelLabel || this.luisConfig.cancelLabel, !this.luisConfig.canDismissConfirm);
            };
            NotifyService.prototype.loading = function (loadingPromise, message, cancelFn) {
                var _this = this;
                var isolateScope = this.$rootScope.$new(true);
                isolateScope.loading = true;
                isolateScope.calloutClass = "light";
                isolateScope.message = message;
                var popup = this.cgNotify(new LoadingNotify(isolateScope, message));
                var closePopup = function (ms) {
                    _this.$timeout(function () {
                        popup.close();
                        isolateScope.$destroy();
                    }, ms);
                };
                if (!!cancelFn) {
                    isolateScope.canCancel = true;
                    isolateScope.cancel = function () {
                        _this.$log.warn(new Log(message, "user cancelled"));
                        cancelFn();
                        closePopup(0);
                    };
                }
                loadingPromise.then(function (newMessage) {
                    isolateScope.message = newMessage;
                    isolateScope.calloutClass = "green";
                    isolateScope.loading = false;
                    closePopup(5000);
                }, function (newMessage) {
                    isolateScope.message = newMessage;
                    isolateScope.calloutClass = "red";
                    isolateScope.loading = false;
                    _this.$log.error(new Log(message, ""));
                    closePopup(20000);
                }, function (newMessage) {
                    isolateScope.message = newMessage;
                });
            };
            NotifyService.prototype.openModal = function (templateUrl, message, okLabel, cancelLabel, preventDismiss) {
                return this.$uibModal.open({
                    templateUrl: templateUrl,
                    controller: NotifyModalController.IID,
                    size: "mobile",
                    resolve: {
                        message: function () {
                            return message;
                        },
                        okLabel: function () {
                            return okLabel;
                        },
                        cancelLabel: function () {
                            return cancelLabel;
                        },
                        preventDismiss: function () {
                            return preventDismiss;
                        },
                    }
                }).result;
            };
            NotifyService.IID = "luisNotify";
            NotifyService.$inject = ["notify", "$q", "$log", "$rootScope", "$timeout", "$uibModal", "luisConfig"];
            return NotifyService;
        }());
        notify_1.NotifyService = NotifyService;
        var NotifyModalController = (function () {
            function NotifyModalController($scope, $uibModalInstance, message, okLabel, cancelLabel, preventDismiss) {
                var _this = this;
                $scope.message = message;
                $scope.okLabel = okLabel;
                $scope.cancelLabel = cancelLabel;
                $scope.ok = function () {
                    _this.doClose = true;
                    $uibModalInstance.close(true);
                };
                $scope.cancel = function () {
                    _this.doClose = true;
                    $uibModalInstance.close(false);
                };
                if (preventDismiss) {
                    $scope.$on("modal.closing", function ($event) {
                        if (!_this.doClose) {
                            $event.preventDefault();
                        }
                    });
                }
            }
            NotifyModalController.IID = "notifyModalController";
            NotifyModalController.$inject = ["$scope", "$uibModalInstance", "message", "okLabel", "cancelLabel", "preventDismiss"];
            return NotifyModalController;
        }());
        angular.module("lui.notify").service(NotifyService.IID, NotifyService);
        angular.module("lui.notify").controller(NotifyModalController.IID, NotifyModalController);
    })(notify = lui.notify || (lui.notify = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var progressbar;
    (function (progressbar) {
        "use strict";
        var LuiHttpInterceptor = (function () {
            function LuiHttpInterceptor($q, $cacheFactory, $timeout, progressBarService) {
                var _this = this;
                this.totalRequests = 0;
                this.completedRequests = 0;
                this.request = function (config) {
                    if (!_this.isCached(config)) {
                        _this.startRequest(config.method);
                    }
                    return config;
                };
                this.requestError = function (rejection) {
                    _this.startRequest("GET");
                    return _this.$q.reject(rejection);
                };
                this.response = function (response) {
                    if (!!response && !_this.isCached(response.config)) {
                        _this.endRequest(_this.extractMethod(response));
                    }
                    return response;
                };
                this.responseError = function (rejection) {
                    _this.endRequest("GET");
                    return (_this.$q.reject(rejection));
                };
                this.isCached = function (config) {
                    var cache;
                    var defaultCache = _this.$cacheFactory.get("$http");
                    if ((config.cache)
                        && config.cache !== false
                        && (config.method === "GET" || config.method === "JSONP")) {
                        if (angular.isObject(config.cache)) {
                            cache = config.cache;
                        }
                        else {
                            cache = defaultCache;
                        }
                    }
                    var cached = cache !== undefined ? cache.get(config.url) !== undefined : false;
                    if (config.cached !== undefined && cached !== config.cached) {
                        return config.cached;
                    }
                    config.cached = cached;
                    return cached;
                };
                this.extractMethod = function (response) {
                    try {
                        return (response.config.method);
                    }
                    catch (error) {
                        return ("GET");
                    }
                };
                this.startRequest = function (httpMethod) {
                    if (_this.progressBarService.isListening()) {
                        if (_this.progressBarService.getHttpRequestMethods().indexOf(httpMethod) > -1) {
                            if (_this.totalRequests === 0) {
                                _this.progressBarService.start();
                            }
                            _this.totalRequests++;
                        }
                    }
                    else {
                        _this.totalRequests = 0;
                        _this.completedRequests = 0;
                    }
                };
                this.setComplete = function () {
                    if (!!_this.completeTimeout) {
                        _this.$timeout.cancel(_this.completeTimeout);
                    }
                    _this.completeTimeout = _this.$timeout(function () {
                        _this.progressBarService.complete();
                        _this.totalRequests = 0;
                        _this.completedRequests = 0;
                    }, 200);
                };
                this.endRequest = function (httpMethod) {
                    if (_this.progressBarService.isListening()) {
                        if (_this.progressBarService.getHttpRequestMethods().indexOf(httpMethod) > -1) {
                            _this.completedRequests++;
                            if (_this.completedRequests >= _this.totalRequests) {
                                _this.setComplete();
                            }
                        }
                    }
                };
                this.$q = $q;
                this.$cacheFactory = $cacheFactory;
                this.$timeout = $timeout;
                this.progressBarService = progressBarService;
            }
            LuiHttpInterceptor.IID = "luiHttpInterceptor";
            LuiHttpInterceptor.$inject = ["$q", "$cacheFactory", "$timeout", "luisProgressBar"];
            return LuiHttpInterceptor;
        }());
        angular.module("lui").service(LuiHttpInterceptor.IID, LuiHttpInterceptor);
    })(progressbar = lui.progressbar || (lui.progressbar = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    "use strict";
})(lui || (lui = {}));
var lui;
(function (lui) {
    var progressbar;
    (function (progressbar) {
        "use strict";
        var ProgressBarService = (function () {
            function ProgressBarService($document, $window, $timeout, $interval, $log, luisConfig) {
                this.latencyThreshold = 200;
                this.httpResquestListening = false;
                this.status = 0;
                this.progressBarTemplate = '<div class="lui slim progressing progress progress-bar"><div class="indicator" data-percentage="0" style="width: 0%;"></div></div>';
                this.$document = $document;
                this.$window = $window;
                this.$timeout = $timeout;
                this.$interval = $interval;
                this.$log = $log;
                this.luisConfig = luisConfig;
            }
            ProgressBarService.prototype.addProgressBar = function (palette) {
                if (palette === void 0) { palette = "primary"; }
                if (!!this.progressbarEl) {
                    this.progressbarEl.remove();
                }
                this.progressbarEl = angular.element(this.progressBarTemplate);
                this.progressbarEl.addClass(palette);
                this.luisConfig.parentElt.append(this.progressbarEl);
            };
            ;
            ProgressBarService.prototype.startListening = function (httpRequestMethods) {
                this.httpResquestListening = true;
                if (!!httpRequestMethods) {
                    this.httpRequestMethods = httpRequestMethods;
                }
                else {
                    this.httpRequestMethods = ["GET"];
                }
                this.setStatus(0);
            };
            ;
            ProgressBarService.prototype.stopListening = function () {
                this.httpResquestListening = false;
                this.setStatus(0);
            };
            ;
            ProgressBarService.prototype.isListening = function () {
                return this.httpResquestListening;
            };
            ;
            ProgressBarService.prototype.getHttpRequestMethods = function () {
                return this.httpRequestMethods;
            };
            ;
            ProgressBarService.prototype.start = function () {
                var _this = this;
                if (!this.isStarted) {
                    this.isStarted = true;
                    this.$timeout.cancel(this.completeTimeout);
                    this.$interval.cancel(this.currentPromiseInterval);
                    this.show();
                    this.currentPromiseInterval = this.$interval(function () {
                        if (isNaN(_this.status)) {
                            _this.$interval.cancel(_this.currentPromiseInterval);
                            _this.setStatus(0);
                            _this.hide();
                        }
                        else {
                            var remaining = 100 - _this.status;
                            if (remaining > 30) {
                                _this.setStatus(_this.status + (0.5 * Math.sqrt(remaining)));
                            }
                            else {
                                _this.setStatus(_this.status + (0.15 * Math.pow(1 - Math.sqrt(remaining), 2)));
                            }
                        }
                    }, this.latencyThreshold);
                }
            };
            ;
            ProgressBarService.prototype.complete = function () {
                this.$interval.cancel(this.currentPromiseInterval);
                this.isStarted = false;
                this.httpResquestListening = false;
                this.setStatus(100);
                this.hide();
            };
            ;
            ProgressBarService.prototype.hide = function () {
                var _this = this;
                this.$timeout(function () {
                    if (!!_this.progressbarEl) {
                        _this.progressbarEl.removeClass("in");
                        _this.progressbarEl.addClass("out");
                        _this.setStatus(0);
                    }
                }, 300);
            };
            ;
            ProgressBarService.prototype.show = function () {
                if (!!this.progressbarEl) {
                    this.progressbarEl.removeClass("out");
                    this.progressbarEl.addClass("in");
                    this.setStatus(0);
                }
            };
            ;
            ProgressBarService.prototype.setStatus = function (status) {
                this.status = status;
                if (!!this.progressbarEl) {
                    this.progressbarEl.children().css("width", this.status + "%");
                    this.progressbarEl.children().attr("data-percentage", this.status);
                }
            };
            ;
            ProgressBarService.IID = "luisProgressBar";
            ProgressBarService.$inject = ["$document", "$window", "$timeout", "$interval", "$log", "luisConfig"];
            return ProgressBarService;
        }());
        angular.module("lui").service(ProgressBarService.IID, ProgressBarService);
    })(progressbar = lui.progressbar || (lui.progressbar = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var tablegrid;
    (function (tablegrid) {
        "use strict";
        (function (FilterType) {
            FilterType[FilterType["NONE"] = 0] = "NONE";
            FilterType[FilterType["TEXT"] = 1] = "TEXT";
            FilterType[FilterType["SELECT"] = 2] = "SELECT";
            FilterType[FilterType["MULTISELECT"] = 3] = "MULTISELECT";
        })(tablegrid.FilterType || (tablegrid.FilterType = {}));
        var FilterType = tablegrid.FilterType;
    })(tablegrid = lui.tablegrid || (lui.tablegrid = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var tablegrid;
    (function (tablegrid) {
        "use strict";
        var LuidTableGridController = (function () {
            function LuidTableGridController($filter, $scope, $translate, $timeout) {
                var maxDepth = 0;
                $scope.isSelectable = angular.isDefined($scope.selectable);
                $scope.internalRowClick = function (event, row) {
                    var currentNode = event.target;
                    var otherClickEventFired = false;
                    while (!otherClickEventFired && currentNode.nodeName !== event.currentTarget.nodeName) {
                        otherClickEventFired = !!currentNode.href || currentNode.type === "checkbox";
                        currentNode = currentNode.parentElement;
                    }
                    if (!otherClickEventFired) {
                        $scope.onRowClick({ row: row });
                    }
                };
                var browse = function (result) {
                    if (!result.tree.children.length) {
                        result.subChildren++;
                    }
                    ;
                    result.tree.children.forEach(function (child) {
                        var subResult = browse({ depth: result.depth + 1, tree: child, subChildren: 0, subDepth: 0 });
                        result.subChildren += subResult.subChildren;
                        result.subDepth = Math.max(result.subDepth, subResult.subDepth);
                    });
                    if (result.tree.children.length) {
                        result.subDepth++;
                    }
                    else {
                        $scope.colDefinitions.push(result.tree.node);
                    }
                    if (result.tree.node) {
                        result.tree.node.rowspan = maxDepth - result.depth - result.subDepth;
                        result.tree.node.colspan = result.subChildren;
                        if (!result.tree.children.length && result.tree.node.filterType === tablegrid.FilterType.NONE) {
                            result.tree.node.rowspan++;
                        }
                        $scope.headerRows[result.depth] ? $scope.headerRows[result.depth].push(result.tree.node) : $scope.headerRows[result.depth] = [result.tree.node];
                    }
                    return result;
                };
                var getTreeDepth = function (tree) {
                    var depth = 0;
                    tree.children.forEach(function (child) {
                        depth = Math.max(depth, getTreeDepth(child));
                    });
                    return depth + 1;
                };
                $scope.initFilter = function () {
                    $scope.filters = [];
                    _.each($scope.colDefinitions, function (header, index) {
                        _.each($scope.datas, function (row) {
                            if (!$scope.filters[index]) {
                                $scope.filters[index] = { header: header, selectValues: [], currentValues: [] };
                            }
                            if (header.filterType === tablegrid.FilterType.SELECT
                                || header.filterType === tablegrid.FilterType.MULTISELECT) {
                                var value = header.getValue(row) + "";
                                if (!!header.getFilterValue) {
                                    value = header.getFilterValue(row) + "";
                                }
                                var valuesToCheck = value.split("|");
                                _.each(valuesToCheck, function (val) {
                                    if (!_.contains($scope.filters[index].selectValues, val)) {
                                        $scope.filters[index].selectValues.push(val);
                                    }
                                });
                            }
                        });
                        $scope.filters[index].selectValues = _.sortBy($scope.filters[index].selectValues, function (val) { return !!val ? val.toLowerCase() : ""; });
                    });
                };
                var init = function () {
                    $scope.FilterTypeEnum = {
                        NONE: tablegrid.FilterType.NONE,
                        TEXT: tablegrid.FilterType.TEXT,
                        SELECT: tablegrid.FilterType.SELECT,
                        MULTISELECT: tablegrid.FilterType.MULTISELECT,
                    };
                    $scope.headerRows = [];
                    $scope.bodyRows = [];
                    $scope.colDefinitions = [];
                    $scope.allChecked = { value: false };
                    maxDepth = getTreeDepth($scope.header);
                    browse({ depth: 0, subChildren: 0, subDepth: 0, tree: $scope.header });
                    $scope.existFixedRow = _.some($scope.colDefinitions, function (colDef) {
                        return colDef.fixed;
                    });
                    $scope.selected = { orderBy: null, reverse: false };
                    if (!!$scope.defaultOrder) {
                        var firstChar = $scope.defaultOrder.substr(0, 1);
                        if (firstChar === "-" || firstChar === "+") {
                            $scope.defaultOrder = $scope.defaultOrder.substr(1);
                            $scope.selected.reverse = firstChar === "-" ? true : false;
                        }
                        var orderByHeader = _.find($scope.colDefinitions, function (header) {
                            return header.label === $scope.defaultOrder;
                        });
                        $scope.selected.orderBy = !!orderByHeader ? orderByHeader : null;
                    }
                    _.each($scope.datas, function (row) {
                        row._luiTableGridRow = {
                            isInFilteredDataset: true
                        };
                        if ($scope.isSelectable) {
                            row._luiTableGridRow.isChecked = false;
                        }
                    });
                };
                var getCheckboxState = function () {
                    var selectedCheckboxesCount = _.filter($scope.filteredAndOrderedRows, function (row) { return row._luiTableGridRow.isChecked; }).length;
                    if (selectedCheckboxesCount === 0) {
                        return "";
                    }
                    if (selectedCheckboxesCount === $scope.filteredAndOrderedRows.length) {
                        return "checked";
                    }
                    if (selectedCheckboxesCount < $scope.filteredAndOrderedRows.length) {
                        return "partial";
                    }
                    return "";
                };
                $scope.updateFilteredRows = function () {
                    if ($scope.isSelectable) {
                        $scope.allChecked.value = false;
                        _.each($scope.filteredAndOrderedRows, function (row) {
                            row._luiTableGridRow.isChecked = false;
                        });
                        $scope.masterCheckBoxCssClass = getCheckboxState();
                    }
                    var temp = _.chain($scope.datas)
                        .each(function (row) {
                        row._luiTableGridRow.isInFilteredDataset = false;
                    })
                        .filter(function (row) {
                        var result = true;
                        $scope.filters.forEach(function (filter) {
                            if (filter.header
                                && !!filter.currentValues[0]
                                && filter.currentValues[0] !== "") {
                                var propValue_1 = (filter.header.getValue(row) + "").toLowerCase();
                                if (!!filter.header.getFilterValue) {
                                    propValue_1 = (filter.header.getFilterValue(row) + "").toLowerCase();
                                }
                                var containsProp = _.some(filter.currentValues, function (value) {
                                    if (filter.header.filterType === tablegrid.FilterType.SELECT || filter.header.filterType === tablegrid.FilterType.MULTISELECT) {
                                        return propValue_1.indexOf("|") !== -1 ? propValue_1.split("|").indexOf(value.toLowerCase()) !== -1 : propValue_1 === value.toLowerCase();
                                    }
                                    else {
                                        return $filter("luifStripAccents")(propValue_1).indexOf($filter("luifStripAccents")(value.toLowerCase())) !== -1;
                                    }
                                });
                                if (!containsProp) {
                                    result = false;
                                }
                            }
                        });
                        return result;
                    })
                        .each(function (row) {
                        row._luiTableGridRow.isInFilteredDataset = true;
                    });
                    $scope.filteredAndOrderedRows = temp.value();
                    $scope.orderBySelectedHeader();
                    $scope.updateViewAfterFiltering();
                };
                $scope.orderBySelectedHeader = function () {
                    if ($scope.selected && $scope.selected.orderBy) {
                        $scope.filteredAndOrderedRows = _.sortBy($scope.filteredAndOrderedRows, function (row) {
                            var orderByValue = $scope.selected.orderBy.getValue(row);
                            if ($scope.selected.orderBy.getOrderByValue != null) {
                                orderByValue = $scope.selected.orderBy.getOrderByValue(row);
                            }
                            return orderByValue;
                        });
                    }
                    $scope.filteredAndOrderedRows = $scope.selected.reverse ? $scope.filteredAndOrderedRows.reverse() : $scope.filteredAndOrderedRows;
                };
                $scope.updateOrderedRows = function (header) {
                    if (header === $scope.selected.orderBy) {
                        if ($scope.selected.reverse) {
                            $scope.selected.orderBy = null;
                            $scope.selected.reverse = false;
                        }
                        else {
                            $scope.selected.reverse = true;
                        }
                    }
                    else {
                        $scope.selected.orderBy = header;
                        $scope.selected.reverse = false;
                    }
                    $scope.orderBySelectedHeader();
                    $scope.updateViewAfterOrderBy();
                };
                $scope.onMasterCheckBoxChange = function () {
                    if (_.some($scope.filteredAndOrderedRows, function (row) { return !row._luiTableGridRow.isChecked; })) {
                        if ($scope.masterCheckBoxCssClass === "partial") {
                            _.each($scope.filteredAndOrderedRows, function (row) { row._luiTableGridRow.isChecked = false; });
                        }
                        else {
                            _.each($scope.filteredAndOrderedRows, function (row) { row._luiTableGridRow.isChecked = true; });
                        }
                    }
                    else {
                        _.each($scope.filteredAndOrderedRows, function (row) { row._luiTableGridRow.isChecked = false; });
                    }
                    $scope.masterCheckBoxCssClass = getCheckboxState();
                };
                $scope.onCheckBoxChange = function () {
                    $scope.masterCheckBoxCssClass = getCheckboxState();
                    if (!$scope.masterCheckBoxCssClass) {
                        $scope.allChecked.value = false;
                    }
                    if (_.some($scope.filteredAndOrderedRows, function (row) { return row._luiTableGridRow.isChecked; })) {
                        $scope.allChecked.value = true;
                    }
                };
                init();
            }
            LuidTableGridController.IID = "luidTableGridController";
            LuidTableGridController.$inject = ["$filter", "$scope", "$translate", "$timeout"];
            return LuidTableGridController;
        }());
        tablegrid.LuidTableGridController = LuidTableGridController;
        angular.module("lui.tablegrid").controller(LuidTableGridController.IID, LuidTableGridController);
    })(tablegrid = lui.tablegrid || (lui.tablegrid = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var tablegrid;
    (function (tablegrid_1) {
        "use strict";
        var LuidTableGridHeightType = (function () {
            function LuidTableGridHeightType() {
            }
            LuidTableGridHeightType.isTypeExisting = function (type) {
                return type === LuidTableGridHeightType.GLOBAL || type === LuidTableGridHeightType.BODY;
            };
            LuidTableGridHeightType.GLOBAL = "global";
            LuidTableGridHeightType.BODY = "body";
            return LuidTableGridHeightType;
        }());
        tablegrid_1.LuidTableGridHeightType = LuidTableGridHeightType;
        var LuidTableGrid = (function () {
            function LuidTableGrid($timeout) {
                var _this = this;
                this.controller = "luidTableGridController";
                this.restrict = "AE";
                this.scope = { header: "=", height: "@", datas: "=*", selectable: "@", defaultOrder: "@", onRowClick: "&", heightType: "@" };
                this.templateUrl = "lui/templates/table-grid/table-grid.html";
                this.link = function (scope, element, attrs) {
                    _this.$timeout(function () {
                        var tablegrid = angular.element(element[0].querySelector(".lui.tablegrid"))[0];
                        var tables = tablegrid.querySelectorAll("table");
                        var headers = tablegrid.querySelectorAll("thead");
                        var bodies = tablegrid.querySelectorAll("tbody");
                        var lockedColumns = tablegrid.querySelector(".locked.columns");
                        var lockedColumnsVS = (!!lockedColumns) ? lockedColumns.querySelector(".holder .virtualscroll") : undefined;
                        var lockedColumnsSynced = lockedColumns ? lockedColumns.querySelector(".holder") : undefined;
                        var scrollableArea = tablegrid.querySelector(".scrollable.columns");
                        var scrollableAreaVS = scrollableArea.querySelector(".virtualscroll");
                        var MINROWSCOUNTFORVS = 200;
                        attrs.selectable = angular.isDefined(attrs.selectable);
                        var getScrollbarThickness = function () {
                            var inner = document.createElement("p");
                            inner.style.width = "100%";
                            inner.style.height = "200px";
                            var outer = document.createElement("div");
                            outer.style.position = "absolute";
                            outer.style.top = "0px";
                            outer.style.left = "0px";
                            outer.style.visibility = "hidden";
                            outer.style.width = "200px";
                            outer.style.height = "150px";
                            outer.style.overflow = "hidden";
                            outer.appendChild(inner);
                            document.body.appendChild(outer);
                            var w1 = inner.offsetWidth;
                            outer.style.overflow = "scroll";
                            var w2 = inner.offsetWidth;
                            if (w1 === w2) {
                                w2 = outer.clientWidth;
                            }
                            document.body.removeChild(outer);
                            return (w1 - w2);
                        };
                        var scrollbarThickness = getScrollbarThickness();
                        var height = attrs.height ? parseFloat(attrs.height) : LuidTableGrid.defaultHeight;
                        var headerHeightType = LuidTableGridHeightType.isTypeExisting(attrs.heightType) ? attrs.heightType : LuidTableGridHeightType.BODY;
                        var ROWHEIGHTMIN = 32;
                        var rowsPerPage = Math.round(height / ROWHEIGHTMIN);
                        var numberOfRows = rowsPerPage * 3;
                        var resizeTimer;
                        var lastScrollTop = 0;
                        scope.visibleRows = [];
                        var currentMarginTop = 0;
                        var headerHeight = Math.max(headers[0].offsetHeight, (!!headers[1] ? headers[1].offsetHeight : 0));
                        var getLockedColumnsWidth = function () {
                            if (!tables[1]) {
                                return 0;
                            }
                            var w = 0;
                            for (var _i = 0, _a = headers[1].querySelectorAll("tr:first-child th.locked"); _i < _a.length; _i++) {
                                var col = _a[_i];
                                w += col.offsetWidth;
                            }
                            return w + 1;
                        };
                        var updateHeight = function () {
                            headerHeight = Math.max(headers[0].offsetHeight, (!!headers[1] ? headers[1].offsetHeight : 0));
                            var scrollableAreaHeight = height;
                            scrollableAreaHeight -= headerHeightType === LuidTableGridHeightType.GLOBAL ? headerHeight : 0;
                            scrollableArea.style.maxHeight = scrollableAreaHeight + "px";
                            tablegrid.style.paddingTop = headerHeight + "px";
                            if (!!tables[1]) {
                                tables[1].style.marginTop = (headerHeight + currentMarginTop) + "px";
                            }
                        };
                        var canvasHeight;
                        var updateWidth = function () {
                            var tablegridWidth = 0;
                            tablegridWidth = (scrollableArea.clientHeight < Math.max(canvasHeight, scrollableAreaVS.clientHeight)) ? tablegrid.clientWidth - scrollbarThickness : tablegrid.clientWidth;
                            for (var _i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
                                var header = headers_1[_i];
                                header.style.minWidth = tablegridWidth + "px";
                            }
                            for (var _a = 0, tables_1 = tables; _a < tables_1.length; _a++) {
                                var table = tables_1[_a];
                                table.style.minWidth = headers[0].offsetWidth + "px";
                            }
                            var lockedColumnsWidth = getLockedColumnsWidth();
                            if (lockedColumnsWidth) {
                                lockedColumnsSynced.style.maxHeight = (bodies[0].clientWidth > tablegridWidth) ? +height + headerHeight - scrollbarThickness + "px" : +height + headerHeight + "px";
                                lockedColumns.style.width = lockedColumnsWidth + "px";
                                scrollableArea.style.marginLeft = lockedColumnsWidth + "px";
                                scrollableAreaVS.style.marginLeft = -lockedColumnsWidth + "px";
                            }
                        };
                        var resize = function () {
                            updateHeight();
                            updateWidth();
                        };
                        var setCanvasHeight = function (startNumRowIn) {
                            canvasHeight = (scope.filteredAndOrderedRows.length - startNumRowIn) * ROWHEIGHTMIN;
                            if (canvasHeight > height) {
                                scrollableAreaVS.style.height = canvasHeight + "px";
                                if (!!lockedColumnsVS) {
                                    lockedColumnsVS.style.height = canvasHeight + "px";
                                }
                            }
                            else {
                                scrollableAreaVS.style.height = height + "px";
                                if (!!lockedColumnsVS) {
                                    lockedColumnsVS.style.height = height + "px";
                                }
                            }
                        };
                        var updateVisibleRows = function () {
                            if (scope.filteredAndOrderedRows.length <= MINROWSCOUNTFORVS) {
                                scope.visibleRows = scope.filteredAndOrderedRows;
                                setCanvasHeight(0);
                                return;
                            }
                            var isScrollDown = lastScrollTop < scrollableArea.scrollTop;
                            var isLastRowDrawn = _.last(scope.visibleRows) === _.last(scope.filteredAndOrderedRows);
                            if (isScrollDown && isLastRowDrawn) {
                                return;
                            }
                            var startNumRow = Math.floor(scrollableArea.scrollTop / ROWHEIGHTMIN);
                            var cellsToCreate = Math.min(startNumRow + numberOfRows, numberOfRows);
                            currentMarginTop = startNumRow * ROWHEIGHTMIN;
                            scope.visibleRows = scope.filteredAndOrderedRows.slice(startNumRow, startNumRow + cellsToCreate);
                            if (scope.existFixedRow || attrs.selectable) {
                                tables[1].style.marginTop = (headerHeight + currentMarginTop) + "px";
                            }
                            tables[0].style.marginTop = currentMarginTop + "px";
                            scrollableAreaVS.style.marginTop = currentMarginTop + "px";
                            setCanvasHeight(startNumRow);
                        };
                        scope.updateViewAfterOrderBy = function () {
                            updateVisibleRows();
                            _this.$timeout(function () {
                                updateHeight();
                            }, 0);
                        };
                        scope.updateViewAfterFiltering = function () {
                            scrollableArea.scrollTop = 0;
                            tables[0].style.marginTop = "0px";
                            scrollableAreaVS.style.marginTop = "0px";
                            if (scope.existFixedRow || attrs.selectable) {
                                lockedColumnsSynced.scrollTop = 0;
                                tables[1].style.marginTop = "0px";
                            }
                            updateVisibleRows();
                            _this.$timeout(function () {
                                resize();
                            }, 0);
                        };
                        scope.$watchCollection("datas", function () {
                            if (!!scope.datas) {
                                scope.filteredAndOrderedRows = scope.datas;
                                scope.initFilter();
                                if (scope.selected.orderBy !== null) {
                                    scope.orderBySelectedHeader();
                                }
                                _.each(scope.datas, function (row) {
                                    row._luiTableGridRow = {
                                        isInFilteredDataset: true
                                    };
                                });
                                scope.updateViewAfterFiltering();
                            }
                        });
                        window.addEventListener("resize", function () {
                            _this.$timeout.cancel(resizeTimer);
                            resizeTimer = _this.$timeout(function () { resize(); }, 100);
                        });
                        scrollableArea.addEventListener("scroll", function (event) {
                            if (scope.existFixedRow || attrs.selectable) {
                                lockedColumnsSynced.scrollTop = scrollableArea.scrollTop;
                            }
                            headers[0].style.left = -scrollableArea.scrollLeft + "px";
                            if (scope.visibleRows.length !== scope.filteredAndOrderedRows.length) {
                                updateVisibleRows();
                                scope.$digest();
                            }
                            lastScrollTop = scrollableArea.scrollTop;
                        });
                    }, 0);
                };
                this.$timeout = $timeout;
            }
            LuidTableGrid.Factory = function () {
                var directive = function ($timeout) { return new LuidTableGrid($timeout); };
                directive.$inject = ["$timeout"];
                return directive;
            };
            ;
            LuidTableGrid.defaultHeight = 20;
            LuidTableGrid.IID = "luidTableGrid";
            return LuidTableGrid;
        }());
        tablegrid_1.LuidTableGrid = LuidTableGrid;
        angular.module("lui.tablegrid").directive(LuidTableGrid.IID, LuidTableGrid.Factory());
    })(tablegrid = lui.tablegrid || (lui.tablegrid = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var tablegrid;
    (function (tablegrid) {
        "use strict";
        angular.module("lui.tablegrid").config(["$translateProvider", function ($translateProvider) {
                $translateProvider.translations("en", {
                    "SELECT_ITEM": "Select an item",
                    "SELECT_ITEMS": "Select items",
                });
                $translateProvider.translations("de", {});
                $translateProvider.translations("es", {});
                $translateProvider.translations("fr", {
                    "SELECT_ITEM": "Sélectionnez un élément",
                    "SELECT_ITEMS": "Sélectionnez des éléments",
                });
                $translateProvider.translations("it", {});
                $translateProvider.translations("nl", {});
            }]);
    })(tablegrid = lui.tablegrid || (lui.tablegrid = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var tablegrid;
    (function (tablegrid) {
        "use strict";
    })(tablegrid = lui.tablegrid || (lui.tablegrid = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var translate;
    (function (translate) {
        "use strict";
        translate.AVAILABLE_LANGUAGES = ["en", "fr", "de", "es", "it", "nl", "pt"];
        translate.LANGUAGES_TO_CODE = { en: 1033, de: 1031, es: 1034, fr: 1036, it: 1040, nl: 2067, pt: 2070 };
        translate.CODES_TO_LANGUAGES = { 1033: "en", 1031: "de", 1034: "es", 1036: "fr", 1040: "it", 2067: "nl", 2070: "pt" };
        var CulturedList = (function () {
            function CulturedList(culture) {
                this.culture = culture;
                this.originalId = undefined;
                this.values = new Array();
            }
            return CulturedList;
        }());
        translate.CulturedList = CulturedList;
    })(translate = lui.translate || (lui.translate = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var translate;
    (function (translate) {
        "use strict";
        var LuidTranslationsListController = (function () {
            function LuidTranslationsListController($scope, $translate, $timeout) {
                var _this = this;
                this.$scope = $scope;
                $scope.currentCulture = $translate.preferredLanguage();
                if (!$scope.currentCulture) {
                    $scope.currentCulture = "en";
                }
                $scope.cultures = translate.AVAILABLE_LANGUAGES;
                var currentCultureIndex = _.indexOf($scope.cultures, $scope.currentCulture);
                if (currentCultureIndex !== -1) {
                    $scope.cultures.splice(currentCultureIndex, 1);
                    $scope.cultures.unshift($scope.currentCulture);
                }
                $scope.selectedCulture = $scope.currentCulture;
                $scope.values = {};
                $scope.selectCulture = function (culture) { $scope.selectedCulture = culture; };
                $scope.addValue = function () {
                    _.each(translate.AVAILABLE_LANGUAGES, function (culture) {
                        $scope.values[culture].values.push({ value: "" });
                    });
                };
                var removeAt = function (index) {
                    _.each(translate.AVAILABLE_LANGUAGES, function (culture) {
                        $scope.values[culture].values.splice(index, 1);
                    });
                    if ($scope.values[translate.AVAILABLE_LANGUAGES[0]].values.length === 0) {
                        _.each(translate.AVAILABLE_LANGUAGES, function (culture) {
                            $scope.values[culture].values.push({ value: "" });
                        });
                    }
                    $scope.onInputValueChanged();
                };
                $scope.deleteValue = function (index) {
                    if ($scope.deletionCallback === undefined) {
                        removeAt(index);
                        return;
                    }
                    $scope.deletionCallback().then(function (response) {
                        if (response) {
                            removeAt(index);
                        }
                    });
                };
                $scope.isAddValueDisabled = function () {
                    return !_.some(translate.AVAILABLE_LANGUAGES, function (culture) {
                        var current = _this.$scope.values[culture].values;
                        return current[current.length - 1].value !== "";
                    });
                };
                $scope.onPaste = function (event, index) {
                    if ($scope.isDisabled) {
                        return;
                    }
                    var originalEvent = event instanceof ClipboardEvent ? event : event.originalEvent;
                    var values = _.reject(originalEvent.clipboardData.getData("text/plain").split(/\r\n|\r|\n/g), function (value) { return value === ""; });
                    if (values.length === 1) {
                        return;
                    }
                    for (var i = 0; i < values.length; ++i, ++index) {
                        $scope.values[$scope.selectedCulture].values[index] = { value: values[i] };
                    }
                    var currentLength = $scope.values[$scope.selectedCulture].values.length;
                    _.chain(translate.AVAILABLE_LANGUAGES)
                        .reject(function (lang) { return lang === $scope.selectedCulture; })
                        .filter(function (lang) { return $scope.values[lang].values.length < currentLength; })
                        .each(function (lang) {
                        for (var i = $scope.values[lang].values.length; i < currentLength; ++i) {
                            $scope.values[lang].values.push({ value: "" });
                        }
                    });
                    $scope.onInputValueChanged();
                    event.preventDefault();
                    originalEvent.target.blur();
                };
                $scope.addValueAndFocus = function () {
                    var maxIndex = $scope.values[$scope.selectedCulture].values.length - 1;
                    $scope.addValue();
                    $timeout(function () { return document.getElementById($scope.getUniqueId($scope.selectedCulture, maxIndex + 1)).focus(); });
                };
                $scope.addValueOnEnter = {
                    "13": function ($event) {
                        var index = Number($event.target.id.split("_")[2]);
                        if (index === $scope.values[$scope.selectedCulture].values.length - 1) {
                            if (!$scope.isAddValueDisabled()) {
                                index++;
                                $scope.addValue();
                                $scope.$apply();
                                $timeout(function () { return document.getElementById($scope.getUniqueId($scope.selectedCulture, index)).focus(); });
                            }
                        }
                        else {
                            index++;
                            document.getElementById($scope.getUniqueId($scope.selectedCulture, index)).focus();
                            $scope.$apply();
                        }
                        $event.preventDefault();
                    }
                };
                $scope.getPlaceholder = function (culture, index) {
                    var selectedCultureValue = $scope.values[$scope.selectedCulture].values[index].value;
                    if (!!selectedCultureValue) {
                        return selectedCultureValue;
                    }
                    var currentCultureValue = $scope.values[$scope.currentCulture].values[index].value;
                    if (!!currentCultureValue) {
                        return $scope.isDisabled ? "" : currentCultureValue;
                    }
                    for (var i = 0; i < $scope.cultures.length; i++) {
                        var currentLanguage = $scope.cultures[i];
                        var cultureValue = $scope.values[currentLanguage].values[index].value;
                        if (!!cultureValue) {
                            return $scope.isDisabled ? "" : cultureValue;
                        }
                    }
                    return $scope.isDisabled ? "" : $translate.instant("LUID_TRANSLATIONSLIST_INPUT_VALUE");
                };
                $scope.getUniqueId = function (culture, index) {
                    return culture + "_" + $scope.uniqueId + "_" + index;
                };
            }
            LuidTranslationsListController.IID = "luidTranslationsList";
            LuidTranslationsListController.$inject = [
                "$scope",
                "$translate",
                "$timeout"
            ];
            return LuidTranslationsListController;
        }());
        translate.LuidTranslationsListController = LuidTranslationsListController;
        angular.module("lui.translate").controller(LuidTranslationsListController.IID, LuidTranslationsListController);
        angular.module("lui.translate").config(["$translateProvider", function ($translateProvider) {
                $translateProvider.translations("en", {
                    "LUID_TRANSLATIONSLIST_ADD_VALUE": "Add new value",
                    "LUID_TRANSLATIONSLIST_INPUT_VALUE": "Input a value"
                });
                $translateProvider.translations("fr", {
                    "LUID_TRANSLATIONSLIST_ADD_VALUE": "Ajouter une nouvelle valeur",
                    "LUID_TRANSLATIONSLIST_INPUT_VALUE": "Saisir une valeur"
                });
            }]);
    })(translate = lui.translate || (lui.translate = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var translate;
    (function (translate) {
        "use strict";
        var LuidTranslationsList = (function () {
            function LuidTranslationsList() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/translations-list/translations-list.html";
                this.require = ["ngModel", LuidTranslationsList.IID];
                this.scope = {
                    mode: "@",
                    isDisabled: "=ngDisabled",
                    deletionCallback: "&?",
                };
                this.controller = translate.LuidTranslationsListController.IID;
            }
            LuidTranslationsList.factory = function () {
                return function () { return new LuidTranslationsList(); };
            };
            LuidTranslationsList.toModel = function (viewModel, mode) {
                var result;
                switch (mode) {
                    case "lucca":
                        result = LuidTranslationsList.toLuccaModel(viewModel);
                        break;
                    default:
                        result = undefined;
                        break;
                }
                return result;
            };
            LuidTranslationsList.toLuccaModel = function (viewModel) {
                var result = new Array();
                var numberOfTranslations = -1;
                var filledLanguages = _.filter(translate.AVAILABLE_LANGUAGES, function (language) {
                    if (viewModel[language].values.length > numberOfTranslations) {
                        numberOfTranslations = viewModel[language].values.length;
                    }
                    return _.some(viewModel[language].values, function (label) { return label.value !== ""; });
                });
                if (filledLanguages.length === 0) {
                    return undefined;
                }
                for (var i = 0; i < numberOfTranslations; ++i) {
                    result.push({ id: undefined, culturedLabels: new Array() });
                }
                var currentIndex = 0;
                _.each(result, function (translation) {
                    _.each(filledLanguages, function (language) {
                        if (viewModel[language].values[currentIndex].value !== "") {
                            var vmLabel = viewModel[language].values[currentIndex];
                            translation.culturedLabels.push({
                                id: vmLabel.originalLuccaCulturedLabelId, translationId: vmLabel.originalLuccaTranslationId,
                                cultureCode: translate.LANGUAGES_TO_CODE[language],
                                value: vmLabel.value
                            });
                            if (!translation.id && !!vmLabel.originalLuccaTranslationId) {
                                translation.id = vmLabel.originalLuccaTranslationId;
                            }
                        }
                    });
                    ++currentIndex;
                });
                result = _.reject(result, function (translation) { return translation.culturedLabels.length === 0; });
                return result;
            };
            LuidTranslationsList.parse = function (value, mode) {
                var result;
                switch (mode) {
                    case "lucca":
                        result = LuidTranslationsList.parseLucca(value);
                        break;
                    default:
                        result = undefined;
                        break;
                }
                return result;
            };
            LuidTranslationsList.parseLucca = function (value) {
                var result = LuidTranslationsList.getEmptyCulturedLists();
                if (value === undefined || value === null || !value.length) {
                    _.each(translate.AVAILABLE_LANGUAGES, function (culture) {
                        result[culture].values.push({ value: "" });
                    });
                    return result;
                }
                _.each(value, function (translation) {
                    _.each(translation.culturedLabels, function (label) {
                        var language = translate.CODES_TO_LANGUAGES[label.cultureCode];
                        result[language].values.push({
                            value: label.value,
                            originalLuccaCulturedLabelId: label.id,
                            originalLuccaTranslationId: label.translationId
                        });
                    });
                    if (translation.culturedLabels.length > 0) {
                        var count_1 = result[translate.CODES_TO_LANGUAGES[translation.culturedLabels[0].cultureCode]].values.length;
                        _.each(translate.AVAILABLE_LANGUAGES, function (language) {
                            if (result[language].values.length !== count_1) {
                                result[language].values.push({ value: "" });
                            }
                        });
                    }
                });
                return result;
            };
            LuidTranslationsList.getEmptyCulturedLists = function () {
                var result = {};
                _.each(translate.AVAILABLE_LANGUAGES, function (culture) { result[culture] = new translate.CulturedList(culture); });
                return result;
            };
            LuidTranslationsList.prototype.link = function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var mode = attrs.mode;
                if (!mode) {
                    mode = "lucca";
                }
                scope.uniqueId = (Math.floor(Math.random() * 9000) + 1).toString();
                scope.onInputValueChanged = function () {
                    ngModelCtrl.$setViewValue(LuidTranslationsList.toModel(scope.values, mode));
                    ngModelCtrl.$setTouched();
                };
                ngModelCtrl.$render = function () {
                    var viewModel = LuidTranslationsList.parse(ngModelCtrl.$viewValue, mode);
                    if (!!viewModel) {
                        scope.values = viewModel;
                    }
                };
            };
            LuidTranslationsList.IID = "luidTranslationsList";
            return LuidTranslationsList;
        }());
        angular.module("lui.translate").directive(LuidTranslationsList.IID, LuidTranslationsList.factory());
    })(translate = lui.translate || (lui.translate = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var translate;
    (function (translate) {
        "use strict";
    })(translate = lui.translate || (lui.translate = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var userpicker;
    (function (userpicker) {
        "use strict";
        var OpenOn = (function () {
            function OpenOn($timeout) {
                this.restrict = "A";
                this.require = ["uiSelect"];
                this.$timeout = $timeout;
            }
            OpenOn.factory = function () {
                var directive = function ($timeout) {
                    return new OpenOn($timeout);
                };
                directive.$inject = ["$timeout"];
                return directive;
            };
            OpenOn.prototype.link = function (scope, element, attrs, ctrls) {
                var _this = this;
                var uiSelectCtrl = ctrls[0];
                if (!!attrs.openOn) {
                    scope.$on(attrs.openOn, function () {
                        _this.$timeout(function () {
                            uiSelectCtrl.activate();
                        });
                    });
                }
            };
            ;
            OpenOn.IID = "openOn";
            return OpenOn;
        }());
        angular.module("lui.translate").directive(OpenOn.IID, OpenOn.factory());
    })(userpicker = lui.userpicker || (lui.userpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var userpicker;
    (function (userpicker) {
        "use strict";
    })(userpicker = lui.userpicker || (lui.userpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var userpicker;
    (function (userpicker) {
        "use strict";
        var DEFAULT_HOMONYMS_PROPERTIES = [
            { translationKey: "LUIDUSERPICKER_DEPARTMENT", name: "department.name", icon: "location" },
            { translationKey: "LUIDUSERPICKER_LEGALENTITY", name: "legalEntity.name", icon: "tree list" },
            { translationKey: "LUIDUSERPICKER_MAIL", name: "mail", icon: "email" },
        ];
        userpicker.MAGIC_PAGING = 15;
        userpicker.MAX_SEARCH_LIMIT = 10000;
        var LuidUserPickerController = (function () {
            function LuidUserPickerController($scope, $q, userPickerService) {
                var _this = this;
                this.$scope = $scope;
                this.$q = $q;
                this.userPickerService = userPickerService;
                this.userPickerService.setCustomHttpService($scope.customHttpService);
                this.$scope.lastPagingOffset = 0;
                this.$scope.users = new Array();
                this.userPickerService.getMyId().then(function (id) {
                    _this.$scope.myId = id;
                    _this.refresh().then(function (users) {
                        _this.initializeScope();
                    });
                });
            }
            LuidUserPickerController.prototype.initializeScope = function () {
                var _this = this;
                this.$scope.$watch("displayMeFirst", function (newValue, oldValue) {
                    if (_this.$scope.displayMeFirst) {
                        if (newValue) {
                            var myIndex = _.findIndex(_this.$scope.users, function (user) { return user.id === _this.$scope.myId; });
                            if (myIndex !== -1) {
                                var me = _this.$scope.users[myIndex];
                                _this.$scope.users.splice(myIndex, 1);
                                _this.$scope.users.unshift(me);
                            }
                            else {
                                _this.userPickerService.getMe().then(function (me) {
                                    _this.tidyUp([me]).then(function (meComplete) {
                                        _this.$scope.users.unshift(meComplete[0]);
                                    });
                                });
                            }
                        }
                    }
                });
                this.$scope.$watch("showFormerEmployees", function (newValue, oldValue) {
                    if (_this.$scope.showFormerEmployees !== undefined && newValue !== oldValue) {
                        _this.$scope.$broadcast("toggleFormerEmployees");
                        _this.resetUsers();
                        _this.refresh(_this.clue);
                    }
                });
                this.$scope.$watchCollection("bypassOperationsFor", function (newValue, oldValue) {
                    if (newValue !== undefined) {
                        _this.userPickerService.getUsersByIds(newValue).then(function (bypassedUsers) {
                            _this.tidyUp(bypassedUsers).then(function (completedByPassedUsers) {
                                _.each(completedByPassedUsers, function (byPassedUser) {
                                    if (_.find(_this.$scope.users, function (user) { return user.id === byPassedUser.id; }) === undefined) {
                                        _this.$scope.users.push(byPassedUser);
                                    }
                                });
                            });
                        });
                    }
                });
                this.$scope.$watch("legalEntityIds", function (newValue, oldValue) {
                    if (_this.$scope.legalEntityIds !== undefined && newValue !== oldValue) {
                        _this.resetUsers();
                        _this.refresh(_this.clue);
                    }
                });
                this.$scope.$watchGroup(["appId", "operations"], function (newValue, oldValue) {
                    if (angular.isDefined(newValue) && angular.isDefined(newValue[0]) &&
                        angular.isDefined(newValue[1]) && newValue[1].length > 0 &&
                        newValue[0] !== oldValue[0] && !_.isEqual(newValue[1], oldValue[1])) {
                        _this.resetUsers();
                        _this.refresh();
                    }
                });
                this.$scope.find = function (search) {
                    _this.clue = search;
                    _this.resetUsers();
                    _this.refresh(search);
                };
                this.$scope.loadMore = function () {
                    if (!_this.$scope.loadingMore) {
                        _this.$scope.lastPagingOffset += userpicker.MAGIC_PAGING;
                        _this.$scope.loadingMore = true;
                        _this.refresh().then(function () { _this.$scope.loadingMore = false; });
                    }
                };
            };
            LuidUserPickerController.prototype.tidyUp = function (users, clue) {
                var _this = this;
                if (clue === void 0) { clue = ""; }
                var promises = new Array();
                var customInfoDico = {};
                var homonymsDico = {};
                _.each(users, function (user) {
                    user.hasLeft = !!user.dtContractEnd && moment(user.dtContractEnd).isBefore(moment().startOf("day"));
                });
                if (!!this.$scope.customInfo) {
                    _.each(users, function (user) {
                        user.info = _this.$scope.customInfo(user);
                    });
                }
                if (!!this.$scope.customInfoAsync) {
                    _.each(users, function (user) {
                        customInfoDico[user.id.toString()] = promises.push(_this.$scope.customInfoAsync(user)) - 1;
                    });
                }
                var homonyms = this.userPickerService.getHomonyms(users);
                if (!!homonyms && homonyms.length > 0) {
                    var properties_1 = !!this.$scope.homonymsProperties && this.$scope.homonymsProperties.length > 0 ?
                        this.$scope.homonymsProperties : DEFAULT_HOMONYMS_PROPERTIES;
                    _.each(homonyms, function (user) {
                        homonymsDico[user.id] = promises.push(_this.userPickerService.getAdditionalProperties(user, properties_1)) - 1;
                    });
                }
                return this.$q.all(promises).then(function (values) {
                    if (!!homonyms && homonyms.length > 0) {
                        _.each(users, function (user) {
                            if (angular.isDefined(homonymsDico[user.id])) {
                                user.additionalProperties = values[homonymsDico[user.id.toString()]];
                                user.hasHomonyms = true;
                            }
                        });
                        users = _this.userPickerService.reduceAdditionalProperties(users);
                    }
                    if (!!_this.$scope.customInfoAsync) {
                        _.each(users, function (user) {
                            var indexInValuesArray = customInfoDico[user.id.toString()];
                            if (angular.isDefined(user.info) && user.info !== "") {
                                user.info = user.info + " " + values[indexInValuesArray];
                            }
                            else {
                                user.info = values[indexInValuesArray];
                            }
                        });
                    }
                    return users;
                });
            };
            LuidUserPickerController.prototype.refresh = function (clue) {
                var _this = this;
                if (clue === void 0) { clue = ""; }
                return this.getUsers(clue)
                    .then(function (users) {
                    _this.tidyUpAndAssign(users, clue);
                });
            };
            LuidUserPickerController.prototype.getUsers = function (clue) {
                var _this = this;
                if (clue === void 0) { clue = ""; }
                var paging = userpicker.MAGIC_PAGING;
                var offset = this.$scope.lastPagingOffset;
                var fetchPaging = paging;
                var fetchOffset = offset;
                if (!!this.$scope.customFilter) {
                    fetchPaging = userpicker.MAX_SEARCH_LIMIT;
                    fetchOffset = 0;
                }
                var get = function () {
                    return _this.userPickerService.getUsers(_this.getFilter(clue), fetchPaging, fetchOffset)
                        .then(function (users) {
                        if (!!_this.$scope.customFilter) {
                            return _.chain(users)
                                .filter(function (u) { return _this.$scope.customFilter(u); })
                                .rest(offset)
                                .first(paging)
                                .value();
                        }
                        return users;
                    });
                };
                return this.$q.all([
                    get(),
                    this.userPickerService.getMe(),
                ]).then(function (datas) {
                    var allUsers = datas[0];
                    var me = datas[1];
                    if (!offset) {
                        if (!clue && _this.$scope.displayAllUsers) {
                            var all = { id: -1, firstName: "", lastName: "", dtContractStart: "", employeeNumber: "" };
                            allUsers.unshift(all);
                        }
                        if (!clue && _this.$scope.displayMeFirst) {
                            var myIndex = _.findIndex(allUsers, function (user) { return user.id === _this.$scope.myId; });
                            if (myIndex !== -1) {
                                allUsers.splice(myIndex, 1);
                            }
                            allUsers.unshift(me);
                        }
                    }
                    return allUsers;
                });
            };
            LuidUserPickerController.prototype.tidyUpAndAssign = function (allUsers, clue) {
                var _this = this;
                return this.tidyUp(allUsers, clue)
                    .then(function (neatUsers) {
                    _this.$scope.users = _this.$scope.users || [];
                    (_a = _this.$scope.users).push.apply(_a, _.filter(neatUsers, function (neatUser) { return !_.any(_this.$scope.users, function (user) { return user.id === neatUser.id; }); }));
                    return _this.$scope.users;
                    var _a;
                });
            };
            LuidUserPickerController.prototype.resetUsers = function () {
                this.$scope.users = [];
                this.$scope.lastPagingOffset = 0;
            };
            LuidUserPickerController.prototype.getFilter = function (clue) {
                var s = this.$scope;
                var filter = "formerEmployees=" + (!!s.showFormerEmployees ? s.showFormerEmployees.toString() : "false") +
                    (!!s.appId && !!s.operations && s.operations.length > 0 ? "&appinstanceid=" + s.appId + "&operations=" + s.operations.join(",") : "") +
                    (!!clue ? "&clue=" + clue : "") +
                    "&searchByEmployeeNumber=" + (!!s.searchByEmployeeNumber ? "true" : "false") +
                    (!!s.legalEntityIds && s.legalEntityIds.length > 0 ? "&legalEntityIds=" + s.legalEntityIds.join(",") : "");
                return filter;
            };
            LuidUserPickerController.IID = "luidUserPickerController";
            LuidUserPickerController.$inject = ["$scope", "$q", "userPickerService"];
            return LuidUserPickerController;
        }());
        userpicker.LuidUserPickerController = LuidUserPickerController;
        angular.module("lui").controller(LuidUserPickerController.IID, LuidUserPickerController);
        angular.module("lui").filter("luifHighlight", ["$filter", "$translate",
            function ($filter, $translate) {
                return function (_input, _clue, _info, _key) {
                    var highlight = $filter("highlight");
                    return (!!_info ? "<span class=\"lui label\">" + _info + "</span>" : "") + (!!_key ? "<i>" + $translate.instant(_key) + "</i> " : "") + "<span>" + highlight(_input, _clue) + "</span>";
                };
            }]);
        angular.module("lui.translate").config(["$translateProvider", function ($translateProvider) {
                $translateProvider.translations("en", {
                    "LUIDUSERPICKER_FORMEREMPLOYEE": "Left on {{dtContractEnd | luifMoment : 'LL'}}",
                    "LUIDUSERPICKER_NORESULTS": "No results",
                    "LUIDUSERPICKER_ERR_GET_USERS": "Error while loading users",
                    "LUIDUSERPICKER_OVERFLOW": "{{cnt}} displayed results of {{all}}",
                    "LUIDUSERPICKER_DEPARTMENT": "Department",
                    "LUIDUSERPICKER_LEGALENTITY": "Legal entity",
                    "LUIDUSERPICKER_EMPLOYEENUMBER": "Employee number",
                    "LUIDUSERPICKER_MAIL": "Email",
                    "LUIDUSERPICKER_ME": "Me:",
                    "LUIDUSERPICKER_ALL": "All users",
                });
                $translateProvider.translations("de", {
                    "LUIDUSERPICKER_FORMEREMPLOYEE": "Verließ die {{dtContractEnd | luifMoment : 'LL'}}",
                    "LUIDUSERPICKER_NORESULTS": "Keine Ergebnisse",
                    "LUIDUSERPICKER_ERR_GET_USERS": "Fehler",
                    "LUIDUSERPICKER_OVERFLOW": "Es werden {{cnt}} auf {{all}} Benutzernamen",
                    "LUIDUSERPICKER_DEPARTMENT": "Abteilung",
                    "LUIDUSERPICKER_LEGALENTITY": "Rechtsträger",
                    "LUIDUSERPICKER_EMPLOYEENUMBER": "Betriebsnummer",
                    "LUIDUSERPICKER_MAIL": "E-mail",
                    "LUIDUSERPICKER_ME": "Mir:",
                    "LUIDUSERPICKER_ALL": "Alle Benutzer",
                });
                $translateProvider.translations("fr", {
                    "LUIDUSERPICKER_FORMEREMPLOYEE": "Parti(e) le {{dtContractEnd | luifMoment : 'LL'}}",
                    "LUIDUSERPICKER_NORESULTS": "Aucun résultat",
                    "LUIDUSERPICKER_ERR_GET_USERS": "Erreur lors de la récupération des utilisateurs",
                    "LUIDUSERPICKER_OVERFLOW": "{{cnt}} résultats affichés sur {{all}}",
                    "LUIDUSERPICKER_DEPARTMENT": "Service",
                    "LUIDUSERPICKER_LEGALENTITY": "Entité légale",
                    "LUIDUSERPICKER_EMPLOYEENUMBER": "Matricule",
                    "LUIDUSERPICKER_MAIL": "Email",
                    "LUIDUSERPICKER_ME": "Moi :",
                    "LUIDUSERPICKER_ALL": "Tous les utilisateurs",
                });
            }]);
    })(userpicker = lui.userpicker || (lui.userpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var userpicker;
    (function (userpicker) {
        "use strict";
        var LuidUserPicker = (function () {
            function LuidUserPicker() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/user-picker/user-picker.html";
                this.require = ["ngModel", LuidUserPicker.IID];
                this.scope = {
                    placeholder: "@",
                    onSelect: "&",
                    onRemove: "&",
                    allowClear: "=?",
                    controlDisabled: "=",
                    showFormerEmployees: "=",
                    homonymsProperties: "=",
                    customFilter: "=",
                    appId: "=",
                    operations: "=",
                    customInfo: "=",
                    customInfoAsync: "=",
                    displayMeFirst: "=",
                    displayAllUsers: "=",
                    customHttpService: "=",
                    bypassOperationsFor: "=",
                    searchByEmployeeNumber: "=",
                    legalEntityIds: "=",
                };
                this.controller = userpicker.LuidUserPickerController.IID;
            }
            LuidUserPicker.factory = function () { return function () { return new LuidUserPicker(); }; };
            LuidUserPicker.prototype.link = function (scope, element, attrs, ctrls) {
                scope.onOpen = function (isOpen) {
                    if (isOpen) {
                        element.addClass("ng-open");
                    }
                    else {
                        element.removeClass("ng-open");
                    }
                };
            };
            LuidUserPicker.IID = "luidUserPicker";
            return LuidUserPicker;
        }());
        angular.module("lui.translate").directive(LuidUserPicker.IID, LuidUserPicker.factory());
    })(userpicker = lui.userpicker || (lui.userpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var userpicker;
    (function (userpicker) {
        "use strict";
        var LuidUserPickerMultiple = (function () {
            function LuidUserPickerMultiple() {
                this.restrict = "E";
                this.templateUrl = "lui/templates/user-picker/user-picker.multiple.html";
                this.require = ["ngModel", LuidUserPickerMultiple.IID];
                this.scope = {
                    placeholder: "@",
                    onSelect: "&",
                    onRemove: "&",
                    allowClear: "=?",
                    controlDisabled: "=",
                    showFormerEmployees: "=",
                    homonymsProperties: "=",
                    customFilter: "=",
                    appId: "=",
                    operations: "=",
                    customInfo: "=",
                    customInfoAsync: "=",
                    displayMeFirst: "=",
                    customHttpService: "=",
                    bypassOperationsFor: "=",
                    legalEntityIds: "=",
                };
                this.controller = userpicker.LuidUserPickerController.IID;
            }
            LuidUserPickerMultiple.factory = function () { return function () { return new LuidUserPickerMultiple(); }; };
            LuidUserPickerMultiple.prototype.link = function (scope, element, attrs, ctrls) {
                scope.onOpen = function (isOpen) {
                    if (isOpen) {
                        element.addClass("ng-open");
                    }
                    else {
                        element.removeClass("ng-open");
                    }
                };
            };
            LuidUserPickerMultiple.IID = "luidUserPickerMultiple";
            return LuidUserPickerMultiple;
        }());
        angular.module("lui.translate").directive(LuidUserPickerMultiple.IID, LuidUserPickerMultiple.factory());
    })(userpicker = lui.userpicker || (lui.userpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var userpicker;
    (function (userpicker) {
        "use strict";
    })(userpicker = lui.userpicker || (lui.userpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var userpicker;
    (function (userpicker) {
        "use strict";
        var UserPickerService = (function () {
            function UserPickerService($http, $q, $filter) {
                this.meApiUrl = "/api/v3/users/me";
                this.userLookUpApiUrl = "/api/v3/users/find";
                this.userApiUrl = "/api/v3/users";
                this.userLookupFields = "fields=id,firstName,lastName,dtContractStart,dtContractEnd,employeeNumber";
                this.$http = $http;
                this.defaultHttpService = $http;
                this.$q = $q;
                this.stripAccents = $filter("luifStripAccents");
            }
            UserPickerService.prototype.getMyId = function () {
                return this.getMe()
                    .then(function (me) {
                    return me.id;
                });
            };
            UserPickerService.prototype.getMe = function () {
                var _this = this;
                if (this.meCache !== undefined) {
                    return this.$q.resolve(this.meCache);
                }
                return this.$http.get(this.meApiUrl + "?" + this.userLookupFields)
                    .then(function (response) {
                    _this.meCache = response.data.data;
                    return _this.meCache;
                }).catch(function (reason) {
                    return undefined;
                });
            };
            UserPickerService.prototype.getHomonyms = function (users) {
                var _this = this;
                return _.chain(users)
                    .groupBy(function (user) { return _this.concatName(user); })
                    .filter(function (groups) { return groups.length > 1; })
                    .flatten()
                    .value();
            };
            UserPickerService.prototype.getUsers = function (filters, paging, offset) {
                if (paging === void 0) { paging = userpicker.MAGIC_PAGING; }
                if (offset === void 0) { offset = 0; }
                var pagingfilter = "paging=" + [offset, paging].join(",");
                return this.$http.get(this.userLookUpApiUrl + "?" + filters + "&" + pagingfilter + "&" + this.userLookupFields)
                    .then(function (response) {
                    return response.data.data.items;
                });
            };
            UserPickerService.prototype.getUserById = function (id) {
                return this.$http.get(this.userApiUrl + "?id=" + id.toString() + "&" + this.userLookupFields)
                    .then(function (response) {
                    var users = response.data.data.items;
                    if (!users || users.length === 0) {
                        return undefined;
                    }
                    return users[0];
                });
            };
            UserPickerService.prototype.getUsersByIds = function (ids) {
                var _this = this;
                var promises = new Array();
                _.each(ids, function (id) {
                    promises.push(_this.getUserById(id));
                });
                return this.$q.all(promises);
            };
            UserPickerService.prototype.getAdditionalProperties = function (user, properties) {
                var _this = this;
                var fields = _.map(properties, function (prop) { return prop.name; }).join(",");
                return this.$http.get(this.userApiUrl + "?id=" + user.id.toString() + "&fields=" + fields)
                    .then(function (response) {
                    var users = response.data.data.items;
                    var result = new Array();
                    if (!!users && !!users.length) {
                        var usersProperties_1 = users[0];
                        _.each(properties, function (property) {
                            var value = _this.getProperty(usersProperties_1, property.name);
                            if (!!value) {
                                result.push({
                                    translationKey: property.translationKey,
                                    name: property.name,
                                    icon: property.icon,
                                    value: value
                                });
                            }
                        });
                    }
                    return result;
                });
            };
            UserPickerService.prototype.reduceAdditionalProperties = function (users) {
                var _this = this;
                var groupedHomonyms = _.chain(users)
                    .groupBy(function (user) { return _this.concatName(user); })
                    .filter(function (groups) { return groups.length > 1; })
                    .value();
                if (groupedHomonyms.length === 0) {
                    return users;
                }
                _.each(groupedHomonyms, function (homonyms) {
                    var reducableProperties = new Array();
                    var groupedProperties = _.chain(homonyms)
                        .map(function (user) { return user.additionalProperties; })
                        .flatten()
                        .groupBy(function (property) { return property.name; })
                        .value();
                    _.each(groupedProperties, function (propertyGroup) {
                        var uniq = _.uniq(propertyGroup, function (property) { return property.value; });
                        if (uniq.length === 1) {
                            reducableProperties.push(propertyGroup[0].name);
                        }
                    });
                    _.each(reducableProperties, function (propertyName) {
                        _.each(homonyms, function (user) {
                            var propIndex = _.findIndex(user.additionalProperties, function (property) { return property.name === propertyName; });
                            user.additionalProperties.splice(propIndex, 1);
                        });
                    });
                });
                return users;
            };
            UserPickerService.prototype.setCustomHttpService = function (httpService) {
                this.$http = !!httpService ? httpService : this.defaultHttpService;
            };
            UserPickerService.prototype.getProperty = function (object, prop) {
                var splitted = prop.split(".");
                var curObject = object;
                _.each(splitted, function (propName) {
                    curObject = !!curObject && !!curObject[propName] ? curObject[propName] : undefined;
                });
                return curObject;
            };
            UserPickerService.prototype.concatName = function (user) {
                return this.stripAccents(user.firstName.toLowerCase()) + this.stripAccents(user.lastName.toLowerCase());
            };
            UserPickerService.IID = "userPickerService";
            UserPickerService.$inject = [
                "$http", "$q", "$filter"
            ];
            return UserPickerService;
        }());
        angular.module("lui").service(UserPickerService.IID, UserPickerService);
    })(userpicker = lui.userpicker || (lui.userpicker = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    "use strict";
})(lui || (lui = {}));
var lui;
(function (lui) {
    var formatter;
    (function (formatter) {
        "use strict";
        var MomentFormatter = (function () {
            function MomentFormatter(format) {
                this.format = format || "moment";
            }
            MomentFormatter.prototype.parseValue = function (value) {
                switch (this.format) {
                    case "moment": return this.parseMoment(value);
                    case "date": return this.parseDate(value);
                    default: return this.parseString(value);
                }
            };
            MomentFormatter.prototype.formatValue = function (value) {
                if (!value) {
                    return value;
                }
                switch (this.format) {
                    case "moment": return this.formatMoment(value);
                    case "date": return this.formatDate(value);
                    default: return this.formatString(value);
                }
            };
            MomentFormatter.prototype.parseMoment = function (value) {
                return !!value ? moment(value) : undefined;
            };
            MomentFormatter.prototype.parseDate = function (value) {
                return !!value ? moment(value) : undefined;
            };
            MomentFormatter.prototype.parseString = function (value) {
                return !!value && moment(value, this.format).isValid() ? moment(value, this.format) : undefined;
            };
            MomentFormatter.prototype.formatMoment = function (value) {
                return moment(value);
            };
            MomentFormatter.prototype.formatDate = function (value) {
                return value.toDate();
            };
            MomentFormatter.prototype.formatString = function (value) {
                return value.format(this.format);
            };
            return MomentFormatter;
        }());
        formatter.MomentFormatter = MomentFormatter;
    })(formatter = lui.formatter || (lui.formatter = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var popover;
    (function (popover) {
        "use strict";
        var MAGIC_TIMEOUT_DELAY = 100;
        var ClickoutsideTrigger = (function () {
            function ClickoutsideTrigger(elt, $scope, clickedOutside) {
                var _this = this;
                this.elt = elt;
                this.body = angular.element(document.getElementsByTagName("body")[0]);
                this.$scope = $scope;
                this.clickedOutside = clickedOutside;
                var that = this;
                function onClickedOutside($event) {
                    if (!!that.clickedOutside) {
                        that.clickedOutside();
                    }
                    else {
                        that.close();
                    }
                }
                function onBodyClicked() {
                    onClickedOutside();
                    that.$scope.$digest();
                }
                function onEltClicked(otherEvent) {
                    otherEvent.stopPropagation();
                }
                this.open = function ($event) {
                    _this.$scope.popover.isOpen = true;
                    setTimeout(function () {
                        _this.body.on("click", onBodyClicked);
                        _this.elt.on("click", onEltClicked);
                    }, MAGIC_TIMEOUT_DELAY);
                };
                this.close = function ($event) {
                    _this.$scope.popover.isOpen = false;
                    if (!!_this.body) {
                        _this.body.off("click", onBodyClicked);
                        _this.elt.off("click", onEltClicked);
                    }
                };
            }
            ClickoutsideTrigger.prototype.toggle = function ($event) {
                if (this.$scope.popover.isOpen) {
                    this.close($event);
                }
                else {
                    this.open($event);
                }
            };
            return ClickoutsideTrigger;
        }());
        popover.ClickoutsideTrigger = ClickoutsideTrigger;
    })(popover = lui.popover || (lui.popover = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    var scroll;
    (function (scroll) {
        "use strict";
        angular.module("lui").directive("luidOnScrollBottom", function () {
            return {
                restrict: "A",
                scope: { luidOnScrollBottom: "&" },
                link: function ($scope, element) {
                    element.bind("scroll", function (eventArg) {
                        var target = eventArg.target || event.srcElement;
                        var scrollbarHeight = target.scrollHeight - target.clientHeight;
                        if (Math.abs(scrollbarHeight - target.scrollTop) < 2 && !!$scope.luidOnScrollBottom) {
                            $scope.luidOnScrollBottom();
                        }
                    });
                }
            };
        });
    })(scroll = lui.scroll || (lui.scroll = {}));
})(lui || (lui = {}));
var lui;
(function (lui) {
    "use strict";
})(lui || (lui = {}));
var lui;
(function (lui) {
    var upload;
    (function (upload) {
        "use strict";
        var UploaderService = (function () {
            function UploaderService($http, $q, _, moment) {
                this.mainApiUrl = "/api/v3/files";
                this.$http = $http;
                this.$q = $q;
                this._ = _;
                this.moment = moment;
            }
            UploaderService.prototype.postFromUrl = function (url, fileName) {
                var _this = this;
                var dfd = this.$q.defer();
                var req = new XMLHttpRequest();
                req.open("GET", url, true);
                req.responseType = "arraybuffer";
                req.onload = function (event) {
                    var blob = new Blob([req.response], { type: "image/jpeg" });
                    _this.postBlob(blob, fileName)
                        .then(function (response) {
                        dfd.resolve(response);
                    }, function (response) {
                        dfd.reject(response.data.Message);
                    });
                };
                req.send();
                return dfd.promise;
            };
            UploaderService.prototype.postDataURI = function (dataURI, fileName) {
                var blob = this.dataURItoBlob(dataURI);
                return this.postBlob(blob, fileName);
            };
            UploaderService.prototype.postBlob = function (blob, fileName) {
                var dfd = this.$q.defer();
                var url = this.mainApiUrl;
                var fd = new FormData();
                fd.append(fileName.substring(0, fileName.lastIndexOf(".")), blob, fileName);
                this.$http({
                    method: "POST",
                    url: url,
                    data: fd,
                    headers: {
                        "Content-Type": undefined,
                        "Accept": undefined,
                    },
                    transformRequest: angular.identity,
                })
                    .then(function (response) {
                    dfd.resolve(response.data.data);
                }, function (response) {
                    dfd.reject(response.data.Message);
                });
                return dfd.promise;
            };
            UploaderService.prototype.dataURItoBlob = function (dataURI) {
                var byteString = atob(dataURI.split(",")[1]);
                var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab], { type: mimeString });
                return bb;
            };
            UploaderService.IID = "uploaderService";
            UploaderService.$inject = ["$http", "$q", "_", "moment"];
            return UploaderService;
        }());
        var ApiResponseItem = (function () {
            function ApiResponseItem() {
            }
            return ApiResponseItem;
        }());
        var ApiError = (function () {
            function ApiError() {
            }
            return ApiError;
        }());
        angular.module("lui").service(UploaderService.IID, UploaderService);
    })(upload = lui.upload || (lui.upload = {}));
})(lui || (lui = {}));
;angular.module('lui').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('lui/templates/date-picker/datepicker-inline.html',
    "<div class=\"calendars\"><div class=\"calendar\" mode=\"{{ mode }}\" ng-repeat=\"calendar in calendars\" ng-class=\"[direction]\"><header><button class=\"previous\" ng-click=\"previous()\"></button> <span ng-switch=\"mode\"><span ng-switch-default ng-click=\"switchToMonthMode()\">{{ calendar.date | luifMoment : calendar.currentYear ? \"MMMM\" : \"MMMM - YYYY\" }}</span> <span ng-switch-when=\"1\" ng-click=\"switchToYearMode()\">{{ calendar.date | luifMoment : \"YYYY\" }}</span> <span ng-switch-when=\"2\">{{ calendar.date.year() }} - {{ calendar.date.year() + 11 }}</span> </span><button class=\"next\" ng-click=\"next()\"></button></header><table class=\"days\"><thead><th ng-repeat=\"dayLabel in dayLabels\">{{ ::dayLabel }}</th></thead><tbody><tr ng-repeat=\"week in calendar.weeks\"><td ng-repeat=\"day in week.days\" ng-class=\"[{empty: day.empty, selected: day.selected}, day.customClass]\" ng-disabled=\"day.disabled\" ng-click=\"selectDay(day)\">{{ ::day.dayNum }}</td></tr></tbody></table><div class=\"months\"><ul><li ng-repeat=\"m in calendar.months\" ng-click=\"selectMonth(m)\" ng-disabled=\"m.disabled\" ng-class=\"[{selected: m.selected}, m.customClass]\">{{ m.date | luifMoment : \"MMM\" }}</li></ul></div><div class=\"years\"><ul><li ng-repeat=\"y in calendar.years\" ng-disabled=\"y.disabled\" ng-click=\"selectYear(y)\" ng-class=\"[{selected: y.selected}, y.customClass]\">{{ y.date | luifMoment : \"YYYY\" }}</li></ul></div></div></div><footer ng-if=\"!!shortcuts || !!groupedShortcuts\"><ul><li ng-if=\"!!shortcuts.length\"><ul><li class=\"shortcut\" ng-repeat=\"shortcut in shortcuts\"><a class=\"lui small grey wired button\" ng-click=\"selectShortcut(shortcut)\">{{ ::shortcut.label }}</a></li></ul></li><li class=\"group\" ng-if=\"!!groupedShortcuts.length\" ng-repeat=\"group in groupedShortcuts\"><ul><li class=\"shortcut\" ng-repeat=\"shortcut in group\"><a class=\"lui small grey wired button\" ng-click=\"selectShortcut(shortcut)\">{{ ::shortcut.label }}</a></li></ul></li></ul></footer>"
  );


  $templateCache.put('lui/templates/date-picker/datepicker-popup.html',
    "<div uib-popover-template=\"'lui/templates/date-picker/datepicker-inline.html'\" popover-placement=\"auto bottom-left\" popover-trigger=\"'none'\" popover-is-open=\"popover.isOpen\" popover-class=\"lui luid-datepicker\" class=\"lui datepicker input\"><input ng-readonly=\"disableKeyboardInput\" ng-model=\"displayStr\" ng-change=\"onDisplayStrChanged($event)\" ng-focus=\"openPopover($event)\" luid-keydown mappings=\"closePopoverOnKeyPress\" placeholder=\"{{placeholder}}\"> <i class=\"empty\" ng-click=\"clear($event)\"></i></div>"
  );


  $templateCache.put('lui/templates/date-picker/daterangepicker-popover.html',
    "<div class=\"calendars\"><div class=\"calendar\" mode=\"{{ mode }}\" ng-repeat=\"calendar in calendars\" ng-class=\"[direction]\"><header><button class=\"previous\" ng-click=\"previous()\"></button> <span ng-switch=\"mode\"><span ng-switch-default ng-click=\"switchToMonthMode()\">{{ calendar.date | luifMoment : calendar.currentYear ? \"MMMM\" : \"MMMM - YYYY\" }}</span> <span ng-switch-when=\"1\" ng-click=\"switchToYearMode()\">{{ calendar.date | luifMoment : \"YYYY\" }}</span> <span ng-switch-when=\"2\">{{ calendar.date.year() }} - {{ calendar.date.year() + 11 }}</span> </span><button class=\"next\" ng-click=\"next()\"></button></header><table class=\"days\"><thead><th ng-repeat=\"dayLabel in dayLabels\">{{ ::dayLabel }}</th></thead><tbody><tr ng-repeat=\"week in calendar.weeks\"><td ng-repeat=\"day in week.days\" ng-class=\"[{empty: day.empty, selected: day.selected, start: day.start, end: day.end, 'in-between': day.inBetween}, day.customClass]\" ng-disabled=\"day.disabled\" ng-mouseenter=\"onMouseEnter(day)\" ng-mouseleave=\"onMouseLeave(day)\" ng-click=\"selectDay(day)\">{{ ::day.dayNum }}</td></tr></tbody></table><div class=\"months\"><ul><li ng-repeat=\"m in calendar.months\" ng-click=\"selectMonth(m)\" ng-disabled=\"m.disabled\" ng-mouseenter=\"onMouseEnter(m)\" ng-mouseleave=\"onMouseLeave(m)\" ng-class=\"[{selected: m.selected, start: m.start, end: m.end, 'in-between': m.inBetween}, m.customClass]\">{{ m.date | luifMoment : \"MMM\" }}</li></ul></div><div class=\"years\"><ul><li ng-repeat=\"y in calendar.years\" ng-disabled=\"y.disabled\" ng-click=\"selectYear(y)\" ng-mouseenter=\"onMouseEnter(y)\" ng-mouseleave=\"onMouseLeave(y)\" ng-class=\"[{selected: y.selected, start: y.start, end: y.end, 'in-between': y.inBetween}, y.customClass]\">{{ y.date | luifMoment : \"YYYY\" }}</li></ul></div></div></div><footer ng-if=\"!!shortcuts || !!groupedShortcuts\"><ul><li ng-if=\"!!shortcuts.length\"><ul><li class=\"shortcut\" ng-repeat=\"shortcut in shortcuts\"><a class=\"lui small grey wired button\" ng-click=\"selectShortcut(shortcut)\">{{ ::shortcut.label }}</a></li></ul></li><li class=\"group\" ng-if=\"!!groupedShortcuts.length\" ng-repeat=\"group in groupedShortcuts\"><ul><li class=\"shortcut\" ng-repeat=\"shortcut in group\"><a class=\"lui small grey wired button\" ng-click=\"selectShortcut(shortcut)\">{{ ::shortcut.label }}</a></li></ul></li></ul></footer>"
  );


  $templateCache.put('lui/templates/date-picker/daterangepicker.html',
    "<div class=\"lui daterange fitting input\" uib-popover-template=\"'lui/templates/date-picker/daterangepicker-popover.html'\" popover-placement=\"auto bottom-left\" popover-trigger=\"'none'\" popover-is-open=\"popover.isOpen\" popover-class=\"lui luid-daterangepicker\" ng-click=\"togglePopover($event)\"><div class=\"inputs\" ng-if=\"popover.isOpen\"><input auto-focus ng-readonly=\"disableKeyboardInput\" ng-class=\"{ 'clickable': disableKeyboardInput, 'focus': !!editingStart}\" ng-click=\"editStart($event)\" ng-model=\"internal.startDisplayStr\" ng-change=\"onStartDisplayStrChanged($event)\" placeholder=\"{{fromLabel}}\" luid-keydown mappings=\"focusEndInputOnTab\"> <i class=\"lui east arrow icon\"></i> <input ng-readonly=\"disableKeyboardInput\" ng-class=\"{ 'clickable': disableKeyboardInput, 'focus': !editingStart}\" ng-model=\"internal.endDisplayStr\" ng-click=\"editEnd($event)\" ng-change=\"onEndDisplayStrChanged($event)\" placeholder=\"{{toLabel}}\" luid-keydown mappings=\"closePopoverOnTab\"></div><i class=\"empty\" ng-click=\"clear($event)\"></i><input ng-readonly=\"disableKeyboardInput\" ng-model=\"displayStr\" placeholder=\"{{placeholder}}\"></div>"
  );


  $templateCache.put('lui/templates/department-picker/department-picker.html',
    "<ui-select ng-class=\"{'is-searching': !!$select.search}\" ng-model=\"internal.selectedDepartment\" ng-disabled=\"controlDisabled\" search-enabled=\"true\" on-select=\"selectDepartment()\" uis-open-close=\"onDropdownToggle(isOpen)\"><ui-select-match placeholder=\"{{ $select.selected.name }}\" allow-clear=\"true\" title=\"{{ $select.selected.name }}\">{{ $select.selected.name }}</ui-select-match><ui-select-choices repeat=\"department in departmentsToDisplay track by $index\" luid-on-scroll-bottom=\"loadMore($select.search)\" refresh=\"search($select.search)\" refresh-delay=\"0\"><div ng-class=\"{'has-child': !!department.hasChild}\"><em ng-if=\"!$select.search\" class=\"departmentpicker-tree-level\" ng-repeat=\"level in getLevel(department) track by $index\"></em> <span class=\"departmentpicker-label\" ng-bind-html=\"department.name | highlight: $select.search\"></span></div><small ng-if=\"!!$select.search\"><i ng-bind-html=\"department.ancestorsLabel | highlight: $select.search\"></i></small></ui-select-choices></ui-select>"
  );


  $templateCache.put('lui/templates/formly/fields/api-select-multiple.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><luid-api-select-multiple api=\"options.templateOptions.api\" filter=\"options.templateOptions.filter\" placeholder=\"{{::options.templateOptions.placeholder}}\" name=\"{{::id}}\" ng-model=\"model[options.key]\" ng-required=\"{{::options.templateOptions.required}}\"></luid-api-select-multiple><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/api-select.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><luid-api-select api=\"options.templateOptions.api\" allow-clear=\"options.templateOptions.allowClear\" filter=\"options.templateOptions.filter\" placeholder=\"{{::options.templateOptions.placeholder}}\" name=\"{{::id}}\" ng-model=\"model[options.key]\" ng-required=\"{{::options.templateOptions.required}}\"></luid-api-select><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/checkbox.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui checkbox {{::options.templateOptions.style}} input\"><input type=\"checkbox\" name=\"{{::id}}\" ng-model=\"model[options.key]\" ng-disabled=\"options.templateOptions.disabled\"><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/date.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><luid-date-picker-popup class=\"{{::options.templateOptions.style}}\" ng-model=\"model[options.key]\" ng-required=\"{{::options.templateOptions.required}}\" name=\"{{::id}}\" ng-disabled=\"options.templateOptions.disabled\"></luid-date-picker-popup><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/daterange.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><luid-daterange-picker ng-model=\"model[options.key]\" ng-required=\"{{::options.templateOptions.required}}\" name=\"{{::id}}\" ng-disabled=\"options.templateOptions.disabled\"></luid-daterange-picker><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/department.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><luid-department-picker ng-model=\"model[options.key]\" ng-required=\"{{::options.templateOptions.required}}\" ng-disabled=\"options.templateOptions.disabled\" name=\"{{::id}}\"></luid-department-picker><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/email.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><input placeholder=\"{{::options.templateOptions.placeholder }}\" type=\"email\" name=\"{{::id}}\" ng-model=\"model[options.key]\" ng-required=\"{{::options.templateOptions.required}}\" ng-disabled=\"options.templateOptions.disabled\"><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.email\">{{::options.templateOptions.emailError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/iban.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><luid-iban ng-model=\"model[options.key]\" ng-required=\"{{::options.templateOptions.required}}\" name=\"{{::id}}\" ng-disabled=\"options.templateOptions.disabled\"></luid-iban><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && (form.{{::id}}.$error.iban || form.{{::id}}.$error.maxlength)\">{{::options.templateOptions.ibanError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/number.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><input placeholder=\"{{::options.templateOptions.placeholder }}\" type=\"number\" name=\"{{::id}}\" ng-model=\"model[options.key]\" ng-required=\"{{::options.templateOptions.required}}\" ng-disabled=\"options.templateOptions.disabled\"><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/picture.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><luid-image-picker class=\"{{::options.templateOptions.size}} {{::options.templateOptions.style}}\" ng-model=\"model[options.key]\" name=\"{{::id}}\" ng-required=\"{{options.templateOptions.required}}\" ng-disabled=\"options.templateOptions.disabled\"></luid-image-picker><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/portrait.html',
    "<div class=\"lui {{::options.templateOptions.display}} portrait field\"><div class=\"lui {{::options.templateOptions.style}} input\"><luid-image-picker class=\"{{::options.templateOptions.size}} {{::options.templateOptions.style}}\" ng-model=\"model[options.key]\" name=\"{{::id}}\" ng-required=\"{{options.templateOptions.required}}\" ng-disabled=\"options.templateOptions.disabled\" delete-enabled=\"options.templateOptions.deleteEnabled\" cropping-ratio=\"options.templateOptions.ratio\"></luid-image-picker><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/radio.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><div class=\"lui radio input\" ng-repeat=\"choice in options.templateOptions.choices\"><input id=\"{{::id}}_{{$index}}\" type=\"radio\" name=\"{{::id}}\" ng-model=\"model[options.key]\" ng-required=\"{{options.templateOptions.required}}\" ng-disabled=\"options.templateOptions.disabled\" ng-value=\"choice\"><label for=\"{{::id}}_{{$index}}\">{{ choice.label }}</label></div><label>{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper}}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/select.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><ui-select ng-model=\"model[options.key]\" ng-required=\"{{options.templateOptions.required}}\" ng-disabled=\"options.templateOptions.disabled\" name=\"{{::id}}\" focus-on=\"{{::id}}\"><ui-select-match placeholder=\"{{::options.templateOptions.placeholder}}\" allow-clear=\"true\" title=\"{{$select.selected.label}}\">{{$select.selected.label}}</ui-select-match><ui-select-choices repeat=\"choice in options.templateOptions.choices | filter : $select.search\"><div ng-bind-html=\"choice.label | highlight: $select.search\"></div></ui-select-choices></ui-select><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/text.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><input placeholder=\"{{::options.templateOptions.placeholder }}\" name=\"{{::id}}\" ng-model=\"model[options.key]\" ng-required=\"{{options.templateOptions.required}}\" ng-disabled=\"options.templateOptions.disabled\"><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/textarea.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><textarea placeholder=\"{{::options.templateOptions.placeholder }}\" name=\"{{::id}}\" ng-model=\"model[options.key]\" ng-required=\"{{options.templateOptions.required}}\" ng-disabled=\"options.templateOptions.disabled\" rows=\"{{::options.templateOptions.rows }}\"></textarea><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/user-multiple.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><luid-user-picker-multiple ng-model=\"model[options.key]\" ng-required=\"{{::options.templateOptions.required}}\" ng-disabled=\"options.templateOptions.disabled\" name=\"{{::id}}\"></luid-user-picker-multiple><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/fields/user.html',
    "<div class=\"lui {{::options.templateOptions.display}} field\"><div class=\"lui {{::options.templateOptions.style}} input\"><luid-user-picker ng-model=\"model[options.key]\" ng-required=\"{{::options.templateOptions.required}}\" ng-disabled=\"options.templateOptions.disabled\" name=\"{{::id}}\" allow-clear=\"true\"></luid-user-picker><label for=\"{{::id}}\">{{ options.templateOptions.label }}</label></div><small class=\"message helper\">{{ options.templateOptions.helper }}</small> <small class=\"message error lui animated up fade in\" ng-show=\"form.{{::id}}.$dirty && form.{{::id}}.$error.required\">{{::options.templateOptions.requiredError}}</small></div>"
  );


  $templateCache.put('lui/templates/formly/inputs/api-select-multiple.html',
    "<ui-select multiple><ui-select-match placeholder=\"{{::placeholder}}\" title=\"{{$item.name}}\">{{$item.name}}</ui-select-match><ui-select-choices repeat=\"choice in choices track by choice.id\" refresh=\"refresh($select.search)\" refresh-delay=\"0\" luid-on-scroll-bottom=\"loadMore($select.search)\"><div ng-bind-html=\"choice.name | highlight: $select.search\"></div></ui-select-choices></ui-select>"
  );


  $templateCache.put('lui/templates/formly/inputs/api-select.html',
    "<ui-select uis-open-close=\"onDropdownToggle(isOpen)\"><ui-select-match placeholder=\"{{::placeholder}}\" allow-clear=\"{{allowClear}}\" title=\"{{$select.selected.name}}\">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat=\"choice in choices track by choice.id\" refresh=\"refresh($select.search)\" refresh-delay=\"0\" luid-on-scroll-bottom=\"loadMore($select.search)\"><div ng-bind-html=\"choice.name | highlight: $select.search\" ng-hide=\"$last &&!!choice.loading\"></div><div ng-show=\"$last &&!!choice.loading\" class=\"lui loader\"></div></ui-select-choices></ui-select>"
  );


  $templateCache.put('lui/templates/iban/iban.view.html',
    "<input id=\"countryCode\" class=\"upper-case\" size=\"2\" maxlength=\"2\" ng-model=\"countryCode\" ng-model-options=\"{ allowInvalid: true }\" ng-change=\"updateValue()\" ng-paste=\"pasteIban($event)\" ng-focus=\"selectInput($event)\" luid-select-next ng-blur=\"setTouched()\"> <input id=\"controlKey\" class=\"upper-case\" size=\"2\" maxlength=\"2\" ng-model=\"controlKey\" ng-model-options=\"{ allowInvalid: true }\" ng-change=\"updateValue()\" luid-select-next ng-blur=\"setTouched()\" luid-keydown mappings=\"controlKeyMappings\"> <input id=\"bban\" class=\"upper-case\" size=\"22\" maxlength=\"30\" ng-model=\"bban\" ng-model-options=\"{ allowInvalid: true }\" ng-change=\"updateValue()\" ng-blur=\"setTouched()\" luid-keydown mappings=\"bbanMappings\">"
  );


  $templateCache.put('lui/templates/image-picker/image-cropper.modal.html',
    "<div class=\"luid-cropper\"><ui-cropper image=\"image\" result-image=\"cropped\" area-type=\"rectangle\" result-image-size=\"'max'\" aspect-ratio=\"croppingRatio\"></ui-cropper></div><footer class=\"modal-footer lui right aligned\"><div class=\"lui button\" ng-click=\"crop()\">{{ 'LUIIMGCROPPER_CROP' | translate }}</div><div class=\"lui button\" ng-click=\"donotcrop()\">{{ 'LUIIMGCROPPER_DO_NOT_CROP' | translate }}</div><div class=\"lui flat button\" ng-click=\"cancel()\">{{ cancelLabel }}</div></footer>"
  );


  $templateCache.put('lui/templates/image-picker/image-picker-popovermenu.html',
    "<ul class=\"image-picker-menu\"><li class=\"image-picker-menu-item\" ng-click=\"uploadNewImage($event)\" translate=\"LUIIMGPICKER_MODIFY_IMAGE\"></li><li class=\"image-picker-menu-item\" ng-click=\"onDelete()\" translate=\"LUIIMGPICKER_DELETE_IMAGE\"></li></ul>"
  );


  $templateCache.put('lui/templates/image-picker/image-picker.html',
    "<div class=\"lui image-picker\" ng-class=\"{ uploading: uploading, 'is-disabled': isDisabled }\" uib-popover-template=\"'lui/templates/image-picker/image-picker-popovermenu.html'\" popover-trigger=\"'none'\" popover-is-open=\"popover.isOpen\" popover-class=\"lui luid-image-picker-popup\" ng-click=\"togglePopover($event)\"><div class=\"luid-image-picker-picture\" ng-style=\"pictureStyle\"><input accept=\"image/*\" type=\"file\" ng-disabled=\"!!isDisabled\" ng-model=\"file\" class=\"fileInput\" file-model=\"image\" luid-image-cropper on-cropped=\"onCropped\" on-cancelled=\"onCancelled\" cropping-disabled=\"croppingDisabled\" cropping-ratio=\"croppingRatio\" onclick=\"event.stopPropagation()\"><div class=\"upload-overlay\"><div class=\"lui inverted loader\"></div></div><div class=\"input-overlay\" ng-class=\"{'hide-editable': hideEditHint}\"><div class=\"overlay-content\"><i class=\"lui icon edit\"></i> <span class=\"lui capitalized sentence\" translate=\"LUIIMGPICKER_UPLOAD_IMAGE\"></span></div></div></div>"
  );


  $templateCache.put('lui/templates/notify-service/alert.html',
    "<section>{{message}}</section><footer class=\"lui right aligned\"><button class=\"lui button\" ng-click=\"ok()\">{{okLabel}}</button></footer>"
  );


  $templateCache.put('lui/templates/notify-service/confirm.html',
    "<section>{{message}}</section><footer class=\"lui right aligned\"><button class=\"lui button\" ng-click=\"ok()\">{{okLabel}}</button> <button class=\"lui flat button\" ng-click=\"cancel()\">{{cancelLabel}}</button></footer>"
  );


  $templateCache.put('lui/templates/notify-service/error.html',
    "<div class=\"lui callout filled luis-notify red typeset\" ng-style=\"{'margin-left': $centerMargin}\"><div class=\"lui small red button icon cross close\" ng-click=\"$close()\"></div><h5 ng-show=\"!$message\">Error</h5><h5 ng-hide=\"!$message\">{{ $message }}</h5></div>"
  );


  $templateCache.put('lui/templates/notify-service/loading.html',
    "<div class=\"lui up callout luis-notify typeset\" ng-class=\"[calloutClass]\" ng-style=\"{'margin-left': $centerMargin}\"><div class=\"lui small filling button icon cross close\" ng-click=\"$close()\" ng-hide=\"loading\"></div><div class=\"lui small filling button icon cross close\" ng-click=\"cancel()\" ng-show=\"loading && canCancel\"></div><h5 ng-show=\"!message\"><span class=\"lui loader\" ng-show=\"loading\"></span>&nbsp;&nbsp;Loading</h5><h5 ng-hide=\"!message\"><span class=\"lui loader\" ng-show=\"loading\"></span>&nbsp;&nbsp;{{ message }}</h5></div>"
  );


  $templateCache.put('lui/templates/notify-service/success.html',
    "<div class=\"lui green up callout luis-notify typeset\" ng-style=\"{'margin-left': $centerMargin}\"><div class=\"lui small filling button icon cross close\" ng-click=\"$close()\"></div><h5 ng-show=\"!$message\">Success</h5><h5 ng-hide=\"!$message\">{{ $message }}</h5></div>"
  );


  $templateCache.put('lui/templates/notify-service/warning.html',
    "<div class=\"lui orange up callout luis-notify typeset\" ng-style=\"{'margin-left': $centerMargin}\"><div class=\"lui small filling button icon cross close\" ng-click=\"$close()\"></div><h5 ng-show=\"!$message\">Warning</h5><h5 ng-hide=\"!$message\">{{ $message }}</h5></div>"
  );


  $templateCache.put('lui/templates/table-grid/table-grid.html',
    "<div class=\"lui tablegrid\"><div class=\"scrollable columns\"><div class=\"virtualscroll\" ng-include=\"'lui/templates/table-grid/table-grid.table.html'\"></div></div><div class=\"locked columns\" ng-if=\"existFixedRow || isSelectable\"><div class=\"holder\"><div class=\"virtualscroll\" ng-include=\"'lui/templates/table-grid/table-grid.table.html'\"></div></div></div></div>"
  );


  $templateCache.put('lui/templates/table-grid/table-grid.table.html',
    "<table><thead><tr role=\"row\" ng-repeat=\"row in ::headerRows track by $index\" ng-if=\"$index !== 0\"><th ng-if=\"isSelectable\" style=\"width: 3.5em\" class=\"locked\" role=\"columnheader\" colspan=\"1\" rowspan=\"1\"></th><th role=\"columnheader\" class=\"sortable\" ng-repeat=\"header in ::row track by $index\" ng-click=\"updateOrderedRows(header)\" ng-class=\"{'locked': header.fixed, 'desc': (selected.orderBy === header && selected.reverse === false), 'asc': (selected.orderBy === header && selected.reverse === true)}\" ng-style=\"{'max-width': header.width + 'em', 'min-width': header.width + 'em', 'text-align': header.textAlign}\" rowspan=\"{{ header.rowspan }}\" colspan=\"{{ header.colspan }}\">{{ header.label }}</th></tr><tr role=\"row\"><th ng-if=\"isSelectable\" style=\"width: 3.5em\" class=\"locked\" role=\"columnheader\" colspan=\"1\" rowspan=\"1\"><div class=\"lui solo checkbox input\"><input ng-class=\"masterCheckBoxCssClass\" type=\"checkbox\" ng-model=\"allChecked.value\" ng-change=\"onMasterCheckBoxChange()\" ng-value=\"true\"><label>&nbsp;</label></div></th><th role=\"columnheader\" ng-repeat=\"header in ::colDefinitions track by $index\" ng-style=\"{'max-width': header.width + 'em', 'min-width': header.width + 'em'}\" ng-if=\"::header.filterType != FilterTypeEnum.NONE\" colspan=\"1\" rowspan=\"1\" class=\"filtering\"><div class=\"lui fitting searchable input\" ng-if=\"::header.filterType === FilterTypeEnum.TEXT\"><input ng-change=\"updateFilteredRows()\" ng-model=\"filters[$index].currentValues[0]\" ng-model-options=\"{ updateOn: 'default blur', debounce: { 'default': 500, 'blur': 0 } }\"></div><div class=\"lui fitting input\" ng-if=\"header.filterType === FilterTypeEnum.MULTISELECT && filters[$index].selectValues.length > 1\"><ui-select multiple ng-model=\"filters[$index].currentValues\" reset-search-input=\"true\" on-remove=\"updateFilteredRows()\" on-select=\"updateFilteredRows()\"><ui-select-match placeholder=\"{{ 'SELECT_ITEMS' | translate }}\">{{ $item }}</ui-select-match><ui-select-choices repeat=\"value in filters[$index].selectValues | filter: $select.search\"><span ng-bind-html=\"value\"></span></ui-select-choices></ui-select></div><div class=\"lui fitting input\" ng-if=\"header.filterType === FilterTypeEnum.SELECT && filters[$index].selectValues.length > 1\"><ui-select ng-model=\"filters[$index].currentValues[0]\" reset-search-input=\"true\" on-select=\"updateFilteredRows()\" allow-clear><ui-select-match allow-clear=\"true\" placeholder=\"{{ 'SELECT_ITEM' | translate }}\" title=\"{{ $select.selected }}\">{{ $select.selected }}</ui-select-match><ui-select-choices repeat=\"value in filters[$index].selectValues | filter: $select.search\"><span ng-bind-html=\"value\"></span></ui-select-choices></ui-select></div></th></tr></thead><tbody><tr role=\"row\" ng-repeat=\"row in visibleRows\" ng-style=\"row.styles\" ng-click=\"internalRowClick($event, row);\"><td ng-if=\"isSelectable\" style=\"width: 3.5em\" class=\"locked\" colspan=\"1\" rowspan=\"1\"><div class=\"lui solo checkbox input\"><input type=\"checkbox\" ng-change=\"onCheckBoxChange()\" ng-model=\"row._luiTableGridRow.isChecked\"><label>&nbsp;</label></div></td><td role=\"cell\" ng-repeat=\"cell in ::colDefinitions track by $index\" ng-style=\"{'max-width': cell.width + 'em', 'min-width': cell.width + 'em', 'white-space': cell.preserveLineBreaks ? 'pre-line' : 'normal'}\" ng-bind-html=\"cell.getValue(row)\" ng-class=\"{'locked': cell.fixed, 'lui left aligned': cell.textAlign == 'left', 'lui right aligned': cell.textAlign == 'right', 'lui center aligned': cell.textAlign == 'center'}\"></td></tr></tbody></table>"
  );


  $templateCache.put('lui/templates/translations-list/translations-list.html',
    "<div><nav class=\"lui dividing justified primary menu\"><a class=\"lui item\" ng-repeat=\"culture in cultures\" ng-class=\"{ 'active': culture === selectedCulture }\" ng-click=\"selectCulture(culture)\" ng-bind-html=\"culture | uppercase\"></a></nav><content><ul class=\"lui unstyled field container\"><li class=\"lui input animated left fade in\" ng-repeat=\"value in values[selectedCulture].values track by $index\"><input ng-model=\"values[selectedCulture].values[$index].value\" ng-disabled=\"isDisabled\" ng-paste=\"onPaste($event, $index)\" placeholder=\"{{ getPlaceholder(selectedCulture, $index) }}\" ng-change=\"onInputValueChanged()\" luid-keydown mappings=\"addValueOnEnter\" id=\"{{ getUniqueId($parent.selectedCulture, $index) }}\"> <button class=\"lui flat button icon cross close animated right fade in\" ng-click=\"deleteValue($index)\" ng-if=\"!isDisabled\" tabindex=\"-1\"></button></li></ul><footer ng-if=\"!isDisabled\"><button ng-click=\"addValueAndFocus()\" ng-hide=\"isAddValueDisabled()\" class=\"lui button filled animated up fade in\" translate=\"LUID_TRANSLATIONSLIST_ADD_VALUE\"></button></footer></content></div>"
  );


  $templateCache.put('lui/templates/user-picker/user-picker.html',
    "<ui-select ng-disabled=\"controlDisabled\" search-enabled=\"true\" on-select=\"onSelect()\" on-remove=\"onRemove()\" uis-open-close=\"onOpen(isOpen)\" open-on=\"toggleFormerEmployees\"><ui-select-match placeholder=\"{{placeholder}}\" allow-clear=\"{{!!allowClear}}\" title=\"{{$select.selected.lastName + ' ' + $select.selected.firstName}}\"><span ng-if=\"$select.selected.id === -1\" translate>LUIDUSERPICKER_ALL</span> <span ng-if=\"$select.selected.id !== -1\" ng-bind-html=\"$select.selected.lastName + ' ' + $select.selected.firstName\"></span></ui-select-match><ui-select-choices repeat=\"user in users track by $index\" refresh=\"find($select.search)\" refresh-delay=\"0\" luid-on-scroll-bottom=\"loadMore()\"><div ng-if=\"user.id === myId\" class=\"selected-first\" ng-class=\"{'dividing': $index === 0}\" ng-bind-html=\"user.lastName + ' ' + user.firstName | luifHighlight : $select.search : user.info : 'LUIDUSERPICKER_ME'\"></div><div ng-if=\"user.id === -1\" translate>LUIDUSERPICKER_ALL</div><div ng-if=\"user.id !== myId\" ng-bind-html=\"user.lastName + ' ' + user.firstName | luifHighlight : $select.search : user.info\"></div><div ng-if=\"user.hasLeft\"><small translate translate-values=\"{dtContractEnd:user.dtContractEnd}\">LUIDUSERPICKER_FORMEREMPLOYEE</small></div><div ng-if=\"user.hasHomonyms\" ng-repeat=\"property in user.additionalProperties\"><small><i class=\"lui icon {{property.icon}}\"></i> <b data-ng-bind-html=\"property.translationKey | translate\"></b> <span data-ng-bind-html=\"property.value\"></span></small></div></ui-select-choices></ui-select>"
  );


  $templateCache.put('lui/templates/user-picker/user-picker.multiple.html',
    "<ui-select multiple ng-disabled=\"controlDisabled\" search-enabled=\"true\" on-select=\"onSelect()\" on-remove=\"onRemove()\" close-on-select=\"false\" reset-search-input=\"true\" uis-open-close=\"onOpen(isOpen)\" open-on=\"toggleFormerEmployees\"><ui-select-match placeholder=\"{{placeholder}}\" allow-clear=\"{{!!allowClear}}\">{{$item.lastName}} {{$item.firstName}}</ui-select-match><ui-select-choices repeat=\"user in users track by $index\" refresh=\"find($select.search)\" refresh-delay=\"0\" luid-on-scroll-bottom=\"loadMore()\"><div ng-if=\"user.id === myId\" class=\"selected-first\" ng-class=\"{'dividing': $index === 0}\" ng-bind-html=\"user.lastName + ' ' + user.firstName | luifHighlight : $select.search : user.info : 'LUIDUSERPICKER_ME'\"></div><div ng-if=\"user.id === -1\" translate>LUIDUSERPICKER_ALL</div><div ng-if=\"user.id !== myId\" ng-bind-html=\"user.lastName + ' ' + user.firstName | luifHighlight : $select.search : user.info\"></div><div ng-if=\"user.hasLeft\"><small translate translate-values=\"{dtContractEnd:user.dtContractEnd}\">LUIDUSERPICKER_FORMEREMPLOYEE</small></div><div ng-if=\"user.hasHomonyms\" ng-repeat=\"property in user.additionalProperties\"><small><i class=\"lui icon {{property.icon}}\"></i> <b data-ng-bind-html=\"property.translationKey | translate\"></b> <span data-ng-bind-html=\"property.value\"></span></small></div></ui-select-choices></ui-select>"
  );

}]);
;/* global angular */
(function(){
	'use strict';
	var DayBlockDirective = function () {
		return {
			template : 
			'<div>'+

			'<div ng-style="controller.weekdayStyleOverride()" '+
			'ng-if = "controller.showDay" class="weekday">{{controller.date | luifMoment: \'dddd\'}}'+
			'</div>'+

			'<div ng-style="controller.dayStyleOverride()" ' +
			'class="day">{{controller.date | luifMoment:\'DD\'}}'+
			'</div>'+

			'<div ng-style="controller.monthStyleOverride()" ' +
			'class="month">{{controller.date | luifMoment: \'MMM\'}}'+
			'</div>'+

			'<div ng-style="controller.yearStyleOverride()" ' +
			'class="year">{{controller.date | luifMoment: \'YYYY\'}}'+
			'</div>'+

			'</div>',

			scope : {
				date: '=',
				showDay: '=',
				primaryColor: '=',
				secondaryColor: '='
			},

			restrict : 'E',
			bindToController : true,
			controllerAs : 'controller',
			controller : 'luidDayBlockController'
		};
	};


	angular
	.module('lui')
	.directive('luidDayBlock', DayBlockDirective)
	.controller('luidDayBlockController', function(){
		var controller = this;

		controller.weekdayStyleOverride = function() {
			return { 
				color: controller.primaryColor, 
			};
		};
		controller.dayStyleOverride = function() {
			return { 
				"background-color": controller.primaryColor, 
				"border-color": controller.primaryColor, 
				"color": controller.secondaryColor, 
			};
		};
		controller.monthStyleOverride = function() {
			return { 
				"background-color": controller.secondaryColor, 
				"border-color": controller.primaryColor, 
				"color": controller.primaryColor, 
			};
		};
		controller.yearStyleOverride = function() {
			return { 
				"background-color": controller.secondaryColor, 
				"border-color": controller.primaryColor, 
				"color": controller.primaryColor, 
			};
		};


	});

})();


;(function(){
	'use strict';
		/**
	** DEPENDENCIES
	**  - none
	**/
	angular.module('lui')
	.directive('luidKeydown', function () {
		return {
			restrict: 'A',
			scope:{
				mappings: '='
			},
			link: function (scope, element, attrs) {
				element.on('keydown', function (e) {
					if ( !!scope.mappings && !!scope.mappings[e.which] ){
						scope.mappings[e.which](e);
						// e.preventDefault();
					}
				});
			}
		};
	});
	angular.module('lui')
	.directive('luidSelectOnClick', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.on('click', function () {
					this.select();
				});
				element.on('focus', function () {
					this.select();
				});
			}
		};
	});
	angular.module('lui')
	.directive('luidFocusOn', function() {
		return function(scope, elem, attr) {
			scope.$on(attr.luidFocusOn, function(e) {
				setTimeout( function() { elem[0].focus(); scope.$apply(); }, 1);
			});
		};
	});
})();
;(function () {
	"use strict";

	/**
	 ** DEPENDENCIES
	 **  - angular translate
	 **  - underscore
	 **/

	angular.module("lui.translate")
		.directive("luidTranslations", ["$translate", "_", "$filter", "$timeout", function ($translate, _, $filter, $timeout) {
			function link(scope, element, attrs, ctrls) {
				var ngModelCtrl = ctrls[1];
				var translateCtrl = ctrls[0];

				/** Associations language/code */
				var languagesToCodes = { en: 1033, de: 1031, es: 1034, fr: 1036, it: 1040, nl: 2067 };

				/** List of all the available languages labels */
				var cultures = _.keys(languagesToCodes);
				scope.cultures = cultures;

				scope.currentCulture = $translate.preferredLanguage() || "en";

				var mode = !!attrs.mode ? attrs.mode : "dictionary";
				if (mode === "dictionary" && ngModelCtrl.$viewValue !== undefined) {
					_.each(cultures, function (culture) {
						scope.$watch(
							function () { return !!ngModelCtrl.$viewValue ? ngModelCtrl.$viewValue[culture] : ngModelCtrl.$viewValue; },
							function () { ngModelCtrl.$render(); }
						);
					});
				}

				ngModelCtrl.$render = function () {
					scope.internal = parse(ngModelCtrl.$viewValue);
					translateCtrl.updateTooltip();
				};

				translateCtrl.updateViewValue = function () {
					switch (mode) {
						case "dictionary":
							return updateDictionary(scope.internal);
						case "|":
						case "pipe":
							return updatePipe(scope.internal);
						case "lucca":
							return updateLucca(scope.internal);
					}
				};

				translateCtrl.updateTooltip = function () {
					var tooltipText = "";
					if(!!!scope.internal) {
						scope.tooltipText = undefined;
						return;
					}
					for(var i = 0; i < scope.cultures.length; i++) {
						if(!!scope.internal[scope.cultures[i]]) {
							tooltipText += "["+scope.cultures[i].toUpperCase()+"] : "+ scope.internal[scope.cultures[i]] + "\n";
						}
					}
					scope.tooltipText = tooltipText;
				};

				var parse = function (value) {
					if (value === undefined) { return undefined; }
					switch (mode) {
						case "dictionary":
							return parseDictionary(value);
						case "|":
						case "pipe":
							return parsePipe(value);
						case "lucca":
							return parseLucca(value);
						default:
							return undefined;
					}
				};

				// Mode lucca
				var parseLucca = function (value) {
					return _.reduce(cultures, function (memo, culture) {
						var targetLabel = _.findWhere(value, { cultureCode: languagesToCodes[culture] });
						memo[culture] = !!targetLabel ? targetLabel.value : undefined;
						// We need to keep the original id
						memo[culture + "_id"] = !!targetLabel ? targetLabel.id : undefined;
						return memo;
					}, {});
				};
				var updateLucca = function (value) {
					var allEmpty = true;
					var viewValue = [];
					_.each(cultures, function (culture) {
						if (!!value[culture] && value[culture] !== "") {
							viewValue.push({ id: value[culture + "_id"], cultureCode: languagesToCodes[culture], value: value[culture] });
							allEmpty = false;
						}
					});
					ngModelCtrl.$setViewValue(allEmpty ? undefined : viewValue);
					scope.$parent.$eval(attrs.ngChange);
				};

				// Mode dictionary
				var parseDictionary = function (value) {
					return _.reduce(cultures, function (memo, culture) {
						memo[culture] = value[culture];
						return memo;
					}, {});
				};
				var updateDictionary = function (value) {
					var allEmpty = true;
					var viewValue = {};
					_.each(cultures, function (culture) {
						viewValue[culture] = value[culture];
						allEmpty &= value[culture] === undefined || value[culture] === "";
					});
					ngModelCtrl.$setViewValue(allEmpty ? undefined : viewValue);
					scope.$parent.$eval(attrs.ngChange); // needs to be called manually cuz the object ref of the $viewValue didn't change
				};

				// Mode pipe
				var parsePipe = function (value) {
					// value looks like this "en:some stuff|de:|nl:|fr:des bidules|it:|es:"
					var translations = value.split("|");
					var result = {};
					_.each(translations, function (t) {
						var key = t.substring(0, 2);
						var val = t.substring(3);
						result[key] = val;
					});
					return _.pick(result, cultures);
				};
				var updatePipe = function (value) {
					if (!_.find(cultures, function (culture) { return value[culture] !== undefined && value[culture] !== ""; })) {
						ngModelCtrl.$setViewValue(undefined);
					} else {
						var newVal = _.map(cultures, function (c) {
							if (!!value[c]) {
								return c + ":" + value[c];
							}
							return c + ":";
						}).join("|");
						ngModelCtrl.$setViewValue(newVal);
					}
				};
			}
			return {
				require: ['luidTranslations', '^ngModel'],
				controller: 'luidTranslationsController',
				scope: {
					mode: '@', // allowed values: "pipe" (or "|"), "dictionary", "lucca" (lucca proprietary format)
					size: "@", // the size of the input (short, long, x-long, fitting)
					isDisabled: "=ngDisabled"
				},
				templateUrl: "lui/directives/luidTranslations.html",
				restrict: 'EA',
				link: link
			};
		}])
		.controller('luidTranslationsController', ['$scope', '$translate', '$timeout', function ($scope, $filter, $timeout) {
			var ctrl = this;
			/******************
			* UPDATE          *
			******************/
			$scope.update = function () { ctrl.updateViewValue(); ctrl.updateTooltip(); };

			/******************
			* FOCUS & BLUR    *
			******************/

			$scope.focusInput = function () {
				$scope.focused = true;
			};
			$scope.blurInput = function () {
				$scope.focused = false;
			};

			$scope.blurOnEnter = function($event) {
				$event.target.blur();
				$event.preventDefault();
			};
		}]);

	/**************************/
	/***** TEMPLATES      *****/
	/**************************/
	angular.module("lui").run(["$templateCache", function ($templateCache) {
		$templateCache.put("lui/directives/luidTranslations.html",
			"<div class=\"lui dropdown {{size}} field\" ng-class=\"{open:focused}\" tooltip-class=\"lui\" tooltip-placement=\"top\"  uib-tooltip=\"{{tooltipText}}\">" +
			"	<div class=\"lui input\">" +
			"		<input type=\"text\" ng-disabled=\"isDisabled\" ng-model=\"internal[currentCulture]\" ng-focus=\"focusInput()\" ng-blur=\"blurInput()\" ng-keypress=\"$event.keyCode === 13 && blurOnEnter($event)\" ng-change=\"update()\">" +
			"		<span class=\"unit\">{{currentCulture}}</span>" +
			"	</div>" +
			"	<div class=\"dropdown-menu\">" +
			"		<div class=\"lui {{size}} field\" ng-repeat=\"culture in cultures\" ng-if=\"culture !== currentCulture\">" +
			"			<div class=\"lui input\">" +
			"				<input type=\"text\" ng-disabled=\"isDisabled\" ng-model=\"internal[culture]\" ng-focus=\"focusInput()\" ng-blur=\"blurInput()\" ng-keypress=\"$event.keyCode === 13 && blurOnEnter($event)\" ng-change=\"update()\">" +
			"				<span class=\"unit addon\">{{culture}}</span>" +
			"			</div>" +
			"		</div>" +
			"	</div>" +
			"</div>" +
			"");
	}]);
})();
;(function(){
	'use strict';
	/**
	** DEPENDENCIES
	**  - moment
	**/
	var MAGIC_DELAY_BEFORE_WHEEL = 200;

	angular.module('lui')
	.directive('luidMoment', ['moment', function(moment){
		function link(scope, element, attrs, ctrls){
			var ngModelCtrl = ctrls[1];
			var mpCtrl = ctrls[0];

			// display the value i on two chars
			if(!!attrs.format){ // allows to have a ng-model of type string, not moment
				var format = scope.$eval(attrs.format);

				ngModelCtrl.getValue = function() {
					var vv = ngModelCtrl.$viewValue;
					if (!vv) {
						return undefined;
					}
					var momentVv = moment(vv, format);
					if (!momentVv.isValid()) {
						return undefined;
					}
					return momentVv;
				};

				ngModelCtrl.$render = function() {
					var momentValue = ngModelCtrl.getValue();
					scope.hours = !!momentValue ? momentValue.format('HH') : undefined;
					scope.mins = !!momentValue ? momentValue.format('mm') : undefined;
					ngModelCtrl.$validate();
				};

				ngModelCtrl.setValue = function(newMomentValue) {
					ngModelCtrl.$setViewValue(!newMomentValue ? undefined : newMomentValue.format(format));
				};
				ngModelCtrl.$validators.min = function (modelValue,viewValue) {
					return !viewValue || mpCtrl.checkMin(moment(modelValue, format));
				};
				ngModelCtrl.$validators.max = function (modelValue,viewValue) {
					return !viewValue || mpCtrl.checkMax(moment(modelValue, format));
				};
			} else {
				ngModelCtrl.getValue = function() {
					var vv = ngModelCtrl.$viewValue;
					if (!vv) {
						return undefined;
					}
					var momentVv = moment(vv);
					if (!vv.isValid()) {
						return undefined;
					}
					return momentVv;
				};
				ngModelCtrl.$render = function() {
					var vv = ngModelCtrl.getValue();
					var condition = !!vv && vv.isValid();
					scope.hours = condition ? vv.format('HH') : undefined;
					scope.mins = condition ? vv.format('mm') : undefined;
					ngModelCtrl.$validate();
				};
				ngModelCtrl.setValue = function(newMomentValue) {
					ngModelCtrl.$setViewValue(newMomentValue);
				};
				ngModelCtrl.$validators.min = function (modelValue,viewValue) {
					return !viewValue || mpCtrl.checkMin(modelValue);
				};
				ngModelCtrl.$validators.max = function (modelValue,viewValue) {
					return !viewValue || mpCtrl.checkMax(modelValue);
				};
			}

			scope.ngModelCtrl = ngModelCtrl;

			ngModelCtrl.$validators.hours = function (modelValue,viewValue) {
				return scope.hours !== undefined && scope.hours !== "" && !isNaN(parseInt(scope.hours));
			};
			ngModelCtrl.$validators.minutes = function (modelValue,viewValue) {
				return scope.mins !== undefined && scope.mins !== "" && parseInt(scope.mins) < 60;
			};

			var inputs = element.querySelectorAll('.input');
			mpCtrl.setupEvents(element, angular.element(inputs[0]), angular.element(inputs[1]));

			// reexecute validators if min or max change
			// will not be reexecuted if min is a moment and something like `min.add(3, 'h')` is called
			scope.$watch('min', function(){
				ngModelCtrl.$validate();
			});
			scope.$watch('max', function(){
				ngModelCtrl.$validate();
			});

		}

		return {
			require:['luidMoment','^ngModel'],
			controller:'luidMomentController',
			scope: {
				min:'=', // a moment or a str to specify the min for this input
				max:'=', // idem for max
				step:'=', // the number of minutes to add/subtract when clicking the addMins button or scrolling on the add in input
				referenceDate:'=', // when entering a time, the date to set it, also used to count the number of days between the ngModel and this date, if unavailable, will use min then max then today
				isDisabled:'=',
				showButtons:'=', // forces the buttons to be displayed even if neither inputs is focused
				enforceValid:'=', // prevents entering an ng-invalid input by correcting the value when losing focus

				format:'=', // alows ng-model to be a string with the right format

				// hacks
				minOffset:'=', // to avoid having to say min=val1+val2 because it causes an other digest cycle, we give the offset and the
				maxOffset:'='
			},
			templateUrl:"lui/directives/luidMoment.html",
			restrict:'EA',
			link: link,
		};
	}])
	.controller('luidMomentController', ['$scope', '$timeout', 'moment', '$element', function($scope, $timeout, moment, $element) {
		function incr(step) {
			function calculateNewValue() {
				function contains(array, value) { return array.indexOf(value) !== -1; }

				var curr = moment(currentValue());
				if (!curr || !curr.isValid()) { curr = getRefDate().startOf('day'); }
				if (contains(specialSteps, Math.abs(step)) && curr.minutes() % step !== 0) {
					step = step < 0 ? - (curr.minutes() % step) : -curr.minutes() % step + step;
				}

				var newValue = curr.add(step,'m');
				newValue.seconds(0);
				return newValue;
			}

			if ($scope.isDisabled) { return; }
			// $scope.ngModelCtrl.$setValidity('pattern', true);

			update(calculateNewValue(), true);
		}

		function update(newValue, autoCorrect) {
			updateWithoutRender(newValue, autoCorrect);
			$scope.ngModelCtrl.$render();
		}

		function updateWithoutRender(newValue, autoCorrect) {
			function correctedValue(newValue, min, max) {
				switch(true){
					case (!newValue) : return newValue;
					case (min && min.diff(newValue) > 0) : return min;
					case (max && max.diff(newValue) < 0) : return max;
					default : return newValue;
				}
			}
			var min = getMin();
			var max = getMax();

			if (autoCorrect) {
				var newCorrectedValue = correctedValue(newValue, min, max);
				if (newCorrectedValue.format("HH:mm") !== newValue.format("HH:mm")) {
					newValue = newCorrectedValue;

					$element.addClass('autocorrect');
					setTimeout(function() {
						$element.removeClass('autocorrect');
					}, 200);
				}
			}
			$scope.maxed = newValue && max && max.diff(newValue) <= 0;
			$scope.mined = newValue && min && min.diff(newValue) >= 0;

			$scope.ngModelCtrl.setValue(newValue);
		}

		// translate between string values and viewvalue
		function undefinedHoursOrMinutes() {
			return $scope.hours === undefined || $scope.hours === "" || $scope.mins === undefined || $scope.mins === "";
		}

		function getInputedTime() {
			if (undefinedHoursOrMinutes()) {
				return undefined;
			}

			var intHours = parseInt($scope.hours);
			var intMinutes = parseInt($scope.mins);
			// if (intHours != intHours) { intHours = 0; } // intHour isNaN
			// if (intMinutes != intMinutes) { intMinutes = 0; } // intMins isNaN
			if (intMinutes > 60) { intMinutes = 59; $scope.mins = "59"; }

			var initialTime = getRefDate().hours(intHours).minutes(intMinutes).seconds(0);

			// try to put time between min and max by adding some days while time < min and time !> max
			var time = betweenMinAndMax(initialTime);

			return time;
		}

		function betweenMinAndMax(refTime) {
			var time = moment(refTime);
			var minTime = moment(time), maxTime = moment(time);
			var min = getMin(), max = getMax();
			var dayCnt;
			// time < min, add enough day to have it after min
			if(!!min && time.isBefore(min)) {
				// number of days between min and time, rounded to next integer
				dayCnt = Math.ceil(min.diff(time, 'day', true));
				minTime.add(dayCnt, 'day');
			}
			// time > max
			if (!!max && time.isAfter(max)) {
				// number of days between max and time, rounded to previous integer
				dayCnt = Math.floor(max.diff(time, 'day', true));
				maxTime.add(dayCnt, 'days');
			}

			if (!!max && (minTime.isBefore(max) || minTime.isSame(max))) {
				return minTime;
			}
			if (!!min && (maxTime.isAfter(min) || maxTime.isSame(min))) {
				return maxTime;
			}
			return time;
		}

		function cancelTimeouts() {
			function cancel(timeout){
				if (!!timeout) {
					$timeout.cancel(timeout);
					timeout = undefined;
				}
			}
			cancel(hoursFocusTimeout);
			cancel(minsFocusTimeout);
		}

		function correctValue() {
			update(currentValue(), $scope.enforceValid);
		}

		function getStep() { return isNaN(parseInt($scope.step)) ? 5 : parseInt($scope.step); }

		function getRefDate() {
			function toMoment(value) { return (!!value && moment(value).isValid()) ? moment(value) : undefined; }

			return toMoment($scope.referenceDate) || toMoment($scope.min) || toMoment($scope.max) || moment();
		}

		function getExtremum(extremum, offset, checkMidnight) {
			function rawExtremum(){
				switch(true){
					// check if min/max is a valid moment
					case (!!extremum.isValid && !!extremum.isValid()) : return moment(extremum);
					// check if min/max is parsable by moment
					case (moment(extremum,'YYYY-MM-DD HH:mm').isValid()) : return moment(extremum,'YYYY-MM-DD HH:mm');
					// check if min/max is like '23:15'
					case (moment(extremum, 'HH:mm').isValid()) :
						var refDate = getRefDate();
						var extrem = moment(extremum, 'HH:mm').year(refDate.year()).month(refDate.month()).date(refDate.date());
						// a min/max time of '00:00' means midnight tomorrow
						if (checkMidnight && extrem.hours() + extrem.minutes() === 0) { extrem.add(1,'d');}
						return extrem;
				}
			}

			// min/max attr not specified
			if (!extremum) { return undefined; }
			var extrem = rawExtremum();
			extrem.add(moment.duration(offset));
			return extrem;
		}

		function getMin() {	return getExtremum($scope.min, $scope.minOffset, false); }
		function getMax() {	return getExtremum($scope.max, $scope.maxOffset, true);	}

		function currentValue() { return !$scope.format ? $scope.ngModelCtrl.$viewValue : moment($scope.ngModelCtrl.$viewValue, $scope.format); }

		function incrementEvent(eventName, value) {
			cancelTimeouts();
			incr(value);
			$scope.$broadcast(eventName);
		}

		function focusEvent(isMinute) {
			cancelTimeouts();
			$scope.minsFocused = !!isMinute;
			$scope.hoursFocused = !isMinute;
		}

		function blurEvent(timeout, isFocused){
			var model = $scope.ngModelCtrl.$modelValue;
			updateWithoutRender(model);
			timeout = $timeout(function(){
					timeout = false;
					correctValue();
			}, 200);
		}

		var hoursFocusTimeout, minsFocusTimeout;
		var specialSteps = [5, 10, 15, 20, 30];
		var mpCtrl = this;
		$scope.pattern = /^([0-9]{0,2})?$/;

		// stuff to control the focus of the different elements and the clicky bits on the + - buttons
		// what we want is show the + - buttons if one of the inputs is displayed
		// and we want to be able to click on said buttons without loosing focus (obv)
		$scope.incrHours = function() {	incrementEvent('focusHours', 60); };
		$scope.decrHours = function() {	incrementEvent('focusHours', -60); };
		$scope.incrMins = function() {	incrementEvent('focusMinutes', getStep()); };
		$scope.decrMins = function() {	incrementEvent('focusMinutes', -getStep()); };

		function isUndefinedOrEmpty(val) {
			return val === undefined || val === "";
		}

		// string value changed
		$scope.changeHours = function(){
			if(isUndefinedOrEmpty($scope.hours)){
				return updateWithoutRender(undefined);
			}

			if(isUndefinedOrEmpty($scope.mins)){
				$scope.mins = "00";
			}

			if ($scope.hours.length == 2) {
				if (parseInt($scope.hours) > 23) { $scope.hours = '23'; }
				$scope.$broadcast('focusMinutes');
			} else if ($scope.hours.length == 1 && parseInt($scope.hours) > 2) {
				$scope.hours = 0 + $scope.hours;
				$scope.$broadcast('focusMinutes');
			}
			updateWithoutRender(getInputedTime());
		};

		$scope.changeMins = function() {
			if (!$scope.mins || $scope.mins.length < 2) {
				$scope.ngModelCtrl.$setValidity("minutes", false);
			} else {
				updateWithoutRender(getInputedTime());
			}
		};

		// display stuff
		$scope.formatInputValue = function() { $scope.ngModelCtrl.$render(); };

		$scope.getDayGap = function(){
			var refDate = getRefDate().startOf('day');
			return moment.duration(moment(currentValue()).startOf('d').diff(refDate)).asDays();
		};

		$scope.blurHours = function() { blurEvent(hoursFocusTimeout, $scope.hoursFocused); };
		$scope.blurMins = function() {
			if(!$scope.mins) {
				if($scope.hours === "" || $scope.hours === undefined){
					$scope.mins = undefined;
				} else {
					$scope.mins = "00";
				}
			} else if ($scope.mins.length < 2) {
				$scope.mins = "0" + $scope.mins;
			}
			blurEvent(minsFocusTimeout, $scope.minsFocused);
		};

		$scope.focusHours = function() { focusEvent(false); };
		$scope.focusMins = function() { focusEvent(true); };

		this.checkMin = function(newValue) {
			var min = getMin();
			return !min || min.diff(newValue) <= 0;
		};

		this.checkMax = function(newValue) {
			var max = getMax();
			return !max || max.diff(newValue) >= 0;
		};

		// events - mousewheel and arrowkeys
		this.setupEvents = function(elt, hoursField, minsField){
			var hoursInput = angular.element(hoursField.find('input')[0]),
				minsInput = angular.element(minsField.find('input')[0]);

			function setupArrowkeyEvents(hoursInput, minsInput) {
				function subscription(e, step){
					switch(e.which){
						case 38:// up
							e.preventDefault();
							incr(step);
							$scope.$apply();
						break;
						case 40:// down
							e.preventDefault();
							incr(-step);
							$scope.$apply();
						break;
						case 13:// enter
							e.preventDefault();
							$scope.formatInputValue();
							$scope.$apply();
						break;
					}
				}
				var step = getStep();
				hoursInput.bind('keydown', function(e) { subscription(e, 60); });
				minsInput.bind('keydown', function(e) { subscription(e, step); });
			}

			function setupMousewheelEvents(elt, hoursField, minsField) {
				function isScrollingUp(e) {
					e = e.originalEvent ? e.originalEvent : e;
					//pick correct delta variable depending on event
					var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
					return (e.detail || delta > 0);
				}
				var enableMouseWheel = false;
				var enableWheelTimeout;
				elt.bind('mouseenter', function(e) {
					enableWheelTimeout = setTimeout(function() {
						enableMouseWheel = true;
					}, MAGIC_DELAY_BEFORE_WHEEL);
				});
				elt.bind('mouseleave', function(e) {
					if (!!enableWheelTimeout) {
						clearTimeout(enableWheelTimeout);
					}
					enableMouseWheel = false;
				});
				function subscription(e, incrStep){
					if(!$scope.isDisabled && enableMouseWheel){
						$scope.$apply(incr((isScrollingUp(e)) ? incrStep : -incrStep ));
						e.preventDefault();
					}
				}
				var step = getStep();

				hoursField.bind('mousewheel wheel', function(e) { subscription(e, 60); });
				minsField.bind('mousewheel wheel', function(e) { subscription(e, step); });
			}

			setupArrowkeyEvents( hoursInput, minsInput);
			setupMousewheelEvents(elt, hoursField, minsField);
		};

	}]);

	angular.module("lui").run(["$templateCache", function($templateCache) {
		$templateCache.put("lui/directives/luidMoment.html",
			"<div class='lui hours moment input' ng-class='{disabled: isDisabled}'>" +
			"	<input type='text' ng-model='hours' ng-change='changeHours()' luid-select-on-click ng-pattern='pattern' luid-focus-on='focusHours' ng-focus='focusHours()' ng-blur='blurHours()' ng-disabled='isDisabled' maxLength='2' autocorrect='off' spellcheck='false'>" +
			"	<i ng-click='incrHours()' ng-show='showButtons && hoursFocused' class='lui mp-button top left north arrow icon' ng-class='{disabled: maxed}'></i>" +
			"	<i ng-click='decrHours()' ng-show='showButtons && hoursFocused' class='lui mp-button bottom left south arrow icon' ng-class='{disabled: mined}'></i>" +
			"</div>" +
			"<span class='separator'>:</span>" +
			"<div class='lui minutes moment input' ng-class='{disabled: isDisabled}'>" +
			"	<input type='text' ng-model='mins' ng-change='changeMins()' luid-select-on-click ng-pattern='pattern' luid-focus-on='focusMinutes' ng-focus='focusMins()' ng-blur='blurMins()' ng-disabled='isDisabled' maxLength='2' autocorrect='off' spellcheck='false'>" +
			"	<i ng-click='incrMins()'  ng-show='showButtons && minsFocused' class='lui mp-button top right north arrow icon' ng-class='{disabled: maxed}'></i>" +
			"	<i ng-click='decrMins()' ng-show='showButtons && minsFocused' class='lui mp-button bottom right south arrow icon' ng-class='{disabled: mined}'></i>" +
			"</div>" +
			"");
	}]);
})();
;(function () {
	'use strict';
	/**
	** DEPENDENCIES
	**  - none
	**/

	angular.module('lui').directive('luidPercentage', function () {
		function link(scope, element, attrs, ctrls) {

			var ngModelCtrl = ctrls[1];
			var luidPercentageCtrl = ctrls[0];
			scope.pattern = /^([0-9]+)(\.([0-9]*)?)?$/i;
			if (!attrs.format) {
				scope.format = "0.XX";
			}else if(attrs.format !== "0.XX" && attrs.format !== "1.XX" && attrs.format !== "XX"){
				ngModelCtrl.$render = function () { scope.intPct = "unsupported format"; };
				return;
			}

			scope.ngModelCtrl = ngModelCtrl;

			ngModelCtrl.$render = function () {
				if (this.$viewValue === undefined) {
					scope.intPct = undefined;
					return;
				}
				// must support the different formats here
				scope.intPct = scope.parse(parseFloat(this.$viewValue));
			};

			// call the ng-change
			ngModelCtrl.$viewChangeListeners.push(function () {
				scope.$eval(attrs.ngChange);
			});

			// bind to various events - here only keypress=enter
			luidPercentageCtrl.setupEvents(element.find('input'));
		}


		return {
			require: ['luidPercentage', '^ngModel'],
			controller: 'luidPercentageController',
			scope: {
				step: '=', // default = 5
				format: '@', // 'XX', '0.XX' or '1.XX', default 0.XX
				ngDisabled: '=',
				placeholder: '@'
			},
			restrict: 'EA',
			link: link,
			template:
				"<div class='lui input'>" +
					"<input type='text' ng-disabled='ngDisabled' placeholder='{{placeholder}}' ng-model='intPct' ng-change='updateValue()' ng-blur='formatInputValue()'>" +
					"<span class='unit'>%</span>" +
				"</div>"
		};
	})
	.controller('luidPercentageController', ['$scope', function ($scope) {

		// private - updates of some kinds
		// incr value by `step` minutes
		function incr(step) {
			update(parseFloat($scope.intPct) + step);
		}

		// sets viewValue and renders
		function update(duration) {
			updateWithoutRender(duration);
			$scope.ngModelCtrl.$render();
		}

		function updateWithoutRender(duration) {
			function format(pct) {
				switch($scope.format || "0.XX"){
					case "XX" :		return pct;
					case "0.XX" :	return pct/100;
					case "1.XX" :	return (pct/100) + 1;
					default : 		return 0;
				}
			}

			var newValue = duration === undefined ? undefined : format(duration);
			$scope.ngModelCtrl.$setViewValue(newValue);
		}

		// events - key 'enter'
		this.setupEvents = function (elt) {
			function getStep(){ return isNaN(parseInt($scope.step)) ? 5 : parseInt($scope.step);}
			function setupKeyEvents(elt) {
				var step = getStep();
				elt.bind('keydown', function (e) {
					switch(e.which){
						case 38:// up
							e.preventDefault();
							incr(step);
							$scope.$apply();
						break;
						case 40:// down
							e.preventDefault();
							incr(-step);
							$scope.$apply();
						break;
						case 13:// enter
							e.preventDefault();
							$scope.formatInputValue();
							$scope.$apply();
						break;
					}
				});
			}
			function setupMousewheelEvents(elt) {
				function isScrollingUp(e) {
					e = e.originalEvent ? e.originalEvent : e;
					//pick correct delta variable depending on event
					var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
					return (e.detail || delta > 0);
				}

				var step = getStep();
				elt.bind('mousewheel wheel', function (e) {
					if (this === document.activeElement) {
						$scope.$apply(incr((isScrollingUp(e)) ? step : -step));
						e.preventDefault();
					}
				});
			}

			setupKeyEvents(elt);
			setupMousewheelEvents(elt);
		};

		// public methods for update
		$scope.updateValue = function () {
			updateWithoutRender($scope.intPct);
		};

		$scope.parse = function (intInput) {
			switch($scope.format || "0.XX"){
				case "XX":		return intInput;
				case "0.XX":	return Math.round(10000 * intInput) / 100;
				case "1.XX":	return Math.round((intInput-1) * 10000) / 100;
				default : 		return 0;
			}
		};

		// display stuff
		$scope.formatInputValue = function () {
			$scope.ngModelCtrl.$render();
		};
	}]);
})();
;(function () {
	'use strict';
	/**
	** DEPENDENCIES
	**  - moment
	**/

	angular.module('lui').directive('luidTimespan', ['moment', function (moment) {

		function link(scope, element, attrs, ctrls) {
			var ngModelCtrl = ctrls[1];
			var luidTimespanCtrl = ctrls[0];
			scope.pattern = /^\-?([0-9]+)((h([0-9]{2})?)?(m(in)?)?)?$/i;
			if (!!attrs.unit) {
				var unit = scope.$eval(attrs.unit);
				if (unit == 'h' || unit == 'hour' || unit == 'hours') {
					scope.useHours = true;
				}
			}

			scope.ngModelCtrl = ngModelCtrl;

			ngModelCtrl.$render = function () {
				scope.strDuration = '';
				if (!this.$viewValue) {
					return;
				}
				var currentDuration = moment.duration(this.$viewValue);
				if (currentDuration < 0) {
					scope.strDuration += "-";
					currentDuration = moment.duration(-currentDuration);
				}
				var hours = Math.floor(currentDuration.asHours());
				var minutes = currentDuration.minutes();
				if (hours === 0) {
					scope.strDuration += minutes + 'm';
				} else {
					scope.strDuration += (hours < 10 ? '0' : '') + hours + 'h' + (minutes < 10 ? '0' : '') + minutes;
				}
			};

			// bind to various events - here only keypress=enter
			luidTimespanCtrl.setupEvents(element.find('input'));

			// set to given mode or to default mode
			luidTimespanCtrl.mode = attrs.mode ? attrs.mode : "timespan";
		}


		return {
			require: ['luidTimespan', '^ngModel'],
			controller: 'luidTimespanController',
			scope: {
				step: '=', // default = 5
				unit: '=', // 'hours', 'hour', 'h' or 'm', default='m'
				ngDisabled: '=',
				placeholder: '@',
				mode: "=", // 'timespan', 'moment.duration', default='timespan'
				min: '=', //min value
				max: '=', //max value
			},
			restrict: 'EA',
			link: link,
			template:
				"<div class='lui timespan input'>" +
					"<input type='text' ng-disabled='ngDisabled' placeholder='{{placeholder}}' ng-pattern='pattern' ng-model='strDuration' ng-change='updateValue()' ng-blur='formatInputValue()' autocorrect='off' spellcheck='false'>" +
				"</div>"
		};
	}])
	.controller('luidTimespanController', ['$scope', 'moment', function ($scope, moment) {
		var ctrl = this;

		function parse(strInput) {
			// parsing str to moment.duration
			function parseHoursAndMinutes(strInput) {
				var d = moment.duration();
				var splitted = strInput.split(/h/i);
				var isPositive = parseInt(splitted[0]) >= 0;
				d.add(parseInt(splitted[0]), 'hours');
				var strMin = splitted[1];
				if (!!strMin && strMin.length >= 2) {
					if (isPositive){
						d.add(parseInt(strMin.substring(0, 2)), 'minutes');
					} else {
						d.subtract(parseInt(strMin.substring(0, 2)), 'minutes');
					}
				}
				return d;
			}

			function parseMinutes(strInput) {
				var d = moment.duration();
				var splitted = strInput.split(/m/i);
				d.add(parseInt(splitted[0]), 'minutes');
				return d;
			}

			function parseHours(strInput) {
				var d = moment.duration();
				var splitted = strInput.split(/h/i);
				d.add(parseInt(splitted[0]), 'hours');
				return d;
			}

			switch(true){
				case (/h/i.test(strInput)) : 	return parseHoursAndMinutes(strInput);
				case (/m/i.test(strInput)) : 	return parseMinutes(strInput);
				case ($scope.useHours) : 		return parseHours(strInput);
				default : 						return parseMinutes(strInput);
			}
		}

		// updates of some kinds
		// incr value by `step` minutes
		function incr(step) {
			var newDur = moment.duration(currentValue()).add(step, 'minutes');
			if (newDur.asMilliseconds() < 0) {
				newDur = moment.duration();
			}
			update(newDur);
		}

		// sets viewValue and renders
		function update(newDuration) {
			updateWithoutRender(newDuration);
			$scope.ngModelCtrl.$render();
		}

		function updateWithoutRender(newDuration) {
			// Handle min/max values
			function correctValue(newValue){
				function correctedMinValue(newValue) {
					var min = !$scope.min ? undefined : moment.duration($scope.min);
					return (!min || min <= newValue) ? newValue : min;
				}

				function correctedMaxValue(newValue) {
					var max = !$scope.max ? undefined : moment.duration($scope.max);
					return (!max || max >= newValue) ?  newValue : max;
				}

				return correctedMaxValue(correctedMinValue(newValue));
			}

			function format(dur) {
				if (ctrl.mode === 'timespan') {
					var timespan = "";
					if (dur.asMilliseconds() < 0){
						timespan += "-";
						dur = moment.duration(-dur);
					}
					timespan += (dur.days() > 0 ? Math.floor(dur.asDays()) + '.' : '') + (dur.hours() < 10 ? '0' : '') + dur.hours() + ':' + (dur.minutes() < 10 ? '0' : '') + dur.minutes() + ':00';
					return timespan;
				}
				return dur;
			}

			if (newDuration === undefined) {
				return $scope.ngModelCtrl.$setViewValue(undefined);
			}

			// Check min/max values
			newDuration = correctValue(newDuration);
			var formattedValue = format(newDuration);

			$scope.ngModelCtrl.$setViewValue(formattedValue);
		}

		function currentValue() {
			return $scope.ngModelCtrl.$viewValue;
		}

		// events - key 'enter'
		this.setupEvents = function (elt) {
			function getStep(){ return isNaN(parseInt($scope.step)) ? 5 : parseInt($scope.step);}
			function setupKeyEvents(elt) {
				var step = getStep();
				elt.bind('keydown', function (e) {
					switch(e.which){
						case 38:// up
							e.preventDefault();
							incr(step);
							$scope.$apply();
						break;
						case 40:// down
							e.preventDefault();
							incr(-step);
							$scope.$apply();
						break;
						case 13:// enter
							e.preventDefault();
							$scope.formatInputValue();
							$scope.$apply();
						break;
					}
				});
			}

			function setupMousewheelEvents(elt) {
				function isScrollingUp(e) {
					e = e.originalEvent ? e.originalEvent : e;
					//pick correct delta variable depending on event
					var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
					return (e.detail || delta > 0);
				}

				var step = getStep();
				elt.bind('mousewheel wheel', function (e) {
					if (this === document.activeElement) {
						$scope.$apply(incr((isScrollingUp(e)) ? step : -step));
						e.preventDefault();
					}
				});
			}

			setupKeyEvents(elt);
			setupMousewheelEvents(elt);
		};

		// public methods for update
		$scope.updateValue = function () {

			// is only fired when pattern is valid or when it goes from valid to invalid
			// improvement possible - check the pattern and set the validity of the all directive via ngModelCtrl.$setValidity
			// currently when pattern invalid, the viewValue is set to '00:00:00'
			if (!$scope.strDuration) { return updateWithoutRender(undefined); } // empty input => 00:00:00

			// parse the strDuration to build newDuration
			// the duration of the parsed strDuration
			var newDuration = parse($scope.strDuration);

			// update viewvalue
			updateWithoutRender(newDuration);
		};

		// display stuff
		$scope.formatInputValue = function () {
			$scope.ngModelCtrl.$render();
		};
	}]);
})();
;(function(){
	'use strict';
	/**
	** DEPENDENCIES
	**  - none, nothing, nada
	**/
	function replaceAll(string, find, replace) {
		// http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
		// lets not reinvent the wheel
		if(!string){ return ''; }
		function escapeRegExp(string) {
			return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
		}
		return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}
	angular.module('lui')
	.filter('luifPlaceholder', function () {
		return function (_input, _placeholder) {
			return !!_input ? _input : _placeholder;
		};
	})
	.filter('luifDefaultCode', function () {
		// uppercased and with '_' instead of ' '
		return function (_input) {
			return replaceAll(_input, ' ', '_').toUpperCase();
		};
	})
	.filter('luifStartFrom', function () {
		//pagination filter
		return function (_input, start) {
			start = +start; //parse to int
			return _input.slice(start);
		};
	})
	.filter('luifNumber', ['$sce', '$filter', function($sce, $filter) {
		return function(_input, _precision, _placeholder) {

			function getRightSpan(decimalPart, separator) {
				if (decimalPart === undefined) { return "<span style=\"opacity:0\"></span>"; }
				if (parseInt(decimalPart) === 0) { return "<span style=\"opacity:0\">" + separator + decimalPart + "</span>"; }
				return "<span>" + separator + decimalPart + "</span>";
			}

			var placeholder = _placeholder === undefined ? '' : _placeholder;
			// alert(_input + " " + (!!_input.isNaN && _input.isNaN()));
			var input = _input === undefined || _input === null || _input === "" || _input != _input ? placeholder : _input; // the last check is to check if _input is NaN
			var separator = $filter("number")(1.1,1)[1];
			var precision = _precision === undefined || _precision === null || _precision != _precision ? 2 : _precision;

			var text = $filter("number")(input, precision);
			var decimalPart = (text || $filter("number")(0, precision)).split(separator)[1];
			var rightSpan = getRightSpan(decimalPart, separator);

			if (input === '' || !text){
				// the _input or the _placeholder was not parsable by the number $filter, just return input but trusted as html
				return $sce.trustAsHtml(input + rightSpan);
			}

			var integerPart = text.split(separator)[0];
			return $sce.trustAsHtml(integerPart + rightSpan);
		};
	}]);
})();
;(function () {
	'use strict';
	/**
	** DEPENDENCIES
	**  - moment
	**/
	var formatMoment = function (_moment, _format) { //expects a moment
		if (!_moment) {
			return "";
		}
		var m = moment(_moment);
		return m.isValid() ? m.format(_format) : _moment;
	};

	angular.module('lui')
	.filter('luifFriendlyRange', function () {
		var translations = {
			'en': {
				startOnly: 'date(dddd, LL) onwards',
				startOnlyThisYear: 'date(dddd, MMMM Do) onwards',
				endOnly: 'until date(dddd, LL)',
				endOnlyThisYear: 'until date(dddd, MMMM Do)',
				date: 'date(LL)',
				sameDay: 'start(dddd, LL)',
				sameDayThisYear: 'start(dddd, MMMM Do)',
				sameMonth: 'start(MMMM Do) - end(Do\, YYYY)',
				sameMonthThisYear: 'start(MMMM Do) - end(Do)',
				sameYear: 'start(MMMM Do) - end(LL)',
				sameYearThisYear: 'start(MMMM Do) - end(MMMM Do)',
				other: 'start(LL) - end(LL)'
			},
			'fr': {
				startOnly: 'à partir du date(dddd LL)',
				startOnlyThisYear: 'à partir du date(dddd Do MMMM)',
				endOnly: 'jusqu\'au date(dddd LL)',
				endOnlyThisYear: 'jusqu\'au date(dddd Do MMMM)',
				date: 'date(LL)',
				sameDay: 'le start(dddd LL)',
				sameDayThisYear: 'le start(dddd Do MMMM)',
				sameMonth: 'du start(Do) au end(LL)',
				sameMonthThisYear: 'du start(Do) au end(Do MMMM)',
				sameYear: 'du start(Do MMMM) au end(LL)',
				sameYearThisYear: 'du start(Do MMMM) au end(Do MMMM)',
				other: 'du start(LL) au end(LL)'
			},
			'de': {

				startOnly: 'von date(Do MMMM)',
				startOnlyThisYear: 'von date(LL)',
				endOnly: 'bis date(Do MMMM)',
				endOnlyThisYear: 'bis date(LL)',
				date: 'date(LL)',
				sameDay: 'der start(dddd LL)',
				sameDayThisYear: 'der start(dddd Do MMMM)',
				sameMonth: 'von start(Do) bis end(LL)',
				sameMonthThisYear: 'von start(Do) bis end(Do MMMM)',
				sameYear: 'von start(Do MMMM) bis end(LL)',
				sameYearThisYear: 'von start(Do MMMM) bis end(Do MMMM)',
				other: 'von start(LL) bis end(LL)'
			}
		};
		function getTrad(trads, locale, key, fallbackKey) {
			if (!!trads && !!trads[locale] && !!trads[locale][key]) {
				return trads[locale][key];
			}
			if (!!trads && !!trads[locale] && !!trads[locale][fallbackKey]) {
				return trads[locale][fallbackKey];
			}
			// fallback on english in provided translations
			var fallbackLocale = "en";
			if (!!trads && !!trads[fallbackLocale] && !!trads[fallbackLocale][key]) {
				return trads[fallbackLocale][key];
			}
			if (!!trads && !!trads[fallbackLocale] && !!trads[fallbackLocale][fallbackKey]) {
				return trads[fallbackLocale][fallbackKey];
			}

			// fallback on standard translations if I couldnt find what I need in provided trads
			var fallbackTrads = translations;
			if (!!fallbackTrads && !!fallbackTrads[locale] && !!fallbackTrads[locale][key]) {
				return fallbackTrads[locale][key];
			}
			if (!!fallbackTrads && !!fallbackTrads[locale] && !!fallbackTrads[locale][fallbackKey]) {
				return fallbackTrads[locale][fallbackKey];
			}
			// fallback on english in provided translations
			if (!!fallbackTrads && !!fallbackTrads[fallbackLocale] && !!fallbackTrads[fallbackLocale][key]) {
				return fallbackTrads[fallbackLocale][key];
			}
			if (!!fallbackTrads && !!fallbackTrads[fallbackLocale] && !!fallbackTrads[fallbackLocale][fallbackKey]) {
				return fallbackTrads[fallbackLocale][fallbackKey];
			}
		}
		return function (_block, _excludeEnd, _translations) {
			if(!_block){ return; }
			var start = _block.start || _block.startsAt || _block.startsOn || _block.startDate;
			var end = _block.end || _block.endsAt || _block.endsOn || _block.endDate;
			if (!start && !end) {
				return "";
			}
			start = !!start ? moment(start) : undefined;
			end = !!end ? moment(end) : undefined;
			if(_excludeEnd){
				end.add(-1,'minutes');
			}
			var trad;
			var format;
			var regex;
			if (!!start && !!end) {
				format = start.year() === end.year() ? start.month() === end.month() ? start.date() === end.date() ? 'sameDay' : 'sameMonth' : 'sameYear' : 'other';
				if(moment().year() === start.year() && moment().year() === end.year()){
					format += "ThisYear";
				}
				trad = getTrad(_translations, moment.locale(), format, "other");
				regex = /(start\((.*?)\))(.*(end\((.*?)\))){0,1}/gi.exec(trad);
				return trad.replace(regex[1], start.format(regex[2])).replace(regex[4], end.format(regex[5]));
			}
			format = !!start ? "startOnly" : "endOnly";
			var date = start || end;
			if(moment().year() === date.year()){
				format += "ThisYear";
			}
			trad = getTrad(_translations, moment.locale(), format, "date");
			regex = /(date\((.*?)\))/gi.exec(trad);
			return trad.replace(regex[1], date.format(regex[2]));
		};
	})
	.filter('luifMoment', function () {
		return function (_moment, _format) {
			if (!_format) { _format = 'LLL'; } // default format
			return formatMoment(_moment, _format);
		};
	})
	.filter('luifCalendar', function () {
		return function (_moment, _refDate) {
			var m = moment(_moment);
			var refDate = (_refDate && moment(_refDate).isValid()) ? moment(_refDate) : moment();

			return m.isValid() ? m.calendar(_refDate) : _moment;
		};
	})
	.filter('luifDuration', ['$filter', function ($filter) {
		//expects a duration, returns the duration in the given unit with the given precision
		return function (_duration, _sign, _unit, _precision) {
			function getConfigIndex(expectedUnit){
				switch(expectedUnit){
					case 'd':
					case 'day':
					case 'days': return 0;
					case undefined:
					case '':
					case 'h':
					case 'hour':
					case 'hours': return 1;// default
					case 'm':
					case 'min':
					case 'mins':
					case 'minute':
					case 'minutes': return 2;
					case 's':
					case 'sec':
					case 'second':
					case 'seconds': return 3;
					case 'ms':
					case 'millisec':
					case 'millisecond':
					case 'milliseconds': return 4;
				}
			}

			function getNextNotNull(array, startIndex){
				return startIndex === 4 ? 4 : array[startIndex] !== 0 ? startIndex : getNextNotNull(array, startIndex + 1);
			}

			function getPrevNotNull(array, startIndex){
				return startIndex === 0 ? 0 : array[startIndex] !== 0 ? startIndex : getPrevNotNull(array, startIndex - 1);
			}

			function getDecimalNumber(days){
				switch(true){
					case (Math.floor((days * 10) % 10) === 0 && Math.floor((days * 100) % 10) === 0):	return 0;
					case (Math.floor((days * 100) % 10) === 0):											return 1;
					default: 																			return 2;
				}
			}

			function formatValue (value, u, expectedUnit){
				switch(u){
					case expectedUnit :	return value;
					case 2 :
					case 3 : 			return (value < 10 ? '0' + value : value);
					case 4 : 			return (value < 10 ? '00' + value : value < 100 ? '0' + value : value);
					default : 			return value;
				}
			}

			function getPrefix(sign, duration){
				if (sign) {
					if (duration.asMilliseconds() > 0) { return '+'; }
					else if (duration.asMilliseconds() < 0) { return '-'; }
				}
				return '';
			}

			// some localisation shenanigans
			function getUnitSymbols(unit, precision){
				var result = ['d ', 'h', 'm', 's', 'ms'];
				switch(moment.locale()){
					case "fr": result[0] = 'j '; break;
				}

				// if precision = ms and unit bigger than s we want to display 12.525s and not 12s525ms
				if(unit <= 3 && precision === 4) { result[3] = '.'; result[4] = 's'; }
				if(unit <= 1 && precision === 2) { result[2] = ''; }
				if(unit === 2 && precision === 3) { result[3] = ''; }

				return result;
			}

			var unitConfigs = [
				{
					index: 0,
					unit: 'd',
					dateConversion : 'asDays',
					expectedPrecision : 'h'
				},
				{
					index: 1,
					unit: 'h',
					dateConversion : 'asHours',
					expectedPrecision :'m'
				},
				{
					index: 2,
					unit: 'm',
					dateConversion : 'asMinutes',
					expectedPrecision : 's'
				},
				{
					index: 3,
					unit: 's',
					dateConversion : 'asSeconds',
					expectedPrecision : 's'
				},
				{
					index: 4,
					unit: 'ms',
					dateConversion : 'asMilliseconds',
					expectedPrecision : 'ms'
				},
			];

			var d = moment.duration(_duration);

			if (d.asMilliseconds() === 0) { return ''; }

			var values = [Math.abs(d.days()), Math.abs(d.hours()), Math.abs(d.minutes()), Math.abs(d.seconds()), Math.abs(d.milliseconds())];
			var config = unitConfigs[getConfigIndex(_unit)];
			var minimumUnit = Math.max(config.index, getNextNotNull(values, 0));
			values[config.index] = Math.abs(d[config.dateConversion]() >= 0 ? Math.floor(d[config.dateConversion]()) : Math.ceil(d[config.dateConversion]()));

			if (config.index === 0 && getConfigIndex(_precision) === 0 && d.asDays() !== 0){
				var myDays = Math.abs(d.asDays());
				var decimalNumber = getDecimalNumber(myDays);
				minimumUnit = 0;
				values[0] = $filter("number")(myDays, decimalNumber);
			}

			var precision = getPrevNotNull(values, getConfigIndex(_precision || config.expectedPrecision));
			var units = getUnitSymbols(minimumUnit, precision);

			var result = '';
			for(var i = minimumUnit; i <= precision; i++){
				result += formatValue(values[i], i, minimumUnit) + units[i];
			}

			var prefix = !!result ? getPrefix(_sign, d) : '';
			return prefix + result;
		};
	}])
	.filter('luifHumanize', function () {
		return function (_duration, suffix) {
			suffix = !!suffix;
			var d = moment.duration(_duration);
			return d.humanize(suffix);
		};
	});
})();
