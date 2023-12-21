import {
  ActionIdentifier,
  EntityIdentifier,
  IsAuthorizedInput,
  IsAuthorizedOutput,
  VerifiedPermissions
} from "@aws-sdk/client-verifiedpermissions";
import {environment} from "../environments/environment";

const client = new VerifiedPermissions({
  region: 'eu-west-1',
  credentials: {
    accessKeyId: environment.ACCESSKEYID,
    secretAccessKey: environment.SECRETACCESSKEY
  }
});

export async function isAuthorizedFor(feature: string, action: string, group: string) {
  return await _isAuthorized(
    {
      entityType: 'SmartArbitrage::Team',
      entityId: group
    },
    {
      // default resource example
      entityType: `SmartArbitrage::Feature`,
      entityId: feature,
    },
    {
      actionType: 'SmartArbitrage::Action',
      actionId: action,
    },
  );
}

async function _isAuthorized(
  principal: EntityIdentifier,
  resource: EntityIdentifier,
  action: ActionIdentifier,
) {
  try {
    let isAuthorizedInput: IsAuthorizedInput = {
      policyStoreId: environment.POLICYSTOREID,
      principal: principal,
      resource: resource,
      action: action,
    };
    const result: IsAuthorizedOutput = await client
      .isAuthorized(isAuthorizedInput)

    console.log('authorized', result);
    return result.decision!.toLowerCase() == 'allow';

  } catch (err) {
    console.log('Failed handling isAuthorized using AVP, err: ' + err);
    console.log(JSON.stringify(err));

    return false;
  }
}
