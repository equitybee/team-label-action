import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token', { required: true });
    // const configPath = core.getInput('configuration-path', { required: true });

    // get org -> provide id as input?
    // if PR author is in the org
    // get teams for PR author
    // label PR with all team names for PR author
    const octokit = getOctokit(token);

    const org = 'equitybee';
    const teamList = await octokit.rest.teams.list({
      org,
    });
    console.log(teamList);

    const pullRequest = context.payload.pull_request;

    if (!pullRequest) {
      core.debug('Could not get pull request from context');

      return;
    }

    const author = pullRequest?.user.login;

    if (!author) {
      core.debug('Could not get author from context');

      return;
    }

    // await octokit.rest.teams.getMembershipForUserInOrg();
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

run();
