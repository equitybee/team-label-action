import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { getTeamSlugsForAuthor } from './octokit-queries';
import { parseInputList } from './functions';

const run = async (): Promise<void> => {
  try {
    const org = core.getInput('organization-name', { required: true });

    // Get author, PR number from context
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

    const token = core.getInput('repo-token', { required: true });
    const octokit = getOctokit(token);
    const ignoreLabels = parseInputList(core.getInput('ignore-labels'));

    // Get all teams in the organization where the PR author is a member
    const authorsTeamSlugs = await getTeamSlugsForAuthor(octokit, org, author, ignoreLabels);

    if (authorsTeamSlugs.length < 1) {
      core.info(`${author} does not belong to any teams`);

      return;
    }

    // Label the PR with team names
    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest.number,
      labels: authorsTeamSlugs,
    });
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
};

run();
