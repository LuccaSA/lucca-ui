declare module Lui {
    interface ILuiFilters extends ng.IFilterService {
        (name: "luifDuration"): (input: any, showSign?: boolean, unit?: string, precision?: string) => string;
        (name: "luifPlaceholder"): (input: any, placeholder: string) => string;
        (name: "luifFriendlyRange"): (input: Period, excludeEnd: boolean) => string;
        (name: "luifDefaultCode"): (input: string) => string;
    }
    class Period {
        start: moment.Moment & string & Date;
        startsOn: moment.Moment & string & Date;
        startsAt: moment.Moment & string & Date;
        end: moment.Moment & string & Date;
        endsOn: moment.Moment & string & Date;
        endsAt: moment.Moment & string & Date;
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
        private cgNotify;
        constructor(notify: any, $q: angular.IQService, $log: ng.ILogService, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService);
        config(elementId: string, startTop: number): void;
        error(message: string, details: string): void;
        warning(message: string, details: string): void;
        success(message: string, details: string): void;
        loading(loadingPromise: ng.IPromise<string>, message?: string, showProgress?: boolean, cancelFn?: () => void): void;
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
        private status;
        private currentPromiseInterval;
        private completeTimeout;
        private progressBarTemplate;
        private progressbarEl;
        private isStarted;
        constructor($document: angular.IDocumentService, $window: angular.IWindowService, $timeout: ng.ITimeoutService, $interval: ng.IIntervalService, $log: ng.ILogService);
        addProgressBar: (parentTagIdClass?: string, palette?: string) => void;
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
        selectable: boolean;
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
        canvasHeight: number;
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
