/// <reference path="../references.spec.ts" />

module Lui.Directives.TableGrid.Test {
	"use strict";

	describe("luidTableGrid", (): void => {

		let nameHeader;
		let nameFilter;

		let getFirstRow = () => {
			return element.all(by.repeater("row in datas").row(1)).get(0);
		};

		beforeEach((): void => {
			nameHeader = element.all(by.cssContainingText(".sortable", "name")).get(1);
			nameFilter = element.all(by.css(".lui.fitting.search.input input")).get(6);
		});

		it("should show datas", (): void => {
			let id = $(".lui.tablegrid .locked.columns").all(by.tagName("td")).get(1).getText();
			let name = $(".lui.tablegrid .scrollable.columns").all(by.tagName("td")).get(2).getText();
			expect(id).toEqual("0");
			expect(name).toEqual("john cena");
		});

		it("should reorder table when header clicked", (): void => {
			let oldFirstElement = getFirstRow();
			nameHeader.click();
			let newFirstElement = getFirstRow();
			expect(oldFirstElement).not.toEqual(newFirstElement);
		});

		it("should filter table when input filled", (): void => {
			let oldFirstName = $(".lui.tablegrid .scrollable.columns").all(by.tagName("td")).get(2).getText();
			nameFilter.sendKeys("obi");
			let newFirstName = $(".lui.tablegrid .scrollable.columns").all(by.tagName("td")).get(2).getText();
			expect(oldFirstName).not.toEqual(newFirstName);
			expect(newFirstName).toEqual("Obi Wan Kenobi");
		});

		it("should have a nested header", (): void => {
			// we have a 3 stage header, we should have 4 rows in the header (3 +1 for the filters)
			let lockedHeaderRows = element.all(by.css(".lui.tablegrid .locked.columns thead tr"));
			let headerRows = element.all(by.css(".lui.tablegrid .columns:not(.locked) thead tr"));
			expect(lockedHeaderRows.count()).toBe(4);
			expect(headerRows.count()).toBe(4);

			//id should be nested once
			let id = lockedHeaderRows.get(0).all(by.css(".sortable")).get(0);
			expect(id.getText()).toEqual("id");
			expect(id.getAttribute("rowspan")).toEqual("3");

			//name should be nested twice
			let name = headerRows.get(1).all(by.css(".sortable")).get(0);
			expect(name.getText()).toEqual("name");
			expect(name.getAttribute("rowspan")).toEqual("2");

			// commented because this test fails depending on the size of the spawned browser
			//mail should be nested thrice
			// let phone = headerRows.get(2).all(by.css(".sortable")).get(0);
			// expect(phone.getText()).toEqual("phone");
			// expect(phone.getAttribute("rowspan")).toEqual("1");
		});

		it("shouldn't have a tr for each people (virtualized)", (): void => {
			let trs = element.all(by.css(".lui.tablegrid .locked.columns tr")).count();
			let people = $("#myTableGridPeopleLength").getText();
			expect(trs).not.toEqual(people);
		});

		it("should have a master checkbox", (): void => {
			let masterCheckBoxCount = element.all(by.css(".lui.tablegrid .locked.columns thead .lui.checkbox")).count();
			expect(masterCheckBoxCount).toEqual(1);
		});

		it("should have as many checkboxes as rows", (): void => {
			let checkBoxesCount = element.all(by.css(".lui.tablegrid .locked.columns tbody .lui.checkbox")).count();
			let trs = element.all(by.css(".lui.tablegrid .locked.columns tbody tr")).count();
			expect(checkBoxesCount).toEqual(trs);
		});

		it("master checkbox should have partial css class when one chekbox is checked", (): void => {
			let unCheckedCount = element.all(by.css(".lui.tablegrid .locked.columns tbody .lui.checkbox :not(checked)")).count();
			let firstUnChecked = element.all(by.css(".lui.tablegrid .locked.columns tbody .lui.checkbox :not(checked)")).first();
			let unCheckedAfterClickCount;
			firstUnChecked.click().then(() => {
				unCheckedAfterClickCount = element.all(by.css(".lui.tablegrid .locked.columns tbody .lui.checkbox :not(checked)")).count();
			});
			let masterCheckBoxCount = element.all(by.css(".lui.tablegrid .locked.columns thead .lui.checkbox .partial")).count();
			expect(unCheckedCount).not.toEqual(unCheckedAfterClickCount);
			expect(unCheckedAfterClickCount).not.toBe(0);
			expect(masterCheckBoxCount).toEqual(1);
		});

		it("should checked all checkboxes when master checkbox is checked", (): void => {
			let masterCheckboxElement = element.all(by.css(".lui.tablegrid .locked.columns thead .lui.checkbox")).first();
			let unCheckedAfterClickCount;
			masterCheckboxElement.click()
				.then(() => {
					unCheckedAfterClickCount = element.all(by.css(".lui.tablegrid .locked.columns tbody .lui.checkbox checkbox :not(checked)")).count();
					expect(unCheckedAfterClickCount).toBe(0);
				});
		});
	});
}
