import * as CDK from 'aws-cdk-lib';
import { OpenSearchStack } from "./stacks";

const app = new CDK.App();

const stack = new OpenSearchStack(app, 'OpenSearchStack');
console.log('OpenSearch stack deployed', stack);