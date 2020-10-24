import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { SuccessComponent } from './components/success/success.component';

const routes: Routes = [{
    path: "register", component: RegistrationComponent
  },
  {
    path: "success", component: SuccessComponent
  },
  {
    path: '', redirectTo: 'register', pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
