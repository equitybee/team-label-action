# Auto-label PRs based on teams 🏷👥

Use this Github action to automatically add a label to PRs based on the teams the PR author belongs to.

## Why did we build this?

At [EquityBee](https://equitybee.com/), we use a large monorepo where multiple teams/squads collaborate. Due to [Github's PR filtering limitations](https://docs.github.com/en/issues/tracking-your-work-with-issues/filtering-and-searching-issues-and-pull-requests), we built this action to easily filter PRs based on the author's team membership.

For the action to work, the author must be a member of a [team on Github](https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams).

## How to use

Under `.github/workflows` create a new `.yml` file to run the action on every PR:

```yaml
name: Assign PR team labels
on:
  pull_request:
    branches:
      - main

jobs:
  team-labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          repository: EquityBee/team-label-action
          token: ${{ secrets.GITHUB_TOKEN }}
          path: .github/actions/team-label-action
          ref: main
      - uses: ./.github/actions/team-label-action
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          organization-name: equitybee
```

Make sure to add the relevant inputs:

- `repo-token` is your `${{ secrets.GITHUB_TOKEN }}`. You may encounter an error where this token does not have the necessary permissions to access an organization or teams. At EquityBee, we use PATs (Personal Access Token) instead. [Github instructions on how to create a PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
- `organization` is the name/slug of your Github organization (it comes right after `https://github.com/`)

## Next steps

- [ ] add tests
- [ ] this repo is a great candidate for open-sourcing!
