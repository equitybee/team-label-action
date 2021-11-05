import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token', { required: true });
    const octokit = getOctokit(token);

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

    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      // eslint-disable-next-line camelcase
      issue_number: pullRequest.number,
      labels: authorMembershipTeamSlugs,
    });
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

run();
