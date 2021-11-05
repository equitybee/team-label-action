import * as core from '@actions/core';
import { GitHub } from '@actions/github/lib/utils';

export const getTeamSlugsForAuthor = async (
  octokit: InstanceType<typeof GitHub>,
  org: string,
  author: string,
): Promise<string[]> => {
  const { data: allTeams } = await octokit.rest.teams.list({
    org,
  });
  const teamSlugs = allTeams.map((team) => team.slug);

  const authorsTeamSlugs = [];

  for await (const teamSlug of teamSlugs) {
    try {
      const { data: membership } = await octokit.rest.teams.getMembershipForUserInOrg({
        org,
        team_slug: teamSlug,
        username: author,
      });

      if (membership.state === 'active') {
        authorsTeamSlugs.push(teamSlug);
      }
    } catch (error) {
      // Octokit query fails when username is not member of a team, see https://octokit.github.io/rest.js/v18
      core.info(`${author} not a member of ${teamSlug}`);
      continue;
    }
  }

  return authorsTeamSlugs;
};
