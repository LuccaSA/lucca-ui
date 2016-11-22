import 'jasmine';
import { Component, OnInit } from '@angular/core';
import { LuiDatePickerComponent } from './date-picker.component';
import { TestBed } from '@angular/core/testing';
import { Shortcut } from './calendar.class';
import * as moment from 'moment';
import { LuiTimePipesModule } from './../../pipes/time';
import { FormControl } from '@angular/forms'

@Component({
	selector: 'fake',
	template: '<luid-date-picker [(date)]="date"></luid-date-picker>',
})
class FakeComponent implements OnInit {
	public date: any;

	ngOnInit() {
		this.date = moment('2016-11-21');
	}
};

describe('luid-date-picker', () => {
	let fixture, component: LuiDatePickerComponent;
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [LuiDatePickerComponent, FakeComponent],
			imports: [LuiTimePipesModule]
		});
	});

	describe('shortcuts', () => {
		let shortcuts: Shortcut[];
		beforeEach(() => {
			const fixture = TestBed.createComponent(LuiDatePickerComponent);
			component = fixture.componentInstance;
			component.date = new FormControl(moment('2016-11-21'));
			fixture.detectChanges();

			let shortcut = new Shortcut();
			shortcut.label = 'Some date';
			shortcut.date  = moment('2016-11-21');
			shortcuts = [shortcut]
		});

		// it('should select shortcut', () => {
		// 	component.selectShortcut(shortcuts[0]);
		// });
	});
});