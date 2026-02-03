import runGenerate from "../../generate.js";
import "reflect-metadata";
import runMigrate from "../../migration.js";

const argv = process.argv.slice(2);
console.log(argv);
const cmd = argv[0];
if (!cmd || cmd === "--help" || cmd === "-h") {
  console.log(`run:
  npm run generate [--init name file]
`);
  process.exit(0);
}
if (argv[0] === "generate") {
  await runGenerate();
} else if (argv[0] === "migrate") {
  await runMigrate();
}
