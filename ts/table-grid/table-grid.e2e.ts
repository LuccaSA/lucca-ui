/// <reference path="../references.spec.ts" />

module Lui.Directives.TableGrid.Test {
	"use strict";

	describe("luidTableGrid", function(): void {

		let nameHeader;
		let nameFilter;

		let getFirstRow = () => {
			return element.all(by.repeater("row in datas").row(1)).get(0);
		};

		beforeEach(function(): void {
			nameHeader = element(by.cssContainingText(".sortable.cell", "name"));
			nameFilter = element.all(by.css(".lui.fitting.search.input")).get(1);
		});

		it("should show datas", function(): void {
			let id = $(".locked.columns").element(by.tagName("td")).getText();
			let name = $(".scrollable.columns").element(by.tagName("td")).getText();
			expect(id).toEqual(0);
			expect(name).toEqual("john cena");
		});

		it("should reorder table when header clicked", function(): void {
			let oldFirstElement = getFirstRow();
			nameHeader.click();
			let newFirstElement = getFirstRow();
			expect(oldFirstElement).not.toEqual(newFirstElement);
		});

		it("should filter table when input filled", function(): void {
			let oldFirstName = $(".scrollable.columns").element(by.tagName("td")).getText();
			nameFilter.sendKeys("obi");
			let newFirstName = $(".scrollable.columns").element(by.tagName("td")).getText();
			expect(oldFirstName).not.toEqual(newFirstName);
			expect(newFirstName).toEqual("Obi Wan Kenobi");
		});

		it("should have a nested header", function(): void {
			//id should be nested once
			let id = $(".locked.columns > table > tbody > tr:nth-child(1) > td:nth-child(2)");
			expect(id.getText()).toEqual("id");
			expect(id.getAttribute("rowspan")).toEqual(3);
			//name should be nested twice
			let name = $(".columns:not(.locked) > table > tbody > tr:nth-child(2) > td:nth-child(2)");
			expect(name.getText()).toEqual("name");
			expect(name.getAttribute("rowspan")).toEqual(2);
			//mail should be nested thrice
			let mail = $(".columns:not(.locked) > table > tbody > tr:nth-child(3) > td:nth-child(3)");
			expect(mail.getText()).toEqual("mail");
			expect(mail.getAttribute("rowspan")).toEqual(1);
		});
	});
}
