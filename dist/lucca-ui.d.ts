declare module Lui {
    interface IConfig {
        parentTagIdClass?: string;
        parentElt?: ng.IAugmentedJQuery;
        prefix?: string;
        startTop?: number;
        okLabel?: string;
        cancelLabel?: string;
        canDismissConfirm?: boolean;
        cropLabel?: string;
        noCropLabel?: string;
    }
}
declare module Lui.Service {
    interface IConfigProvider {
        setConfig(config: IConfig): void;
    }
}
declare module Lui.Directives {
    class CalendarDate {
        date: moment.Moment;
        disabled: boolean;
        selected: boolean;
        start: boolean;
        end: boolean;
        inBetween: boolean;
        customClass: string;
        constructor(date: moment.Moment);
    }
    class Calendar {
        date: moment.Moment;
        currentYear: boolean;
        weeks: CalendarWeek[];
        months: CalendarDate[];
        years: CalendarDate[];
        constructor(date: moment.Moment);
    }
    class CalendarWeek {
        days: CalendarDay[];
    }
    class CalendarDay extends CalendarDate {
        dayNum: number;
        empty: boolean;
        constructor(date: moment.Moment);
    }
    class Shortcut {
        label: string;
        date: moment.Moment | Date | string;
    }
    enum CalendarMode {
        Days = 0,
        Months = 1,
        Years = 2,
    }
    interface ICalendarScope extends ng.IScope {
        customClass: (date: moment.Moment, mode?: CalendarMode) => string;
        displayedMonths: string;
        min: any;
        max: any;
        mode: CalendarMode;
        dayLabels: string[];
        calendars: Calendar[];
        direction: string;
        selectDay(day: CalendarDate): void;
        selectMonth(day: CalendarDate): void;
        selectYear(day: CalendarDate): void;
        selectShortcut(shortcut: Shortcut): void;
        previous(): void;
        next(): void;
        switchToMonthMode(): void;
        switchToYearMode(): void;
        onMouseEnter(day: CalendarDay, $event?: ng.IAngularEvent): void;
        onMouseLeave(day: CalendarDay, $event?: ng.IAngularEvent): void;
    }
    interface ICalendarValidators extends ng.IModelValidators {
        min: (modelValue: any, viewValue: any) => boolean;
        max: (modelValue: any, viewValue: any) => boolean;
    }
}
declare module Lui.Directives {
    abstract class CalendarController {
        protected calendarCnt: number;
        protected currentDate: moment.Moment;
        protected $scope: ICalendarScope;
        protected $log: ng.ILogService;
        protected selected: moment.Moment;
        protected start: moment.Moment;
        protected end: moment.Moment;
        protected min: moment.Moment;
        protected max: moment.Moment;
        constructor($scope: ICalendarScope, $log: ng.ILogService);
        setCalendarCnt(cntStr?: string, inAPopover?: boolean): void;
        protected constructCalendars(): Calendar[];
        protected constructDayLabels(): string[];
        protected assignClasses(): void;
        protected abstract selectDate(date: moment.Moment): void;
        private assignDayClasses();
        private assignMonthClasses();
        private assignYearClasses();
        private initCalendarScopeMethods($scope);
        private constructCalendar(start, offset);
        private constructDates(start, unitOfTime);
        private constructWeeks(monthStart);
        private constructWeek(weekStart, monthStart);
        private extractDays();
        private extractMonths();
        private extractYears();
        private changeCurrentDate(offset);
    }
}
declare module Lui.Directives {
}
declare module Lui.Directives {
}
declare module Lui {
    interface ILuiFilters extends ng.IFilterService {
        (name: "luifDuration"): (input: any, showSign?: boolean, unit?: string, precision?: string) => string;
        (name: "luifPlaceholder"): (input: any, placeholder: string) => string;
        (name: "luifFriendlyRange"): (input: IPeriod, excludeEnd?: boolean) => string;
        (name: "luifDefaultCode"): (input: string) => string;
        (name: "luifStripAccents"): (input: string) => string;
    }
    interface IPeriod {
        start?: moment.Moment | string | Date;
        startsOn?: moment.Moment | string | Date;
        startsAt?: moment.Moment | string | Date;
        end?: moment.Moment | string | Date;
        endsOn?: moment.Moment | string | Date;
        endsAt?: moment.Moment | string | Date;
    }
    class Period implements IPeriod {
        start: moment.Moment;
        end: moment.Moment;
        constructor(unformatted: IPeriod, formatter?: Lui.Utils.IFormatter<moment.Moment>);
    }
}
declare module Lui.Filters {
}
declare module Lui {
}
declare module Lui {
    interface IField extends AngularFormly.IFieldConfigurationObject {
        key: string;
        type: string;
        templateOptions?: ITemplateOptions;
    }
    interface ITemplateOptions extends AngularFormly.ITemplateOptions {
        label?: string;
        helper?: string;
        required?: boolean;
        disabled?: boolean;
        display?: string;
        placeholder?: string;
        requiredError?: string;
        emailError?: string;
        choices?: {
            label: string | number;
        };
        api?: string;
        filter?: string;
    }
}
declare module dir.directives {
}
declare module Lui {
    interface IFile {
        id?: string;
        name?: string;
        href: string;
    }
}
declare module Lui.Directives {
    class LuidImageCropper implements angular.IDirective {
        static IID: string;
        controller: string;
        restrict: string;
        scope: {
            onCropped: string;
            onCancelled: string;
            croppingRatio: string;
            croppingDisabled: string;
        };
        static Factory(): angular.IDirectiveFactory;
        constructor();
        link: ng.IDirectiveLinkFn;
    }
}
declare module Lui.Directives {
}
declare module Lui.Directive {
}
declare module Lui.Service {
    interface IUploaderService {
        postFromUrl(url: string): ng.IPromise<Lui.IFile>;
        postDataURI(dataURI: string): ng.IPromise<Lui.IFile>;
        postBlob(blob: Blob): ng.IPromise<Lui.IFile>;
    }
}
declare module Lui.Service {
    class NotifyService {
        static IID: string;
        static $inject: Array<string>;
        private $q;
        private $log;
        private $rootScope;
        private $timeout;
        private $uibModal;
        private cgNotify;
        private luisConfig;
        constructor(notify: any, $q: angular.IQService, $log: ng.ILogService, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService, $uibModal: ng.ui.bootstrap.IModalService, luisConfig: Lui.IConfig);
        error(message: string, details?: string): void;
        warning(message: string, details?: string): void;
        success(message: string, details?: string): void;
        alert(message: string, okLabel?: string, cancelLabel?: string): ng.IPromise<boolean>;
        confirm(message: string, okLabel?: string, cancelLabel?: string): ng.IPromise<boolean>;
        loading(loadingPromise: ng.IPromise<string>, message?: string, cancelFn?: () => void): void;
        private openModal(templateUrl, message, okLabel, cancelLabel, preventDismiss);
    }
}
declare module Lui.Service {
    class LuiHttpInterceptor implements angular.IHttpInterceptor {
        static IID: string;
        static $inject: Array<string>;
        totalRequests: number;
        completedRequests: number;
        private completeTimeout;
        private $q;
        private $cacheFactory;
        private $timeout;
        private progressBarService;
        constructor($q: angular.IQService, $cacheFactory: ng.ICacheFactoryService, $timeout: ng.ITimeoutService, progressBarService: Lui.Service.ProgressBarService);
        request: (config: ng.IRequestConfig) => ng.IRequestConfig;
        requestError: (rejection: string) => ng.IPromise<any>;
        response: (response: ng.IHttpPromiseCallbackArg<any>) => ng.IHttpPromiseCallbackArg<any>;
        responseError: (rejection: string) => ng.IPromise<any>;
        private isCached;
        private extractMethod;
        private startRequest;
        private setComplete;
        private endRequest;
    }
}
declare module Lui.Service {
    class ProgressBarService {
        static IID: string;
        static $inject: string[];
        latencyThreshold: number;
        private httpResquestListening;
        private httpRequestMethods;
        private $document;
        private $window;
        private $timeout;
        private $interval;
        private $log;
        private luisConfig;
        private status;
        private currentPromiseInterval;
        private completeTimeout;
        private progressBarTemplate;
        private progressbarEl;
        private isStarted;
        constructor($document: angular.IDocumentService, $window: angular.IWindowService, $timeout: ng.ITimeoutService, $interval: ng.IIntervalService, $log: ng.ILogService, luisConfig: Lui.IConfig);
        addProgressBar: (palette?: string) => void;
        startListening: (httpRequestMethods?: string[]) => void;
        stopListening: () => void;
        isHttpResquestListening: () => boolean;
        getHttpRequestMethods: () => string[];
        start: () => void;
        hide: () => void;
        show: () => void;
        setStatus: (status: number) => void;
        complete: () => void;
        getDomElement: () => ng.IAugmentedJQuery;
    }
}
declare module Lui.Directives.TableGrid {
    class Tree {
        node: Header;
        children: Tree[];
    }
    class Header {
        label: string;
        filterType: string;
        hidden: boolean;
        width: number;
        fixed: boolean;
        colspan: number;
        rowspan: number;
        textAlign: string;
        getValue: (object: any) => string;
        getOrderByValue: (object: any) => any;
        getFilterValue: (object: any) => any;
    }
    class BrowseResult {
        depth: number;
        subChildren: number;
        subDepth: number;
        tree: Tree;
    }
}
declare module Lui.Directives {
    class FilterTypeEnum {
        static NONE: string;
        static TEXT: string;
        static SELECT: string;
        static MULTISELECT: string;
    }
    class LuidTableGridController {
        static IID: string;
        static $inject: Array<string>;
        constructor($filter: Lui.ILuiFilters, $scope: IDataGridScope, $translate: angular.translate.ITranslateService, $timeout: ng.ITimeoutService);
    }
}
declare module Lui.Directives {
    interface ILuidTableGridAttributes extends ng.IAttributes {
        height: string;
        heightType: string;
        selectable: boolean;
    }
    class LuidTableGridHeightType {
        static GLOBAL: string;
        static BODY: string;
        static isTypeExisting(type: string): boolean;
    }
    class LuidTableGrid implements angular.IDirective {
        static defaultHeight: number;
        static IID: string;
        controller: string;
        restrict: string;
        scope: {
            header: string;
            height: string;
            datas: string;
            selectable: string;
            defaultOrder: string;
            onRowClick: string;
            heightType: string;
        };
        templateUrl: string;
        private $timeout;
        static Factory(): angular.IDirectiveFactory;
        constructor($timeout: ng.ITimeoutService);
        link: ng.IDirectiveLinkFn;
    }
}
declare module Lui.Directives {
    interface IDataGridScope extends angular.IScope {
        FilterTypeEnum: FilterTypeEnum;
        header: TableGrid.Tree;
        datas: any[];
        selectable: boolean;
        defaultOrder: string;
        allChecked: any;
        bodyRows: TableGrid.Header[][];
        colDefinitions: TableGrid.Header[];
        existFixedRow: boolean;
        filters: {
            header: TableGrid.Header;
            selectValues: string[];
            currentValues: string[];
        }[];
        filteredAndOrderedRows: any[];
        headerRows: TableGrid.Header[][];
        isSelectable: boolean;
        lockedWidth: number;
        masterCheckBoxCssClass: string;
        scrollableRowDefinition: TableGrid.Header[];
        selected: {
            orderBy: TableGrid.Header;
            reverse: boolean;
        };
        visibleRows: any[];
        initFilter: () => void;
        onCheckBoxChange: () => void;
        onMasterCheckBoxChange: () => void;
        internalRowClick: (event: any, row: any) => void;
        onRowClick: (row: any) => void;
        orderBySelectedHeader: () => void;
        refresh: () => void;
        resizedHeaders: () => void;
        stripHtml: (html: string) => string;
        updateFilteredRows: () => void;
        updateOrderedRows: (header: TableGrid.Header) => void;
        updateViewAfterFiltering: () => void;
        updateViewAfterOrderBy: () => void;
    }
}
declare module Lui.Utils {
    interface IFormatter<T> {
        parseValue(value: any): T;
        formatValue(value: T): any;
    }
    class MomentFormatter implements IFormatter<moment.Moment> {
        private format;
        constructor(format?: string);
        parseValue(value: any): moment.Moment;
        formatValue(value: moment.Moment): any;
        private parseMoment(value);
        private parseDate(value);
        private parseString(value);
        private formatMoment(value);
        private formatDate(value);
        private formatString(value);
    }
}
declare module Lui.Utils {
    interface IPopoverController {
        toggle($event?: ng.IAngularEvent): void;
        open($event?: ng.IAngularEvent): void;
        close($event?: ng.IAngularEvent): void;
    }
    interface IClickoutsideTriggerScope extends ng.IScope {
        popover: {
            isOpen: boolean;
        };
    }
    class ClickoutsideTrigger implements IPopoverController {
        private elt;
        private body;
        private $scope;
        private clickedOutside;
        constructor(elt: angular.IAugmentedJQuery, $scope: IClickoutsideTriggerScope, clickedOutside?: () => void);
        toggle($event?: ng.IAngularEvent): void;
        close($event?: ng.IAngularEvent): void;
        open($event: ng.IAngularEvent): void;
        private onClickedOutside($event?);
    }
}
