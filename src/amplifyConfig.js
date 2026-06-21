/* eslint-disable */
// Hand-maintained Amplify config (guest auth).
//
// NOTE: We deliberately do NOT use src/aws-exports.js. Amplify Hosting still runs
// a backend build that regenerates aws-exports.js (empty, since the managed
// backend was deleted), which would clobber our values. This file has a name
// Amplify does not manage, so the committed config survives the build.
//
// The identity pool is the guest pool from deploy/cognito.yaml. Update it there
// and here.
const awsmobile = {
  "aws_project_region": "us-east-1",
  "aws_cognito_identity_pool_id": "us-east-1:a6a37164-1d1b-4bfa-8a3d-b3e6daec1fa3",
  "aws_cognito_region": "us-east-1"
};

export default awsmobile;
