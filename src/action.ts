import { info, getInput, setOutput } from "@actions/core";

import {
  configureDnsRecordSet,
  ConfigureDnsRecordSetInput,
} from "./dns-record-management";

export async function run() {
  const comment = getInput("comment");
  const records = getInput("records");
  const hostedZoneId = getInput("hosted-zone-id");

  const changeInfo = await configureDnsRecordSet({
    comment,
    records,
    hostedZoneId,
  } as ConfigureDnsRecordSetInput);

  if (!changeInfo) throw new Error("Failed to apply changes");

  info("Change Info:");
  info(`  Id: ${changeInfo.Id}`);
  info(`  Status: ${changeInfo.Status}`);
  info(`  Submitted At: ${changeInfo.SubmittedAt}`);
  info(`  Comment: ${changeInfo.Comment}`);

  return 0;
}
