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
      - uses: equitybee/team-label-action@main
        with:
          repo-token: ${{ secrets.TOKEN }}
          organization-name: YOUR_ORGANIZATION_NAME
```

Make sure to add the relevant inputs:

- `repo-token` is your `${{ secrets.GITHUB_TOKEN }}`. You may encounter an error where this token does not have the necessary permissions to access an organization or teams. At EquityBee, we use PATs (Personal Access Token) instead. Create a [personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the repo or public_repo scopes enabled, and add the token as an [encrypted secret](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository) for the repository or organization
- `organization-name` is the name/slug of your Github organization (it comes right after `https://github.com/`)
- `ignore-labels` is an optional, comma-separated list of labels to ignore
- `prefix` is an optional prefix that will be added to all team labels


## Internal use

You may wonder why [Husky](https://typicode.github.io/husky/#/) is running a pre-commit script: we are copying its contents directly in our monorepo. Husky makes sure the `dist/` directory always contains the latest, built action.

## Next steps

- [ ] add tests

## License

Apache-2 © EquityBee
