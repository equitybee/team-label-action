import { GitHub } from '@actions/github/lib/utils';
import { getTeamSlugsForAuthor } from './../octokit-queries';

describe('getTeamSlugsForAuthor', () => {
  let octokit: InstanceType<typeof GitHub>;
  let teamSlugs: string[];

  beforeEach(() => {
    octokit = {
      rest: {
        teams: {
          list: jest.fn(async () =>
            Promise.resolve({
              data: [
                { slug: 'team-active' },
                { slug: 'team-pending' },
                { slug: 'team-not-a-member' },
                { slug: 'team-active-ignored' },
              ],
            }),
          ),
          getMembershipForUserInOrg: jest.fn(async ({ team_slug }) => {
            if (team_slug.startsWith('team-active')) {
              return {
                data: { state: 'active' },
              };
            }

            if ('team-pending' === team_slug) {
              return {
                data: { state: 'pending' },
              };
            }

            throw new Error();
          }),
        },
      },
    } as any;
  });

  describe('all teams', () => {
    beforeEach(async () => {
      teamSlugs = await getTeamSlugsForAuthor(octokit, 'ORG', 'USER');
    });

    it('should return user teams', () => {
      expect(teamSlugs).toStrictEqual(['team-active', 'team-active-ignored']);
    });
  });

  describe('with ignored teams', () => {
    beforeEach(async () => {
      teamSlugs = await getTeamSlugsForAuthor(octokit, 'ORG', 'USER', ['team-active-ignored']);
    });

    it('should return filtered teams', () => {
      expect(teamSlugs).toStrictEqual(['team-active']);
    });
  });
});
