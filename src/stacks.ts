import { Construct } from 'constructs';
import * as CDK from 'aws-cdk-lib';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class OpenSearchStack extends CDK.Stack {
  constructor(scope: Construct, id: string, props?: CDK.StackProps) {
    super(scope, id, props);

    // VPC configuration
    // const vpc = new ec2.Vpc(this, 'OpenSearchVpc', {
    //   maxAzs: 2,
    // });

    // OpenSearch Service domain
    const domain = new opensearch.Domain(this, 'OpenSearchDomain', {
      version: opensearch.EngineVersion.OPENSEARCH_1_3,
      capacity: {
        masterNodes: 0,
        dataNodes: 1,
        dataNodeInstanceType: 't3.small.search', // Free tier instance type
      },
      ebs: {
        volumeSize: 10, // Free tier volume size
      },
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
      },
      enforceHttps: true,
      fineGrainedAccessControl: {
        masterUserName: 'admin',
        masterUserPassword: CDK.SecretValue.plainText('password'), // Replace with a secure password
      },
    //  vpc,
    //  vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
      accessPolicies: [
        new iam.PolicyStatement({
          actions: ['es:*'],
          effect: iam.Effect.ALLOW,
          principals: [new iam.AnyPrincipal()],
          resources: ['*'],
        }),
      ],
      automatedSnapshotStartHour: 0, // Daily automated snapshot at midnight UTC
      removalPolicy: CDK.RemovalPolicy.DESTROY,
    });

    // Output the OpenSearch domain endpoint
    new CDK.CfnOutput(this, 'OpenSearchDomainEndpoint', {
      value: domain.domainEndpoint,
    });
  }
}