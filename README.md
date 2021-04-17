# AWS Configure Route53 Records

Configures DNS records in a given AWS Route 53 domain

## Usage

```yaml
      - name: Configure AWS Route53 Records
        uses: icalia-actions/aws-configure-route53-records@v0.0.1
        with:
          hosted-zone-id: ROUTE53_HOSTED_ZONE_ID
          records: |
            [
              {
                "Name": "record-name.your-domain.tld.",
                "Type": "A",
                "AliasTarget": {
                  "HostedZoneId": "TARGET_HOSTED_ZONE_ID",
                  "DNSName": "dualstack.my-load-balancer.my-region.elb.amazonaws.com.",
                  "EvaluateTargetHealth": true
                }
              }
            ]
          comment: An optional comment that describes the purpose of these changes
```

### Using record template files:

You can also use an additional json or yaml file like this:

```yaml
# tmp/example.yml
- Name: subdomain1.my-domain.tld.
  Type: A
  AliasTarget: &target
    HostedZoneId: TARGET_HOSTED_ZONE_ID
    DNSName: dualstack.my-load-balancer.my-region.elb.amazonaws.com.
    EvaluateTargetHealth: true

- Name: subdomain2.my-domain.tld.
  Type: A
  AliasTarget:
    <<: *target
```

```yaml
      - name: Configure AWS Route53 Records
        uses: icalia-actions/aws-configure-route53-records@v0.0.1
        with:
          hosted-zone-id: ROUTE53_HOSTED_ZONE_ID
          records: tmp/example.yml
          comment: An optional comment that describes the purpose of these changes
```