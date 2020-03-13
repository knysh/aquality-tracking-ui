import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.services';
import { Router, ActivatedRoute } from '@angular/router';
import { IssueService } from '../../../../services/issue.service';
import { PermissionsService, EGlobalPermissions, ELocalPermissions } from '../../../../services/current-permissions.service';
import { Issue } from '../../../../shared/models/issue';
import { TFColumn, TFColumnType, TFSorting, TFOrder } from '../../../../elements/table/tfColumn';
import { ResultResolutionService } from '../../../../services/result-resolution.service';
import { ResultResolution } from '../../../../shared/models/result_resolution';
import { LocalPermissions } from '../../../../shared/models/LocalPermissions';
import { Label } from '../../../../shared/models/general';
import { User } from '../../../../shared/models/user';

@Component({
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {

  constructor(
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private issueService: IssueService,
    private permissions: PermissionsService,
    private resolutionService: ResultResolutionService
  ) { }

  projectId: number;
  issues: Issue[];
  canEdit = false;
  columns: TFColumn[];
  hiddenColumns: TFColumn[];
  resolutions: ResultResolution[];
  projectUsers: LocalPermissions[];
  users: User[];
  statuses: Label[];
  defSort: TFSorting = { property: 'created', order: TFOrder.asc };
  hideCreateModal = true;

  async ngOnInit() {
    this.projectId = this.route.snapshot.params.projectId;
    [this.issues, this.resolutions, this.canEdit, this.projectUsers, this.statuses] = await Promise.all([
      this.issueService.getIssues({ project_id: this.projectId }),
      this.resolutionService.getResolution(this.projectId).toPromise(),
      this.permissions.hasProjectPermissions(this.projectId,
        [EGlobalPermissions.manager], [ELocalPermissions.manager, ELocalPermissions.engineer]),
      this.userService.getProjectUsers(this.projectId).toPromise(),
      this.issueService.getIssueStatuses()
    ]);
    this.projectUsers = this.projectUsers.filter(user => user.admin === 1 || user.manager === 1 || user.engineer === 1);
    this.users = this.projectUsers.map(x => x.user);
    this.addLinks();
    this.createColumns();
  }

  async addLinks() {
    this.issues.forEach(issue => {
      issue['external_link'] = issue.external_url
        ? { text: 'Open', link: issue.external_url }
        : {};
    });
  }

  async updateIssue(issue: Issue) {
    if (issue.resolution) {
      issue.resolution_id = issue.resolution.id;
    }

    if (issue.assignee) {
      issue.assignee_id = issue.assignee.id;
    }

    if (issue.status) {
      issue.status_id = issue.status.id;
    }

    await this.issueService.createIssue(issue, true);
  }

  showCreate() {
    this.hideCreateModal = false;
  }

  async execute(result: {executed: boolean, result?: Issue}) {
    this.hideCreateModal = true;
    if (result.executed) {
      await this.updateList();
    }
  }

  wasClosed() {
    this.hideCreateModal = true;
  }

  private async updateList() {
    this.issues = await this.issueService.getIssues({ project_id: this.projectId });
    this.addLinks();
  }

  private createColumns() {
    this.columns = [
      {
        name: 'Id',
        property: 'id',
        sorting: true,
        type: TFColumnType.text,
        class: 'fit',
      }, {
        name: 'Status',
        property: 'status.name',
        filter: true,
        sorting: true,
        type: TFColumnType.colored,
        editable: this.canEdit,
        lookup: {
          entity: 'status',
          values: this.statuses,
          propToShow: ['name']
        },
        class: 'fit'
      }, {
        name: 'Resolution',
        property: 'resolution.name',
        filter: true,
        sorting: true,
        type: TFColumnType.colored,
        editable: this.canEdit,
        lookup: {
          entity: 'resolution',
          values: this.resolutions,
          propToShow: ['name']
        },
        class: 'fit'
      }, {
        name: 'Title',
        property: 'title',
        filter: true,
        sorting: true,
        type: TFColumnType.text,
        editable: this.canEdit,
        creation: {
          creationLength: 500,
          required: true
        }
      }, {
        name: 'Assignee',
        property: 'assignee',
        type: TFColumnType.autocomplete,
        filter: true,
        editable: this.canEdit,
        lookup: {
          entity: 'assignee',
          values: this.users,
          propToShow: ['first_name', 'second_name']
        },
        class: 'fit'
      }, {
        name: 'Created',
        property: 'created',
        type: TFColumnType.date,
        class: 'fit'
      }, {
        name: 'External Issue',
        property: 'external_link',
        type: TFColumnType.link,
        class: 'ft-width-250'
      },
    ];

    this.hiddenColumns = [
      {
        name: 'Description',
        property: 'description',
        type: TFColumnType.longtext,
        class: 'ft-width-250'
      }, {
        name: 'Expression',
        property: 'expression',
        type: TFColumnType.text,
        class: 'ft-width-250'
      },
    ];
  }
}
