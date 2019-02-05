# :+1::tada: Thanks for Contributing! :tada::+1:

See [openstax/CONTRIBUTING.md](https://github.com/openstax/napkin-notes/blob/master/CONTRIBUTING.md) for more information!


# Creating an Issue

- add either `bug` or `enhancement` label
- describe the issue clearly in the description
- include a screenshot in the **Issue/PR body** (if request would change UI)

# Coding

- Application uses [dak/superb.js](https://github.com/dak/superb.js), an obscure framework
- You may want to copy `/src/app/components/a-component-template` or `/src/app/pages/a-page-template` if creating a new component or page
- `script/dev` builds and serves the page. It takes minutes for a change to incorporate. Sorry about that.
- `eslint` and `scsslint` are both pretty stringent about what they will accept.
- `script/test` must pass before PR can be accepted.

# Creating a Pull Request

- add `wip` label if code is not yet ready to merge
- if it resolves an Issue, link to the Issue in the PR **body**
- request a review (look at recently merged PRs to see who wrote them - likely a good choice for reviewer)

# Merging or Closing a Pull Request

- use the `Squash and merge` option when merging
- delete the branch afterward
