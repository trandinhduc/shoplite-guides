#!/usr/bin/env node
// Gom PR đã merge giữa hai tag. Chỉ đọc. Khi chạy ca thử: đọc dữ liệu cố định từ CA_THU_DAU_VAO.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const [moi, cu] = process.argv.slice(2);
const TAG = /^[\w.\-]+$/;
if (!moi || !cu || !TAG.test(moi) || !TAG.test(cu)) {
  console.error("Lỗi: cần đúng hai tag, ví dụ: lay-pr.mjs v0.2.0 v0.1.0");
  process.exit(2);
}
if (process.env.CA_THU_DAU_VAO) {
  process.stdout.write(readFileSync(process.env.CA_THU_DAU_VAO, "utf8"));
  process.exit(0);
}
const run = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" });
const commits = run("git", ["log", `${cu}..${moi}`, "--no-merges", "--format=%H%x09%s"])
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((l) => {
    const [sha, ...s] = l.split("\t");
    return { sha, tieu_de: s.join("\t") };
  });
const tatCa = JSON.parse(
  run("gh", [
    "pr",
    "list",
    "--state",
    "merged",
    "--base",
    "main",
    "--limit",
    "200",
    "--json",
    "number,title,body,labels,mergeCommit",
  ]),
);
const sha = new Set(commits.map((c) => c.sha));
const prs = tatCa
  .filter((p) => sha.has(p.mergeCommit?.oid))
  .map((p) => ({
    so: p.number,
    tieu_de: p.title,
    mo_ta: p.body,
    nhan: p.labels.map((l) => l.name),
  }));
const trongPr = new Set(tatCa.map((p) => p.mergeCommit?.oid));
console.log(
  JSON.stringify(
    {
      prs,
      commit_ngoai_pr: commits
        .filter((c) => !trongPr.has(c.sha))
        .map((c) => ({ ma: c.sha.slice(0, 7), tieu_de: c.tieu_de })),
    },
    null,
    2,
  ),
);
