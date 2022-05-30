import * as core from '@actions/core';
import { GitHub } from '@actions/github/lib/utils';
import { isString } from './functions';

export const getTeamSlugsForAuthor = async (
  octokit: InstanceType<typeof GitHub>,
  org: string,
  username: string,
  ignoreSlugs: string[] = [],
): Promise<string[]> => {
  const { data: allTeams } = await octokit.rest.teams.list({
    org,
  });

  const authorsTeamSlugs = allTeams.map<Promise<string | undefined>>(async ({ slug }) => {
    if (ignoreSlugs.includes(slug)) {
      return;
    }

    try {
      const { data: membership } = await octokit.rest.teams.getMembershipForUserInOrg({
        org,
        team_slug: slug,
        username,
      });

      if (membership.state === 'active') {
        return slug;
      }
    } catch (error) {
      // Octokit query fails when username is not member of a team, see https://octokit.github.io/rest.js/v18
      core.info(`${username} not a member of ${slug}`);
    }
  });

  return (await Promise.all(authorsTeamSlugs)).filter(isString);
};
