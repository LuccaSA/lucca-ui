/// <reference path="../references.e2e.ts" />

module Lui.Directives.DaterangePicker.Test {
	"use strict";

	describe("luidDaterangePicker button", (): void => {

		beforeEach((): void => {
			// do things
		});

		it("should be a div", (): void => {
			expect(element(by.css("#luid-daterange-picker luid-daterange-picker div.lui.buttons")).isPresent()).toBe(true);
		});
		it("should show a friendlyranged string", (): void => {
			let text = element.all(by.css("#luid-daterange-picker luid-daterange-picker div.lui.buttons > a")).get(1).getText();
			expect(text).toEqual("January 1st - March 31st");
		});
		it("should open popover on click", (): void => {
			let input = element.all(by.css("#luid-daterange-picker luid-daterange-picker div.lui.buttons > a")).get(1);
			input.click();
			expect(element(by.css("#luid-daterange-picker luid-daterange-picker .popover")).isPresent()).toBe(true);
		});
	});

	describe("luidDaterangePicker popover", (): void => {

		let predefinedInfos = [
			{
				label: "Aujourd'hui",
				startsOn: "2016-04-04",
				endsOn: "2016-04-05",
			},
			{
				label: "Cette semaine",
				startsOn: "2016-04-04",
				endsOn: "2016-04-11",
			},
			{
				label: "Ce mois",
				startsOn: "2016-04-01",
				endsOn: "2016-05-01",
			},
			{
				label: "Cette année",
				startsOn: "2016-01-01",
				endsOn: "2017-01-01",
			},
			{
				label: "Hier",
				startsOn: "2016-04-03",
				endsOn: "2016-04-04",
			},
			{
				label: "La semaine dernière",
				startsOn: "2016-03-28",
				endsOn: "2016-04-04",
			},
			{
				label: "Le mois dernier",
				startsOn: "2016-03-01",
				endsOn: "2016-04-01",
			},
			{
				label: "L'année dernière",
				startsOn: "2015-01-01",
				endsOn: "2016-01-01",
			},
			{
				label: "Depuis le début du mois",
				startsOn: "2016-04-01",
				endsOn: "2016-04-05",
			},
			{
				label: "Depuis le début de l'année",
				startsOn: "2016-01-01",
				endsOn: "2016-04-05",
			},
		];

		beforeEach((): void => {
			// do things
		});

		it("should have 2 uib datepickers", (): void => {
			let datepickers = element.all(by.css("#luid-daterange-picker luid-daterange-picker .popover section .uib-datepicker"));
			expect(datepickers.count()).toEqual(2);
		});
		it("shoud have a shortcut footer", (): void => {
			expect(element(by.css("#luid-daterange-picker luid-daterange-picker .popover footer")).isPresent()).toBe(true);
		});
		it("should have 10 predefined periods", (): void => {
			element.all(by.css("#luid-daterange-picker luid-daterange-picker .popover footer a"))
				.each((element, index) => {
					expect(element.getText()).toEqual(predefinedInfos[index].label);
				});
			expect(element.all(by.css("#luid-daterange-picker luid-daterange-picker .popover footer a")).count()).not.toEqual(0);
		});
		it("should close when clicking on OK button", (): void => {
			let button = element(by.css("#luid-daterange-picker luid-daterange-picker .popover section > a.lui.right.pulled.primary.button"));
			button.click();
			expect(element(by.css("#luid-daterange-picker luid-daterange-picker .popover")).isPresent()).toBe(false);
		});
		it("should close when clicking outside the popover", (): void => {
			let input = element.all(by.css("#luid-daterange-picker luid-daterange-picker div.lui.buttons > a")).get(1);
			input.click();
			element(by.tagName("body")).click();
			expect(element(by.css("#luid-daterange-picker luid-daterange-picker .popover")).isPresent()).toBe(false);
		});
		it("should not close when clicking inside the popover", (): void => {
			let input = element.all(by.css("#luid-daterange-picker luid-daterange-picker div.lui.buttons > a")).get(1);
			input.click();
			element(by.css("#luid-daterange-picker luid-daterange-picker .popover")).click();
			expect(element(by.css("#luid-daterange-picker luid-daterange-picker .popover")).isPresent()).toBe(true);
		});
	});
}
