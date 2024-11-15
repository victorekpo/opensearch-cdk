import * as CDK from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { OpenSearchStack } from './stacks';

let template: Template;

describe('OpenSearch Stack', () => {

  // Initialize the CDK app and stack once for all tests
  beforeAll(() => {
    const app = new CDK.App();
    const stack = new OpenSearchStack(app, 'TestStack');
    template = Template.fromStack(stack);
  });

  test('OpenSearch Domain Created', () => {
    // Verify that the OpenSearch domain is created
    template.hasResourceProperties('AWS::OpenSearchService::Domain', {
      EngineVersion: 'OpenSearch_1.3',
      ClusterConfig: {
        InstanceType: 't3.small.search',
        InstanceCount: 1,
        DedicatedMasterEnabled: false,
      },
      EBSOptions: {
        EBSEnabled: true,
        VolumeSize: 10,
      },
      NodeToNodeEncryptionOptions: {
        Enabled: true,
      },
      EncryptionAtRestOptions: {
        Enabled: true,
      },
      DomainEndpointOptions: {
        EnforceHTTPS: true,
      },
      AdvancedSecurityOptions: {
        MasterUserOptions: {
          MasterUserName: 'admin',
        },
      },
    });
  });

  test('OpenSearch Domain Endpoint Output', () => {
    // Verify that the OpenSearch domain endpoint is output
    template.hasOutput('OpenSearchDomainEndpoint', {});
  });
});