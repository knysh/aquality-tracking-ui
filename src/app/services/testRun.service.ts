import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SimpleRequester } from './simple-requester';
import { TestRun, TestRunLabel } from '../shared/models/testRun';
import { User } from '../shared/models/user';
import { TestRunStat } from '../shared/models/testrunStats';

@Injectable()
export class TestRunService extends SimpleRequester {

  getTestRun(testRun: TestRun, limit: number = 0): Promise<TestRun[]> {
    testRun = this.setProjectId(testRun);
    testRun['limit'] = limit;
    return this.doGet(`/testrun`, testRun, true).map(res => res.json()).toPromise();
  }

  getTestRunWithChilds(testRun: TestRun, limit: number = 0): Promise<TestRun[]> {
    testRun = this.setProjectId(testRun);
    testRun['limit'] = limit;
    testRun['withChildren'] = 1;
    return this.doGet(`/testrun`, testRun).map(res => res.json()).toPromise();
  }

  createTestRun(testRun: TestRun): Promise<TestRun> {
    testRun = this.setProjectId(testRun);
    if (testRun.testResults) {
      testRun.testResults = undefined;
    }
    return this.doPost('/testrun', testRun).map(res => res.json()).toPromise();
  }

  removeTestRun(toRemove: TestRun | TestRun[]): Promise<void> {
    if(Array.isArray(toRemove)) {
      return this.doDelete(`/testrun`, undefined, toRemove)
        .map(() => this.handleSuccess(`Test runs were deleted.`)).toPromise();
    }
    const testRun = this.setProjectId(toRemove as TestRun);
    return this.doDelete(`/testrun`, { id: testRun.id, project_id: testRun.project_id })
      .map(() => this.handleSuccess(`Test run '${testRun.build_name}/${testRun.start_time}' was deleted.`)).toPromise();
  }

  getTestsRunStats(testRun: TestRun, overlay: boolean = true): Promise<TestRunStat[]> {
    testRun = this.setProjectId(testRun);
    return this.doGet('/stats/testrun', testRun, overlay).map(res => res.json()).toPromise<TestRunStat[]>();
  }

  getTestsRunLabels(id?: number) {
    const params: TestRunLabel = {};
    if (id) {
      params.id = id;
    }
    return this.doGet(`/testrun/labels`, params).map(res => res.json());
  }

  sendReport(testRun: TestRun, users: User[]) {
    return this.doPost(`/testrun/report?test_run_id=${testRun.id}`, users).map(res => res);
  }

  calculateDuration(testRun: TestRun | TestRunStat): string {
    const start_time = new Date(testRun.start_time);
    const finish_time = new Date(testRun.finish_time);
    const duration = (finish_time.getTime() - start_time.getTime()) / 1000;
    const hours = (duration - duration % 3600) / 3600;
    const minutes = (duration - hours * 3600 - (duration - hours * 3600) % 60) / 60;
    const seconds = duration - (hours * 3600 + minutes * 60);
    return hours + 'h:' + minutes + 'm:' + seconds + 's';
  }

  getPassRate(stat: TestRunStat): string | number {
    return stat ? ((stat.passed / stat.total) * 100).toFixed(2) : 0;
  }

  private setProjectId(testRun: TestRun): TestRun {
    if (!testRun.project_id) {
      testRun.project_id = this.route.snapshot.params.projectId;
    }

    return testRun;
  }
}
