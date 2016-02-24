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
			nameFilter = element.all(by.css(".lui.fitting.search.input input")).get(1);
		});

		it("should show datas", function(): void {
			let id = $(".lui.tablegrid .content .locked.columns").all(by.tagName("td")).get(1).getText();
			let name = $(".lui.tablegrid .content .scrollable.columns").all(by.tagName("td")).get(1).getText();
			expect(id).toEqual("0");
			expect(name).toEqual("john cena");
		});

		it("should reorder table when header clicked", function(): void {
			let oldFirstElement = getFirstRow();
			nameHeader.click();
			let newFirstElement = getFirstRow();
			expect(oldFirstElement).not.toEqual(newFirstElement);
		});

		it("should filter table when input filled", function(): void {
			let oldFirstName = $(".lui.tablegrid .content .scrollable.columns").all(by.tagName("td")).get(1).getText();
			nameFilter.sendKeys("obi");
			let newFirstName = $(".lui.tablegrid .content .scrollable.columns").all(by.tagName("td")).get(1).getText();
			expect(oldFirstName).not.toEqual(newFirstName);
			expect(newFirstName).toEqual("Obi Wan Kenobi");
		});

		it("should have a nested header", function(): void {
			// we have a 3 stage header, we should have 4 rows in the header (3 +1 for the filters)
			let lockedHeaderRows = element.all(by.css(".lui.tablegrid .header .locked.columns tr"));
			let headerRows = element.all(by.css(".lui.tablegrid .header .columns:not(.locked) tr"));
			expect(lockedHeaderRows.count()).toBe(4);
			expect(headerRows.count()).toBe(4);

			//id should be nested once
			let id = lockedHeaderRows.get(0).all(by.css(".sortable.cell")).get(0);
			expect(id.getText()).toEqual("id");
			expect(id.getAttribute("rowspan")).toEqual("3");

			//name should be nested twice
			let name = headerRows.get(1).all(by.css(".sortable.cell")).get(0);
			expect(name.getText()).toEqual("name");
			expect(name.getAttribute("rowspan")).toEqual("2");

			// commented because this test fails depending on the size of the spawned browser
			//mail should be nested thrice
			// let phone = headerRows.get(2).all(by.css(".sortable.cell")).get(0);
			// expect(phone.getText()).toEqual("phone");
			// expect(phone.getAttribute("rowspan")).toEqual("1");
		});
	});
}
