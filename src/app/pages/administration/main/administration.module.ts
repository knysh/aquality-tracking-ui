import { NgModule } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { UserService } from '../../../services/user.services';
import { administrationRouting } from './administration.routing';
import { AdministrationComponent } from './administration.component';
import { SharedModule } from '../../../shared/shared.module';
import { AdministrationGuard } from '../../../shared/guards/administration-guard.service';
import { PermissionsService } from '../../../services/current-permissions.service';
import { GuardService } from '../../../shared/guards/guard.service';

@NgModule({
  imports: [
    administrationRouting,
    SharedModule
  ],
  declarations: [
    AdministrationComponent
  ],
  providers: [
    ProjectService,
    UserService,
    PermissionsService,
    AdministrationGuard,
    GuardService
  ],
})

export class AdministrationModule { }
