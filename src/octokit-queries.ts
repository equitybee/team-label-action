import * as core from '@actions/core';
import { GitHub } from '@actions/github/lib/utils';

export const getTeamSlugsForAuthor = async (
  octokit: InstanceType<typeof GitHub>,
  org: string,
  username: string,
  ignoreSlugs: string[] = [],
): Promise<string[]> => {
  const { data: allTeams } = await octokit.rest.teams.list({
    org,
  });

  const authorsTeamSlugs: string[] = [];

  for await (const { slug } of allTeams) {
    if (ignoreSlugs.includes(slug)) {
      continue;
    }

    try {
      const { data: membership } = await octokit.rest.teams.getMembershipForUserInOrg({
        org,
        team_slug: slug,
        username,
      });

      if (membership.state === 'active') {
        authorsTeamSlugs.push(slug);
      }
    } catch (error) {
      // Octokit query fails when username is not member of a team, see https://octokit.github.io/rest.js/v18
      core.info(`${username} not a member of ${slug}`);
    }
  }

  return authorsTeamSlugs;
};
