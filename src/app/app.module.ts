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
import { appInitializerProviders } from './auth/services/app.initializer';
import { authInterceptorProviders } from './auth/services/auth.interceptor';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MessagesComponent } from './messages/messages.component';
import { StatusComponent } from './status/status.component';
import {
  InjectableRxStompConfig,
  RxStompService,
  rxStompServiceFactory,
} from '@stomp/ng2-stompjs';
import { myRxStompConfig } from './my-rx-stomp.config';
import { NgBoringAvatarsModule } from 'ng-boring-avatars';
import { ProfileComponent } from './profile/profile.component';
import { MarkdownModule } from 'ngx-markdown';
import { EmailBase } from './messages/services/email.pipe';

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
    EmailBase,
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
  ],
  providers: [
    authInterceptorProviders,
    appInitializerProviders,
    {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig,
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
