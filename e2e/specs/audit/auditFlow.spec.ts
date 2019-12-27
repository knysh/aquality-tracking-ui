import { logIn } from '../../pages/login.po';
import { projectList } from '../../pages/project/list.po';
import { projectAudits } from '../../pages/audit/project.list.po';
import { Project } from '../../../src/app/shared/models/project';
import { prepareProject } from '../project.hooks';
import using from 'jasmine-data-provider';
import usersTestData from '../../data/users.json';
import projects from '../../data/projects.json';
import { createAudit } from '../../pages/audit/create.po';
import { auditInfo } from '../../pages/audit/view.po';
import { browser } from 'protractor';
import { testData } from '../../utils/testData.util';

const editorExamples = {
    auditAdmin: usersTestData.auditAdmin,
    assignedAuditor: usersTestData.assignedAuditor
};

const auditAdmin = editorExamples.auditAdmin;
const assignedAuditor = editorExamples.assignedAuditor;

const attachName = 'attach.docx';

describe('Audit:', () => {
    const project: Project = projects.customerOnly;
    project.name = new Date().getTime().toString();

    beforeAll(async () => {
        await logIn.logInAs(usersTestData.admin.user_name, usersTestData.admin.password);
        await prepareProject(project);
        return projectList.menuBar.clickLogOut();
    });

    afterAll(async () => {
        await logIn.logInAs(usersTestData.admin.user_name, usersTestData.admin.password);
        await projectList.isOpened();
        await projectList.removeProject(project.name);
    });

    using(editorExamples, (user, description) => {
        describe(`Permissions: ${description} role:`, () => {
            beforeAll(async () => {
                await logIn.logInAs(auditAdmin.user_name, auditAdmin.password);
                await projectList.openProject(project.name);
                await (await projectList.menuBar.audits()).project();
                await projectAudits.clickCreate();
                await createAudit.create(createAudit.services.auto, assignedAuditor);
                await createAudit.menuBar.clickLogo();
                if (user.user_name !== auditAdmin.user_name) {
                    await projectList.menuBar.clickLogOut();
                    await logIn.logInAs(user.user_name, user.password);
                }
            });

            describe(`In Progress:`, () => {
                it('Can open Audit from Project Audits', async () => {
                    await projectList.openProject(project.name);
                    await (await projectList.menuBar.audits()).project();
                    await expect(projectAudits.isOpened()).toBe(true, 'Project Audits page is not opened!');
                    await projectAudits.openAudit(projectAudits.statuses.open);
                    return expect(auditInfo.isOpened()).toBe(true, 'Audit is not opened!');
                });

                it('Can start Audit', async () => {
                    await auditInfo.startAudit();
                    await expect(auditInfo.modal.isVisible()).toBe(true, 'No Confirmation modal for start Audit action!');
                    await auditInfo.modal.clickYes();
                    await expect(auditInfo.getStatus()).toBe(auditInfo.statuses.inProgress, 'Audit is not In Progress status!');
                    await expect(auditInfo.isFinishProgressEnabled()).toBe(false, 'Finish progress should not be availabe!');
                    await expect(auditInfo.notification.isSuccess()).toBe(true, 'Success message is not shown!');
                    await auditInfo.notification.close();
                });

                it('Can set Result', async () => {
                    const result = '58';
                    await auditInfo.setResult(result);
                    await expect(auditInfo.notification.isSuccess()).toBe(true, 'Success message is not shown!');
                    await auditInfo.notification.close();
                    await expect(auditInfo.isFinishProgressEnabled()).toBe(false, 'Finish progress should not be availabe!');
                    await browser.refresh();
                    await expect(auditInfo.getResult()).toBe(result, 'Result is not updatet');
                });

                it('Can set Summary', async () => {
                    const summary = 'Some Text';
                    await auditInfo.setSummary(summary);
                    await auditInfo.clickSaveSummary();
                    await expect(auditInfo.notification.isSuccess()).toBe(true, 'Success message is not shown!');
                    await auditInfo.notification.close();
                    await expect(auditInfo.isFinishProgressEnabled()).toBe(false, 'Finish progress should not be availabe!');
                    await browser.refresh();
                    await expect(auditInfo.getSummary()).toBe(summary, 'Summary is not updatet');
                });

                it('Can add attachments', async () => {
                    await auditInfo.attachDocument(testData.getFullPath(`/attachments/${attachName}`));
                    return expect(auditInfo.isAttachAdded(attachName)).toBe(true, `${attachName} is not added`);
                });

                it('Can upload attachments', async () => {
                    await auditInfo.uploadAttachment(attachName);
                    await expect(auditInfo.notification.isSuccess()).toBe(true, 'Success message is not shown!');
                    await expect(auditInfo.notification.getContent()).toBe(`'${attachName}' file was uploaded!`, 'Message is wrong!');
                    await auditInfo.notification.close();
                    await expect(auditInfo.isAttachUploaded(attachName)).toBe(true, `${attachName} is not uploaded!`);
                    return expect(auditInfo.isFinishProgressEnabled()).toBe(true, 'Finish progress should be availabe!');
                });
            });

            describe(`In Review:`, () => {
                it('Can finish progress when all data is passed', async () => {
                    await auditInfo.finishAudit();
                    await expect(auditInfo.modal.isVisible()).toBe(true, 'No Confirmation modal for Finish Audit action!');
                    await auditInfo.modal.clickYes();
                    await expect(auditInfo.getStatus()).toBe(auditInfo.statuses.inReview, 'Audit is not In Review status!');
                    await expect(auditInfo.notification.isSuccess()).toBe(true, 'Success message is not shown!');
                    await auditInfo.notification.close();
                });

                it('Can add changes to in review audit', async () => {
                    const summary = 'Some New Text';
                    await auditInfo.setSummary(summary);
                    await auditInfo.clickSaveSummary();
                    await auditInfo.notification.close();
                    await expect(auditInfo.getSummary()).toBe(summary, 'Summary is not updatet');
                });

                it('Submit button is available for only Audit Admin', async () => {
                    expect(await auditInfo.isSubmitButtonPresent())
                        .toBe(user.user_name === auditAdmin.user_name, `Submit button availabilty is wrong for ${user.user_name}`);
                });
            });

            describe(`Submitted:`, () => {
                it('Can submit audit', async () => {
                    if (user.user_name !== auditAdmin.user_name) {
                        await projectList.menuBar.clickLogOut();
                        await logIn.logInAs(auditAdmin.user_name, auditAdmin.password);
                        await auditInfo.open(project.name, auditInfo.statuses.inReview);
                    }
                    await auditInfo.submitAudit();
                    await expect(auditInfo.modal.isVisible()).toBe(true, 'No Confirmation modal for Submit Audit action!');
                    await auditInfo.modal.clickYes();
                    await expect(auditInfo.getStatus()).toBe(auditInfo.statuses.submitted, 'Audit is not Submitted status!');
                    await expect(auditInfo.notification.isSuccess()).toBe(true, 'Success message is not shown!');
                    await auditInfo.notification.close();

                    if (user.user_name !== auditAdmin.user_name) {
                        await projectList.menuBar.clickLogOut();
                        await logIn.logInAs(user.user_name, user.password);
                        await auditInfo.open(project.name, auditInfo.statuses.submitted);
                    }
                });
            });
        });
    });
});

