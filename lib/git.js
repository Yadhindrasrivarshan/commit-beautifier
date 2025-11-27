import {execa} from "execa";
import fs from "fs/promises";
import os from "os";
import path from "path";

/** Check if there are staged changes */
export async function hasStagedChanges() {
  try {
    const { stdout } = await execa("git", ["rev-parse", "--is-inside-work-tree"]);
    if (stdout.trim() !== "true") return false;
  } catch (e) {
    return false;
  }

  const { stdout } = await execa("git", ["diff", "--cached", "--name-only"]);
  return stdout.trim().length > 0;
}

/** Get current branch name (or null) */
export async function getCurrentBranch() {
  try {
    const { stdout } = await execa("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    return stdout.trim();
  } catch {
    return null;
  }
}

/** Safe commit using a temporary file and `git commit -F` */
export async function makeCommit(message) {
  const tmp = path.join(os.tmpdir(), `commit-beautifier-msg-${Date.now()}.txt`);
  await fs.writeFile(tmp, message, "utf8");
  try {
    await execa("git", ["commit", "-F", tmp], { stdio: "inherit" });
  } finally {
    await fs.unlink(tmp).catch(() => {});
  }
}
