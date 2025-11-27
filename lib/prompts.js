import inquirer from "inquirer";

export async function promptCommitDetails() {
  const commitTypes = [
    { name: "feat     → A new feature", value: "feat" },
    { name: "fix      → A bug fix", value: "fix" },
    { name: "refactor → Code refactor (no feature or fix)", value: "refactor" },
    { name: "chore    → Build process or tooling", value: "chore" },
    { name: "docs     → Documentation changes", value: "docs" },
    { name: "test     → Adding or updating tests", value: "test" },
    { name: "style    → Code style or formatting", value: "style" },
    { name: "perf     → Performance improvements", value: "perf" },
    { name: "hotfix   → Quick critical production fix", value: "hotfix" }
  ];

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Select the type of change:",
      choices: commitTypes
    },
    {
      type: "input",
      name: "summary",
      message: "Enter a short summary (max 72 chars):",
      validate: (input) =>
        input.length > 0 && input.length <= 72
          ? true
          : "Summary must be 1-72 characters."
    },
    {
      type: "input",
      name: "body",
      message: "Enter a longer description (optional):"
    },
    {
      type: "input",
      name: "ticket",
      message: "Enter a ticket ID (optional) - If missing, will attempt to detect from branch name in ticket ID format (ABC-123):"
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Proceed with this commit message?",
      default: true
    }
  ]);

  return answers;
}
