import { TestSuite } from './testSuite';

export class Milestone {
  id?: number;
  name?: string;
  project_id?: number;
  suites?: TestSuite[];
  active?: boolean | number;
  due_date?: Date;
}
