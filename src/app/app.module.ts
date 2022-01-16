import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from './error/error.component';
import { authInterceptorProviders } from './auth/services/auth.interceptor';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MessagesComponent } from './messages/messages.component';
import { StatusComponent } from './status/status.component';
import { RxStompService } from '@stomp/ng2-stompjs';
import { NgBoringAvatarsModule } from 'ng-boring-avatars';
import { ProfileComponent } from './profile/profile.component';
import { MarkdownModule } from 'ngx-markdown';
import { EmailBasePipe } from './pipes/email-base.pipe';
import { AvatarComponent } from './avatar/avatar.component';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/effects/auth.effects';
import { StoreModule } from '@ngrx/store';
import { AppReducers } from './store/app.state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { DateRoPipe } from './pipes/date-ro.pipe';
import { SearchComponent } from './search/search.component';
import { MessagesSidenavComponent } from './messages/components/messages-sidenav/messages-sidenav.component';
import { WsEffects } from './store/effects/ws.effects';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ErrorComponent,
    ToolbarComponent,
    ProfileComponent,
    MessagesComponent,
    StatusComponent,
    EmailBasePipe,
    DateRoPipe,
    AvatarComponent,
    SearchComponent,
    MessagesSidenavComponent,
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgBoringAvatarsModule,
    MarkdownModule.forRoot(),
    StoreModule.forRoot(AppReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
    }),
    EffectsModule.forRoot([AuthEffects]),
    EffectsModule.forFeature([WsEffects]),
  ],
  providers: [authInterceptorProviders, RxStompService],
  bootstrap: [AppComponent],
})
export class AppModule {}
