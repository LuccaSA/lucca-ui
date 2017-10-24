declare module lui {
}
declare module lui.cloak {
}
declare module lui {
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
    interface IConfigProvider {
        setConfig(config: IConfig): void;
    }
}
declare module lui.config {
}
declare module lui.datepicker {
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
        minMode: string;
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
        customClass?: (modelValue: any, viewValue: any) => boolean;
    }
}
declare module lui.datepicker {
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
        protected minMode: CalendarMode;
        constructor($scope: ICalendarScope, $log: ng.ILogService);
        setCalendarCnt(cntStr?: string, inAPopover?: boolean): void;
        protected constructCalendars(): Calendar[];
        protected constructDayLabels(): string[];
        protected assignClasses(): void;
        protected abstract selectDate(date: moment.Moment): void;
        private setMinMode(mode);
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
declare module lui.datepicker {
}
declare module lui.datepicker {
}
declare module lui.departmentpicker {
    interface IDepartmentPickerFilters extends ng.IFilterService {
        (name: "departmentFilter"): (departments: IDepartment[], clue: string) => IDepartment[];
    }
    function DepartmentFilter(): ((departments: IDepartment[], clue: string) => IDepartment[]);
}
declare module lui.departmentpicker {
    interface IDepartment {
        id: number;
        name: string;
        ancestorsLabel?: string;
        level?: number;
        hasChild?: boolean;
    }
    interface ITree<T> {
        node: IDepartment;
        children: ITree<T>[];
    }
    type IDepartmentTree = ITree<IDepartment>;
}
declare module lui.departmentpicker {
    const MAGIC_PAGING: number;
    class LuidDepartmentPickerController {
        static IID: string;
        static $inject: Array<string>;
        private $scope;
        private $filter;
        private departmentPickerService;
        private ngModelCtrl;
        private departments;
        constructor($scope: ILuidDepartmentPickerScope, $filter: IDepartmentPickerFilters, departmentPickerService: IDepartmentPickerService);
        setNgModelCtrl(ngModelCtrl: ng.INgModelController): void;
        private initScope();
        private initDepartments();
        private filterDepartments(clue?);
        private setViewValue(department);
    }
}
declare module lui.departmentpicker {
}
declare module lui.departmentpicker {
    interface ILuidDepartmentPickerScope extends ng.IScope {
        internal: {
            selectedDepartment: IDepartment;
        };
        departmentsToDisplay: IDepartment[];
        onDropdownToggle(isOpen: boolean): void;
        selectDepartment(): void;
        getLevel(department: IDepartment): Array<{}>;
        loadMore(clue: string): void;
        search(clue: string): void;
    }
}
declare module lui.departmentpicker {
    interface IDepartmentPickerService {
        getDepartments(): ng.IPromise<IDepartment[]>;
    }
}
declare module lui {
    interface IFilterService extends ng.IFilterService {
        (name: "luifDuration"): (input: any, showSign?: boolean, unit?: string, precision?: string) => string;
        (name: "luifPlaceholder"): (input: any, placeholder: string) => string;
        (name: "luifFriendlyRange"): (input: IPeriod, excludeEnd?: boolean, trads?: Object) => string;
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
        constructor(unformatted: IPeriod, formatter?: IFormatter<moment.Moment>);
    }
}
declare module Lui.Filters {
}
declare module Lui {
}
declare module lui {
    interface IField {
        key: string;
        type: string;
        className?: string;
        templateOptions?: ITemplateOptions;
    }
    interface ITemplateOptions {
        label?: string;
        helper?: string;
        required?: boolean;
        disabled?: boolean;
        display?: string;
        placeholder?: number | string;
        style?: string;
        requiredError?: string;
        emailError?: string;
        ibanError?: string;
        rows?: number;
        choices?: {
            label: string | number;
        }[];
        api?: string;
        filter?: string;
        allowClear?: boolean;
    }
}
declare module lui.apiselect {
}
declare module lui.apiselect {
    interface IStandardApiResource {
        id: string | number;
        name: string;
    }
    class StandardApiService {
        static IID: string;
        static $inject: Array<string>;
        private $http;
        constructor($http: angular.IHttpService);
        get(clue: string, api: string, additionalFilter?: string, paging?: string, order?: string): ng.IPromise<IStandardApiResource[]>;
    }
}
declare module lui.iban {
    interface IbanChecker {
        isValid(value: string): boolean;
    }
    class LuidIbanController {
        static IID: string;
        static $inject: Array<string>;
        private $scope;
        private ngModelCtrl;
        private countryInput;
        private controlInput;
        private bbanInput;
        private ibanChecker;
        constructor($scope: ILuidIbanScope, iban: IbanChecker);
        setNgModelCtrl(ngModelCtrl: ng.INgModelController): void;
        setInputs(elt: ng.IAugmentedJQuery): void;
        private initScope();
        private getViewValue();
        private setViewValue(iban);
        private setTouched();
        private focusCountryInput();
        private focusControlInput();
    }
}
declare module lui.iban {
    class LuidIban implements ng.IDirective {
        static IID: string;
        restrict: string;
        templateUrl: string;
        require: string[];
        controller: string;
        scope: {};
        static factory(): angular.IDirectiveFactory;
        link(scope: ILuidIbanScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes & {
            isRequired: boolean;
        }, ctrls: [LuidIbanController, ng.INgModelController]): void;
    }
}
declare module lui.iban {
    interface ILuidIbanScope extends ng.IScope {
        countryCode: string;
        controlKey: string;
        bban: string;
        bbanMappings: {
            [key: number]: ($event: ng.IAngularEvent) => void;
        };
        controlKeyMappings: {
            [key: number]: ($event: ng.IAngularEvent) => void;
        };
        updateValue(): void;
        pasteIban(event: ClipboardEvent | JQueryEventObject): void;
        selectInput(event: JQueryEventObject): void;
        setTouched(): void;
    }
}
declare module lui.iban {
    interface ILuidIbanValidators extends ng.IModelValidators {
        iban: () => boolean;
    }
}
declare module lui.iban {
    class LuidSelectNext implements ng.IDirective {
        static IID: string;
        restrict: string;
        static factory(): angular.IDirectiveFactory;
        link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void;
    }
}
declare module lui {
    interface IFile {
        id?: string;
        name?: string;
        href: string;
    }
}
declare module lui.imagepicker {
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
declare module lui.imagepicker {
}
declare module lui.imagepicker {
}
declare module lui {
    interface INotifyService {
        error(message: string, details?: string): void;
        warning(message: string, details?: string): void;
        success(message: string, details?: string): void;
        alert(message: string, okLabel?: string, cancelLabel?: string): ng.IPromise<boolean>;
        confirm(message: string, okLabel?: string, cancelLabel?: string): ng.IPromise<boolean>;
        loading(loadingPromise: ng.IPromise<string>, message?: string, cancelFn?: () => void): void;
    }
}
declare module lui.notify {
    class NotifyService implements INotifyService {
        static IID: string;
        static $inject: Array<string>;
        private $q;
        private $log;
        private $rootScope;
        private $timeout;
        private $uibModal;
        private cgNotify;
        private luisConfig;
        constructor(notify: any, $q: angular.IQService, $log: ng.ILogService, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService, $uibModal: ng.ui.bootstrap.IModalService, luisConfig: IConfig);
        error(message: string, details?: string): void;
        warning(message: string, details?: string): void;
        success(message: string, details?: string): void;
        alert(message: string, okLabel?: string, cancelLabel?: string): ng.IPromise<boolean>;
        confirm(message: string, okLabel?: string, cancelLabel?: string): ng.IPromise<boolean>;
        loading(loadingPromise: ng.IPromise<string>, message?: string, cancelFn?: () => void): void;
        private openModal(templateUrl, message, okLabel, cancelLabel, preventDismiss);
    }
}
declare module lui.progressbar {
}
declare module lui {
    interface IProgressBarService {
        addProgressBar(palette?: string): void;
        startListening(httpRequestMethods?: string[]): void;
        stopListening(): void;
        isListening(): boolean;
        getHttpRequestMethods(): string[];
        start(): void;
        complete(): void;
    }
}
declare module lui.progressbar {
}
declare module lui.tablegrid {
    interface ITree {
        node: IHeader;
        children: ITree[];
    }
    interface IHeader {
        label: string;
        filterType?: FilterType;
        hidden?: boolean;
        width?: number;
        fixed?: boolean;
        colspan?: number;
        rowspan?: number;
        textAlign?: string;
        preserveLineBreaks?: boolean;
        getValue(object: any): string;
        getOrderByValue?(object: any): any;
        getFilterValue?(object: any): any;
    }
    interface IBrowseResult {
        depth?: number;
        subChildren?: number;
        subDepth?: number;
        tree: ITree;
    }
    enum FilterType {
        NONE = 0,
        TEXT = 1,
        SELECT = 2,
        MULTISELECT = 3,
    }
}
declare module lui.tablegrid {
    class LuidTableGridController {
        static IID: string;
        static $inject: Array<string>;
        constructor($filter: IFilterService, $scope: IDataGridScope, $translate: angular.translate.ITranslateService, $timeout: ng.ITimeoutService);
    }
}
declare module lui.tablegrid {
    interface ILuidTableGridAttributes extends ng.IAttributes {
        height: string;
        heightType: string;
        selectable: boolean;
    }
    class LuidTableGridHeightType {
        static GLOBAL: string;
        static BODY: string;
        static isTypeExisting(type: string): Boolean;
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
declare module lui.tablegrid {
}
declare module lui.tablegrid {
    interface IDataGridScope extends angular.IScope {
        FilterTypeEnum: {
            NONE: FilterType;
            TEXT: FilterType;
            SELECT: FilterType;
            MULTISELECT: FilterType;
        };
        header: ITree;
        datas: any[];
        selectable: boolean;
        defaultOrder: string;
        allChecked: any;
        bodyRows: IHeader[][];
        colDefinitions: IHeader[];
        existFixedRow: boolean;
        filters: {
            header: IHeader;
            selectValues: string[];
            currentValues: string[];
        }[];
        filteredAndOrderedRows: any[];
        headerRows: IHeader[][];
        isSelectable: boolean;
        lockedWidth: number;
        masterCheckBoxCssClass: string;
        scrollableRowDefinition: IHeader[];
        selected: {
            orderBy: IHeader;
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
        updateOrderedRows: (header: IHeader) => void;
        updateViewAfterFiltering: () => void;
        updateViewAfterOrderBy: () => void;
    }
}
declare module lui.translate {
    const AVAILABLE_LANGUAGES: string[];
    const LANGUAGES_TO_CODE: {
        en: number;
        de: number;
        es: number;
        fr: number;
        it: number;
        nl: number;
    };
    const CODES_TO_LANGUAGES: {
        1031: string;
        1033: string;
        1034: string;
        1036: string;
        1040: string;
        2067: string;
    };
    class CulturedList {
        culture: string;
        originalId: number;
        values: ICulturedValue[];
        constructor(culture: string);
    }
    interface ICulturedValue {
        value: string;
        originalLuccaCulturedLabelId?: number;
        originalLuccaTranslationId?: number;
    }
    interface ILuccaTranslation {
        id: number;
        culturedLabels: ILuccaCulturedLabel[];
    }
    interface ILuccaCulturedLabel {
        id: number;
        cultureCode: number;
        value: string;
        translationId: number;
    }
}
declare module lui.translate {
    class LuidTranslationsListController {
        static IID: string;
        static $inject: string[];
        private $scope;
        constructor($scope: ILuidTranslationsListScope, $translate: ng.translate.ITranslateService, $timeout: ng.ITimeoutService);
    }
}
declare module lui.translate {
}
declare module lui.translate {
    interface ILuidTranslationsListScope extends ng.IScope {
        cultures: string[];
        currentCulture: string;
        selectedCulture: string;
        values: _.Dictionary<CulturedList>;
        isDisabled: boolean;
        addValueOnEnter: {
            [key: number]: ($event: JQueryEventObject) => void;
        };
        uniqueId: string;
        selectCulture(culture: string): void;
        addValue(): void;
        addValueAndFocus(): void;
        deleteValue(index: number): void;
        isAddValueDisabled(): boolean;
        onPaste(event: ClipboardEvent | JQueryEventObject, index: number): void;
        getPlaceholder(culture: string, index: number): string;
        onInputValueChanged(): void;
        getUniqueId(culture: string, index: number): string;
    }
}
declare module lui.userpicker {
}
declare module lui.userpicker {
    interface IUserLookup {
        id: number;
        firstName: string;
        lastName: string;
        employeeNumber: string;
        dtContractEnd?: string;
        hasLeft?: boolean;
        info?: string;
        hasHomonyms?: boolean;
        additionalProperties?: IHomonymProperty[];
    }
    interface IHomonymProperty {
        translationKey: string;
        name: string;
        icon: string;
        value?: string;
    }
}
declare module lui.userpicker {
    const MAGIC_PAGING: number;
    const MAX_SEARCH_LIMIT: number;
    class LuidUserPickerController {
        static IID: string;
        static $inject: Array<string>;
        private $scope;
        private $q;
        private userPickerService;
        private clue;
        constructor($scope: ILuidUserPickerScope, $q: ng.IQService, userPickerService: IUserPickerService);
        private initializeScope();
        private tidyUp(users, clue?);
        private refresh(clue?);
        private getUsers(clue?);
        private tidyUpAndAssign(allUsers, clue);
        private resetUsers();
        private getFilter(clue);
    }
}
declare module lui.userpicker {
}
declare module lui.userpicker {
}
declare module lui.userpicker {
    interface ILuidUserPickerScope extends ng.IScope {
        placeholder: string;
        allowClear: boolean;
        showFormerEmployees: boolean;
        searchByEmployeeNumber: boolean;
        displayMeFirst: boolean;
        controlDisabled: boolean;
        homonymsProperties: IHomonymProperty[];
        customHttpService: ng.IHttpService;
        appId: number;
        operations: string[];
        bypassOperationsFor: number[];
        displayAllUsers: boolean;
        onSelect: () => any;
        onRemove: () => any;
        customFilter: (user: IUserLookup) => boolean;
        customInfo: (user: IUserLookup) => string;
        customInfoAsync: (user: IUserLookup) => ng.IPromise<string>;
        users: IUserLookup[];
        lastPagingOffset: number;
        myId: number;
        apiUrl: string;
        selectedUser: IUserLookup;
        loadingMore: boolean;
        selectedUsers: IUserLookup[];
        find(search: string): void;
        loadMore(): void;
        onOpen(isOpen: boolean): void;
    }
}
declare module lui.userpicker {
    interface IUserPickerService {
        getMyId(): ng.IPromise<number>;
        getMe(): ng.IPromise<IUserLookup>;
        getHomonyms(users: IUserLookup[]): IUserLookup[];
        getUsers(filters: string, paging?: number, offset?: number): ng.IPromise<IUserLookup[]>;
        getAdditionalProperties(user: IUserLookup, properties: IHomonymProperty[]): ng.IPromise<IHomonymProperty[]>;
        getUsersByIds(ids: number[]): ng.IPromise<IUserLookup[]>;
        getUserById(id: number): ng.IPromise<IUserLookup>;
        reduceAdditionalProperties(users: IUserLookup[]): IUserLookup[];
        setCustomHttpService(httpService: ng.IHttpService): void;
    }
}
declare module lui {
    interface IFormatter<T> {
        parseValue(value: any): T;
        formatValue(value: T): any;
    }
}
declare module lui.formatter {
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
declare module lui.popover {
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
        open: ($event?: ng.IAngularEvent) => void;
        close: ($event?: ng.IAngularEvent) => void;
        private elt;
        private body;
        private $scope;
        private clickedOutside;
        constructor(elt: angular.IAugmentedJQuery, $scope: IClickoutsideTriggerScope, clickedOutside?: () => void);
        toggle($event?: ng.IAngularEvent): void;
    }
}
declare module lui.scroll {
}
declare module lui {
    interface IUploaderService {
        postFromUrl(url: string): ng.IPromise<IFile>;
        postDataURI(dataURI: string): ng.IPromise<IFile>;
        postBlob(blob: Blob): ng.IPromise<IFile>;
    }
}
declare module lui.upload {
}
