import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token', { required: true });
    const octokit = getOctokit(token);

    // const configPath = core.getInput('configuration-path', { required: true });

    // get org -> provide id as input?
    // if PR author is in the org
    // get teams for PR author
    // label PR with all team names for PR author

    // TODO: make this variable
    const org = 'equitybee';
    const { data: allTeams } = await octokit.rest.teams.list({
      org,
    });
    const teamSlugs = allTeams.map((team) => team.slug);

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

    console.log(org, teamSlugs[0], author);

    try {
      const teams = await octokit.rest.teams.getMembershipForUserInOrg({
        org,
        // eslint-disable-next-line camelcase
        team_slug: 'employee-squad',
        username: author,
      });
      console.log(teams);
    } catch (error) {
      console.error('oh no this failed');
      console.log(error);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

run();
