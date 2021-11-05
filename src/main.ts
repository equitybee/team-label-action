import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token', { required: true });
    const octokit = getOctokit(token);

    // const configPath = core.getInput('configuration-path', { required: true });

    // get org -> provide id as input?

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

    const authorMembershipTeamSlugs = [];

    for await (const teamSlug of teamSlugs) {
      try {
        const { data: membership } = await octokit.rest.teams.getMembershipForUserInOrg({
          org,
          // eslint-disable-next-line camelcase
          team_slug: teamSlug,
          username: author,
        });

        if (membership.state === 'active') {
          authorMembershipTeamSlugs.push(teamSlug);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`${author} not a member of ${teamSlug}`);
        continue;
      }
    }

    core.info(`${author} is member of ${authorMembershipTeamSlugs}`);
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

run();
