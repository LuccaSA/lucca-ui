module Lui.Service {
	"use strict";
	export interface IUploaderService {
		postFromUrl(url: string): ng.IPromise<Lui.IFile>;
		postDataURI(dataURI: string): ng.IPromise<Lui.IFile>;
		postBlob(blob: Blob): ng.IPromise<Lui.IFile>;
	}
	class UploaderService implements IUploaderService {
		public static IID: string = "uploaderService";
		public static $inject: Array<string> = ["$http", "$q", "_", "moment"];

		private mainApiUrl: string;
		private $http: angular.IHttpService;
		private $q: angular.IQService;
		private _: UnderscoreStatic;
		private moment: moment.MomentStatic;


		constructor($http: angular.IHttpService, $q: angular.IQService, _: UnderscoreStatic, moment: moment.MomentStatic) {
			this.mainApiUrl = "/api/files";
			this.$http = $http;
			this.$q = $q;
			this._ = _;
			this.moment = moment;
		}

		public postFromUrl(url: string): ng.IPromise<Lui.IFile> {
			let dfd = this.$q.defer();

			let req = new XMLHttpRequest();
			req.open("GET", url, true);
			req.responseType = "arraybuffer";
			req.onload = (event) => {
				let blob = new Blob([req.response], {type: "image/jpeg"});
				this.postBlob(blob)
				.then((response: ng.IHttpPromiseCallbackArg<ApiResponseItem<IFile>>) => {
					dfd.resolve(response);
				}, (response: ng.IHttpPromiseCallbackArg<ApiError>) => {
					dfd.reject(response.data.Message);
				});
			};
			req.send();

			return dfd.promise;
		}

		public postDataURI(dataURI: string): ng.IPromise<Lui.IFile> {
			let blob = this.dataURItoBlob(dataURI);
			return this.postBlob(blob);
		}

		public postBlob(blob: Blob): ng.IPromise<Lui.IFile> {
			let dfd = this.$q.defer();
			let url = this.mainApiUrl;
			let fd = new FormData();
			fd.append("file", blob, "file.png");
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
			.then((response: ng.IHttpPromiseCallbackArg<ApiResponseItem<IFile>>) => {
				dfd.resolve(response.data.data);
			}, (response: ng.IHttpPromiseCallbackArg<ApiError>) => {
				dfd.reject(response.data.Message);
			});
			return dfd.promise;
		}

		private dataURItoBlob(dataURI: string): Blob {
			// convert base64 to raw binary data held in a string
			// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
			let byteString = atob(dataURI.split(",")[1]);

			// separate out the mime component
			let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

			// write the bytes of the string to an ArrayBuffer
			let ab = new ArrayBuffer(byteString.length);
			let ia = new Uint8Array(ab);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			// write the ArrayBuffer to a blob, and you're done
			let bb = new Blob([ab], {type: mimeString});
			return bb;
		}
	}
	class ApiResponseItem<T> {
		public data: T;
	}
	class ApiError {
	/* tslint:disable */
		public Message: string;
	/* tslint:enable */
	}

	angular.module("lui.services").service(UploaderService.IID, UploaderService);
}
