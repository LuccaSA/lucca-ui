/// <reference path="../typings/angular-translate/angular-translate.d.ts" />
/// <reference path="../typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../typings/karma-jasmine/karma-jasmine.d.ts" />
/// <reference path="../typings/moment/moment-node.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
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
    class LuiHttpInterceptor implements angular.IHttpInterceptor {
        static IID: string;
        static $inject: Array<string>;
        totalGetRequests: number;
        completedGetRequests: number;
        private startTimeout;
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
        setHttpResquestListening: (httpResquestListening: boolean) => void;
        isHttpResquestListening: () => boolean;
        start: () => void;
        hide: () => void;
        show: () => void;
        setStatus: (status: number) => void;
        complete: () => void;
        getDomElement: () => ng.IAugmentedJQuery;
    }
}
