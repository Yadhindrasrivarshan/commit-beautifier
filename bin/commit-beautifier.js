#!/usr/bin/env node
import { program } from "commander";
import chalk from "chalk";
import { promptCommitDetails } from "../lib/prompts.js";
import { validateAndFormatCommit, validatorMeta } from "../lib/validator.js";
import { hasStagedChanges, getCurrentBranch, makeCommit } from "../lib/git.js";
import inquirer from "inquirer";

program
  .description("Interactive commit CLI with stronger formatting & validation")
  .option("--type <type>", "commit type (feat|fix|... )")
  .option("--summary <summary>", "short summary (1-72 chars)")
  .option("--body <body>", "longer description (optional)")
  .option("--ticket <ticket>", "ticket id to append in footer (e.g. ABC-123)")
  .option("--scope <scope>", "commit scope (optional)")
  .option("--apply", "apply the commit (requires staged changes)")
  .option("--yes", "auto-confirm (non-interactive)")
  .parse(process.argv);

const opts = program.opts();

(async () => {
  console.log(chalk.cyan("\n🪄 commit-beautifier — structured commit helper\n"));

  let details = null;

  const nonInteractiveProvided = opts.type || opts.summary || opts.body || opts.scope || opts.ticket;
  if (nonInteractiveProvided) {
    details = {
      type: opts.type,
      scope: opts.scope,
      summary: opts.summary,
      body: opts.body,
      ticket: opts.ticket
    };
    if ((!details.type || !details.summary) && !opts.yes) {
      console.log(chalk.yellow("Some required fields are missing from flags — falling back to interactive prompts."));
      details = await promptCommitDetails({ defaults: details });
    } else if ((!details.type || !details.summary) && opts.yes) {
      console.error(chalk.red("Error: type and summary are required when using non-interactive --yes mode."));
      process.exit(1);
    }
  } else {
    details = await promptCommitDetails();
  }

  // If ticket not provided, attempt to parse from branch
  if (!details.ticket) {
    const branch = await getCurrentBranch();
    if (branch) {
      const m = branch.match(/([A-Z]{2,}-\d+)/);
      if (m) {
        details.ticket = m[1];
        console.log(chalk.gray(`Detected ticket from branch: ${details.ticket}`));
      }
    }
  }
  let formatted;
  try {
    formatted = validateAndFormatCommit(details);
  } catch (err) {
    console.error(chalk.red("Validation failed:"), err.message);
    console.log(chalk.gray(`Allowed types: ${validatorMeta.allowedTypes.join(", ")}`));
    process.exit(1);
  }

  console.log(chalk.green("\n✅ Commit message (preview):\n"));
  console.log(chalk.yellow(formatted));
  console.log("\n------------------------------------------\n");

  if (opts.dryRun) {
    process.exit(0);
  }

  // If user asked to apply, make sure staged changes exist
  if (opts.apply) {
    const staged = await hasStagedChanges();
    if (!staged) {
      console.error(chalk.red("No staged changes found. Please `git add` changes before committing."));
      process.exit(1);
    }

    let messageToUse = formatted;

    if (!opts.yes) {
      const { confirm } = await inquirer.prompt([
        { type: "confirm", name: "confirm", message: "Commit using above message?", default: true }
      ]);
      if (!confirm) {
        console.log(chalk.red("Commit cancelled."));
        process.exit(0);
      }
    }

    // finally commit
    await makeCommit(messageToUse);
    console.log(chalk.green("\n🎉 Committed successfully.\n"));
  } else {
    console.log(chalk.gray("Run with --apply to commit, or --dry-run to preview only."));
  }
})();