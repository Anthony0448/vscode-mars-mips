# Building and publishing

This guide prepares and publishes `anthony0448.mars-mips-toolkit`. Publishing changes the public Visual Studio Marketplace listing, so the repository does not perform it automatically on normal pushes.

## Prerequisites

- Node.js 22 or newer and npm
- A Visual Studio Marketplace publisher with the ID `anthony0448`
- Permission to publish extensions for that publisher
- Java only if you want to exercise the bundled MARS commands locally

Do not commit Marketplace tokens or other credentials. The included GitHub Actions release workflow is designed for Marketplace trusted publishing through OpenID Connect (OIDC), which avoids a stored Personal Access Token.

## Validate a release locally

From the repository root:

```sh
npm ci
npm test
npm run format:check
npm run package:list
npm run package:vsix
```

The final command creates `mars-mips-toolkit-<version>.vsix`. Install that exact artifact into VS Code for a smoke test:

```sh
code --install-extension mars-mips-toolkit-1.2.0.vsix --force
```

Confirm that an `.asm` file receives MIPS highlighting, completion, navigation, and formatting. If Java is installed, also verify that the MARS commands either run successfully or report a useful configuration error.

## Prepare the Marketplace publisher

1. Create or verify the `anthony0448` publisher in the [Visual Studio Marketplace management portal](https://marketplace.visualstudio.com/manage).
2. In the Marketplace publisher settings, add a trusted-publisher policy for this GitHub repository and the `.github/workflows/publish.yml` workflow.
3. In the GitHub repository, create a protected environment named `vscode-marketplace`. Add required reviewers if every public release should require approval.

The expected Marketplace identifier is `anthony0448.mars-mips-toolkit`.

## Publish version 1.2.0

1. Make sure `package.json` and `CHANGELOG.md` describe version `1.2.0` and the working tree is clean.
2. Run the local validation commands above and install the resulting VSIX.
3. Commit the release preparation, then create and push the release tag:

    ```sh
    git tag -a 1.2.0 -m "Release 1.2.0"
    git push origin main 1.2.0
    ```

4. Open **Actions > Publish VS Code extension > Run workflow**, enter `publish`, and start the workflow.
5. Verify the listing, README, changelog, icon, categories, and install button in the Marketplace after the workflow completes.

The workflow runs all checks, creates the VSIX, and publishes that exact artifact through the local `vsce` dependency with `--oidc`. It is manual-only and will not publish from an ordinary push or pull request.

If trusted publishing is not available, authenticate `vsce` locally according to the current VS Code publishing documentation and run:

```sh
npm run publish:marketplace
```

## Future releases

1. Update the version in `package.json` and `package-lock.json` using semantic versioning.
2. Add a dated section to `CHANGELOG.md` and update its comparison link.
3. Repeat the validation and VSIX smoke test.
4. Commit, tag, push, and manually run the publishing workflow.

Never reuse a Marketplace version number: each published version must be greater than the previous one.
