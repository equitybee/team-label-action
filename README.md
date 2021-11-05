# Auto-label PRs based on the author's team memberships

Use this Github action to automatically add a label to PRs based on the teams the PR author belongs to.

## Why did we build this?

At EquityBee, we use a large monorepo where multiple teams/squads collaborate. Due to [Github's PR filtering limitations](https://docs.github.com/en/issues/tracking-your-work-with-issues/filtering-and-searching-issues-and-pull-requests), we built this action to easily filter PRs based on the author's team membership.

## How to use

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
          token: ${{ secrets.TOKEN }}
          path: .github/actions/team-label-action
          ref: main
      - uses: ./.github/actions/team-label-action
        with:
          repo-token: ${{ secrets.TOKEN }}
          organization-name: equitybee
```

## Next steps

This repo is a great candidate for open-sourcing.
