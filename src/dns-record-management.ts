import * as fs from "fs";
import { parse as parseYaml } from "yaml";

import Route53, {
  Change,
  Changes,
  ChangeInfo,
  ChangeBatch,
  ResourceRecordSets,
  ChangeResourceRecordSetsRequest,
} from "aws-sdk/clients/route53";

export interface ConfigureDnsRecordSetInput {
  records: string;
  hostedZoneId: string;
  comment?: string;
}

function getClient(): Route53 {
  return new Route53({
    customUserAgent: "icalia-actions/aws-action",
    region: process.env.AWS_DEFAULT_REGION,
  });
}

function parseRecordSet(jsonRecordSet: string): ResourceRecordSets {
  // parseYaml takes care of both YAML and JSON strings
  return parseYaml(jsonRecordSet || "null") as ResourceRecordSets;
}

function readRecordSetFile(filePath: string): ResourceRecordSets {
  const templateContents = fs.readFileSync(filePath, "utf8");
  return parseRecordSet(templateContents);
}

function processRecordSetInput(recordInput: string): Changes {
  let records;
  if (!fs.existsSync(recordInput)) records = parseRecordSet(recordInput);
  else records = readRecordSetFile(recordInput);

  return records.map((record) => {
    return { Action: "UPSERT", ResourceRecordSet: record } as Change;
  }) as Changes;
}

export async function configureDnsRecordSet(
  input: ConfigureDnsRecordSetInput
): Promise<ChangeInfo | undefined> {
  const { hostedZoneId, records, comment } = input;

  const changes = processRecordSetInput(records);

  const client = getClient();
  const { ChangeInfo } = await client
    .changeResourceRecordSets({
      HostedZoneId: hostedZoneId,
      ChangeBatch: {
        Comment: comment,
        Changes: changes,
      } as ChangeBatch,
    } as ChangeResourceRecordSetsRequest)
    .promise();

  return ChangeInfo;
}
