import { logIn } from '../../pages/login.po';
import { projectView } from '../../pages/project/view.po';
import { suiteList } from '../../pages/suite/list.po';
import { TestSuite } from '../../../src/app/shared/models/testSuite';
import { ProjectHelper } from '../../helpers/project.helper';
import users from '../../data/users.json';
import suites from '../../data/suites.json';
import { browser } from 'protractor';
import { suiteView } from '../../pages/suite/view.po';

describe('Full Admin Test Suite List', () => {
  const projectHelper: ProjectHelper = new ProjectHelper();
  const suite: TestSuite = suites.suiteCreation;

  beforeAll(async () => {
    await projectHelper.init({
      manager: users.manager
    });
    await logIn.logInAs(users.manager.user_name, users.manager.password);
    await projectHelper.openProject();
  });

  afterAll(async () => {
    await projectHelper.dispose();
  });

  it('The error message exists for not filled creation row', async () => {
    await (await projectView.menuBar.tests()).suites();
    await suiteList.openCreationRow();
    return expect(suiteList.getCreationError()).toEqual('Fill all required fields');
  });

  it('No error messages when suite name is filled', async () => {
    await suiteList.setCreationName(suite.name);
    return expect(suiteList.getCreationError()).toEqual('');
  });

  it('Green notification appears and suite is created', async () => {
    await suiteList.acceptCreation();
    await suiteList.notification.assertIsSuccess(`Suite '${suite.name}' was created!`);
    return expect(suiteList.isTestSuitePresent(suite.name)).toEqual(true);
  });

  it('Green notification appears and suite is updated', async () => {
    const newName = `${suite.name} New`;
    await suiteList.updateSuiteName(newName, suite.name);
    suite.name = newName;
    await suiteList.notification.assertIsSuccess(`Suite '${suite.name}' was updated!`);
    return expect(suiteList.isTestSuitePresent(suite.name)).toEqual(true);
  });

  it('Suite is still updated after refresh', async () => {
    await browser.refresh();
    await expect(suiteList.isTestSuitePresent(suite.name)).toEqual(true);
  });

  it('Suite with same name cannot be created', async () => {
    await suiteList.openCreationRow();
    await suiteList.setCreationName(suite.name);
    await suiteList.acceptCreation();
    return suiteList.notification.assertIsError(`You are trying to create duplicate entity.`);
  });

  it('Suite should be opened after click on row', async () => {
    await suiteList.clickTestSuite(suite.name);
    return expect(suiteView.getNameOfLabelTestSuite()).toEqual(suite.name);
  });

  it('I can Remove Test Suite', async () => {
    await (await suiteView.menuBar.tests()).suites();
    await suiteList.clickRemoveSuiteButton(suite.name);
    await expect(suiteList.modal.isVisible()).toBe(true, 'Remove Test Run modal is not opened');
    await suiteList.modal.clickYes();
    await suiteList.refresh();
    await expect(suiteList.isTestSuitePresent(suite.name)).toBe(false,
      `Suite ${suite.name} is still displayed`);
  });
});
