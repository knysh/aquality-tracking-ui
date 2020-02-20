import { Component, OnInit } from '@angular/core';
import { Project, PredefinedResolution } from '../../../../shared/models/project';
import { ProjectService } from '../../../../services/project.service';
import { ResultResolutionService } from '../../../../services/result-resolution.service';
import { ResultResolution } from '../../../../shared/models/result_resolution';
import { UserService } from '../../../../services/user.services';
import { LocalPermissions } from '../../../../shared/models/LocalPermissions';
import { User } from '../../../../shared/models/user';
import { TFColumn, TFColumnType } from '../../../../elements/table/tfColumn';

@Component({
  templateUrl: './predefinedResolution.component.html',
  styleUrls: ['./predefinedResolution.component.css']
})
export class PredefinedResolutionComponent implements OnInit {
  hideModal = true;
  removeModalTitle: string;
  removeModalMessage: string;
  projects: Project[];
  selectedProject: Project;
  predefinedResolutions: PredefinedResolution[];
  resolutions: ResultResolution[];
  columns: TFColumn[];
  predefinedResolutionToRemove: PredefinedResolution;
  users: User[];

  constructor(
    private projectService: ProjectService,
    private resolutionService: ResultResolutionService,
    public userService: UserService
  ) { }

  async ngOnInit() {
    this.projects = await this.projectService.getProjects(this.selectedProject).toPromise();
    this.selectedProject = this.projects[0];
    await this.updateInitData();
  }

  async onProjectChange(project: Project) {
    this.selectedProject = project;
    await this.updateInitData();
  }

  async updateInitData() {
    this.predefinedResolutions = await this.getPredefinedResolutions(this.selectedProject);
    this.resolutions = await this.resolutionService.getResolution(this.selectedProject.id).toPromise();
    const projectUsers: LocalPermissions[] = await this.userService.getProjectUsers(this.selectedProject.id).toPromise();
    this.users = projectUsers.map(projectUser => projectUser.user);
    this.columns
      ? this.updateColumns()
      : this.createColumns();
  }

  updateColumns() {
    this.columns.find(column => column.name === 'Resolution').lookup.values = this.resolutions;
    this.columns.find(column => column.name === 'Assignee').lookup.values = this.users;
  }

  createColumns() {
    this.columns = [
      {
        name: 'Resolution',
        property: 'resolution.name',
        filter: true,
        sorting: true,
        type: TFColumnType.colored,
        lookup: {
          entity: 'resolution',
          values: this.resolutions,
          propToShow: ['name']
        },
        editable: true,
        creation: {
          required: true
        }
      },
      {
        name: 'Comment',
        property: 'comment',
        filter: true,
        sorting: true,
        type: TFColumnType.text,
        editable: true,
        creation: {
          required: true
        }
      },
      {
        name: 'Expression',
        property: 'expression',
        filter: true,
        sorting: true,
        type: TFColumnType.text,
        editable: true,
        creation: {
          required: true
        }
      },
      {
        name: 'Assignee',
        property: 'assigned_user.user_name',
        filter: true,
        sorting: true,
        type: TFColumnType.autocomplete,
        lookup: {
          entity: 'assigned_user',
          propToShow: ['user_name'],
          values: this.users
        },
        editable: true,
        creation: {
          required: false
        }
      },
    ];
  }

  getPredefinedResolutions(project: Project) {
    return this.projectService.getPredefinedResolution({ project_id: project.id });
  }

  handleAction(action: { action: string, entity: PredefinedResolution }) {
    switch (action.action) {
      case 'create':
        return this.createPredefinedResolutions(action.entity);
      case 'remove':
        return this.removePredefinedResolutions(action.entity);
    }
  }

  async createPredefinedResolutions(entity: PredefinedResolution) {
    entity.project_id = this.selectedProject.id;
    await this.projectService.createPredefinedResolution(entity);
    this.predefinedResolutions = await this.getPredefinedResolutions(this.selectedProject);
    this.projectService.handleSuccess(`Predefined Resolution was created!`);
  }

  async removePredefinedResolutions(entity: PredefinedResolution) {
    this.predefinedResolutionToRemove = entity;
    this.removeModalTitle = `Remove Resolution: ${entity.expression}`;
    this.removeModalMessage =
      `Are you sure that you want to delete the '${entity.expression}' predefined resolution? This action cannot be undone.`;
    this.hideModal = false;
  }

  async updateRow(entity: PredefinedResolution) {
    await this.projectService.createPredefinedResolution(entity);
    this.projectService.handleSuccess(`Predefined Resolution was updated!`);
  }

  async execute(event: Promise<boolean>) {
    if (await event) {
      await this.projectService.removePredefinedResolution(this.predefinedResolutionToRemove);
      this.predefinedResolutions = await this.getPredefinedResolutions(this.selectedProject);
      this.projectService.handleSuccess('Predefined Resolution was removed!');
    }
    this.hideModal = true;
  }

  wasClosed() {
    this.hideModal = true;
  }
}