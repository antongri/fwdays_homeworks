// import * as cdk from 'aws-cdk-lib/core';
// import { Construct } from 'constructs';
// // import * as sqs from 'aws-cdk-lib/aws-sqs';

// export class CdkLocalstackDemoStack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     // The code that defines your stack goes here

//     // example resource
//     // const queue = new sqs.Queue(this, 'CdkLocalstackDemoQueue', {
//     //   visibilityTimeout: cdk.Duration.seconds(300)
//     // });
//   }
// }

import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class CdkLocalStackDemoStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create S3 Bucket
        const bucket = new s3.Bucket(this, 'MyBucket', {
            bucketName: `my-unique-bucket-${id.toLowerCase()}`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        // Create IAM Role
        const role = new iam.Role(this, 'MyRole', {
            assumedBy: new iam.ServicePrincipal('s3.amazonaws.com'),
        });

        // Attach Policy to Role
        role.addToPolicy(new iam.PolicyStatement({
            actions: ['s3:*'],
            resources: [bucket.bucketArn],
        }));
    }
}