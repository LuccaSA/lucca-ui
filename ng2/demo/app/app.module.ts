import { ApplicationRef, NgModule } from '@angular/core';
import { createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { DatePickerDemoComponent } from './../components/date-picker-demo/date-picker-demo.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LuiDatePickerModule } from '../../src/components/date-picker';
import { LuiProgressBarModule } from '../../src/components/progress-bar';
import { UserPickerDemoComponent } from './../components/user-picker-demo/user-picker-demo.component';

// Lucca UI modules

// import { LuiUserPickerModule } from '../../src/components/user-picker/user-picker.module';


// Demo app

@NgModule({
imports: [
	BrowserModule,
	HttpModule,
	FormsModule,
	LuiProgressBarModule,
	// LuiUserPickerModule,
	LuiDatePickerModule
],
declarations: [
	AppComponent,
	UserPickerDemoComponent,
	DatePickerDemoComponent
],
providers: [
],
bootstrap: [AppComponent]
})
export class AppModule {
constructor(public appRef: ApplicationRef) {}
hmrOnInit(store) {
	console.log('HMR store', store);
}
hmrOnDestroy(store) {
	let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
	// recreate elements
	store.disposeOldHosts = createNewHosts(cmpLocation);
	// remove styles
	removeNgStyles();
}
hmrAfterDestroy(store) {
	// display new elements
	store.disposeOldHosts();
	delete store.disposeOldHosts;
}
}
