import { logIn } from '../../pages/login.po';
import { projectList } from '../../pages/project/list.po';
import { ProjectHelper } from '../../helpers/project.helper';
import using from 'jasmine-data-provider';
import usersTestData from '../../data/users.json';
import { userAdministration } from '../../pages/administration/users.po';
import { apiTokenAdministration } from '../../pages/administration/apiToken.po';
import { notFound } from '../../pages/notFound.po';

const editorExamples = {
    autoAdmin: usersTestData.autoAdmin,
    localAdmin: usersTestData.localAdmin,
    localManager: usersTestData.localManager,
    manager: usersTestData.manager
};

const notEditorExamples = {
    localEngineer: usersTestData.localEngineer,
};

describe('API Token:', () => {
    const projectHelper: ProjectHelper = new ProjectHelper();

    beforeAll(async () => {
        await projectHelper.init({
            autoAdmin: usersTestData.autoAdmin,
            manager: usersTestData.manager,
            localAdmin: usersTestData.localAdmin,
            localManager: usersTestData.localManager,
            localEngineer: usersTestData.localEngineer
        });
    });

    afterAll(async () => {
        await projectHelper.dispose();
    });

    using(editorExamples, (user, description) => {
        describe(`API Token: ${description} role:`, () => {
            beforeAll(async () => {
                await logIn.logInAs(user.user_name, user.password);
                await projectHelper.openProject();
            });

            it('I can open API Token page', async () => {
                await projectList.menuBar.administration();
                await userAdministration.sidebar.apiToken();
                return expect(apiTokenAdministration.isOpened()).toBe(true, `API Token page is not opened for ${description}`);
            });

            it('I can generate API Token ', async () => {
                await apiTokenAdministration.selectProject(projectHelper.project.name);
                await apiTokenAdministration.clickGenerateToken();
                await expect(apiTokenAdministration.isModalOpened()).toBe(true, 'Confirmation Modal is Missed!');
                await apiTokenAdministration.acceptModal();
                const regexpr = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{25}/;
                const tokenValue = await apiTokenAdministration.getTokenValue();
                return expect(regexpr.test(tokenValue)).toBe(true, `API token has wrong format! ${tokenValue}`);
            });

            it('Generated API Token is not visible after reopening page', async () => {
                await apiTokenAdministration.sidebar.permissions();
                await apiTokenAdministration.sidebar.apiToken();
                return expect(apiTokenAdministration.isTokenValueExists()).toBe(false, `API Token value should be hidden!`);
            });

            it('I can regenerate API Token', async () => {
                await apiTokenAdministration.selectProject(projectHelper.project.name);
                await apiTokenAdministration.clickGenerateToken();
                await apiTokenAdministration.acceptModal();
                const regexpr = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{25}/;
                const tokenValue = await apiTokenAdministration.getTokenValue();
                return expect(regexpr.test(tokenValue)).toBe(true, `API token has wrong format! ${tokenValue}`);
            });
        });
    });

    using(notEditorExamples, (user, description) => {
        describe(`API Token: ${description} role:`, () => {
            beforeAll(async () => {
                await logIn.logInAs(user.user_name, user.password);
                return projectHelper.openProject();
            });

            it('I can not Open API Token page using Menu Bar', async () => {
                return expect(projectList.menuBar.isAdministrationExists())
                    .toBe(false, `Administration should not be visible for ${description}`);
            });

            it('I can not Open API Token page using url', async () => {
                await apiTokenAdministration.navigateTo();
                await expect(apiTokenAdministration.isOpened()).toBe(false, `API Token page is opened for ${description}`);
                return expect(notFound.isOpened()).toBe(true, `Not Found page is not opened for ${description}`);
            });
        });
    });
});

