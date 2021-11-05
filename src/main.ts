import * as core from '@actions/core';
import github from '@actions/github';

async function run(): Promise<void> {
  try {
    // const token = core.getInput('repo-token', { required: true });
    // const configPath = core.getInput('configuration-path', { required: true });

    const pullRequest = github.context.payload.pull_request;
    console.log(pullRequest);
    const author = pullRequest?.user.login;
    console.log(author);

    // get org -> provide id as input?
    // if PR author is in the org
    // get teams for PR author
    // label PR with all team names for PR author

    const myToken = core.getInput('myToken');

    const octokit = github.getOctokit(myToken);

    const org = 'equitybee';
    const teamList = await octokit.rest.teams.list({
      org,
    });
    console.log(teamList);
    // await octokit.rest.teams.getMembershipForUserInOrg();
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

run();
