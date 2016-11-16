import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

// Lucca UI modules
import { LuiProgressBarModule } from '../../src/components/progress-bar';
import { LuiUserPickerModule } from '../../src/components/user-picker';

// Demo app
import { AppComponent } from './app.component';
import { UserPickerDemoComponent } from './../components/user-picker-demo/user-picker-demo.component';


@NgModule({
imports: [
	BrowserModule,
	HttpModule,
	FormsModule,
	LuiProgressBarModule,
	LuiUserPickerModule
],
declarations: [
	AppComponent,
	UserPickerDemoComponent
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
