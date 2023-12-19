import {Injectable} from '@angular/core';
import {
  Decision,
  IsAuthorizedCommand,
  IsAuthorizedInput,
  VerifiedPermissionsClient
} from "@aws-sdk/client-verifiedpermissions";
import {environment} from "../environments/environment";
import {Amplify, ResourcesConfig} from "aws-amplify";
import {fetchAuthSession} from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
//


export class AuthorizationService {

  constructor() {
    const authConfig: ResourcesConfig['Auth'] = {
      Cognito: {
        userPoolId: environment.USERPOOLID,
        userPoolClientId: environment.APPCLIENTID
      }
    };

    Amplify.configure({
      Auth: authConfig
    });
  }

  async payload(): Promise<any> {
    try {
      const session = await fetchAuthSession();
      const  tokens = session.tokens ?? {};
      // @ts-ignore
      return tokens.idToken ? tokens.idToken.payload : {}
    } catch (err) {
      throw err;
    }
  }

  async isPermit(action: string, group: string ) {
    const payload = await this.payload();
    // @ts-ignore
    const groups: [string] = payload["cognito:groups"];

    return groups && groups.includes(group);
    /*const accessTokenAndCredentials = await this.accessTokenAndCredentials();
    const policyStoreId = environment.POLICYSTOREID;
    const petId = "dog123"
    const accessToken = accessTokenAndCredentials.accessToken;
    /**
     Define entities structure, this represents the supplementary data to be passed to authorization engine as part of every authorization query
     Entities list include information about users, groups, actions and relationships between these entities, this data is used to guide authorization engine
     This is the initial list of hard-coded entities, in real-world scenarios, these entities will be combination of backend data from database, runtime data
     from application context of environment in addition to user/groups data from user's security token.
     */
    // let entities = {
    //   entityList: [],
    // };

    /*const stores = payload["custom:employmentStoreCode"]?.split(",") || "";

    const authQuery = {
      policyStoreId,
      principal: {
        entityType: "MyApplication::User",
        entityId: payload["cognito:username"],
      },
      action: {
        actionType: "MyApplication::Action",
        actionId:
         action,
      },
      resource: this.buildResource(
        action,
        {orderNumber: 5, petId: 5, storeId: 5}
      ),
      entities,
    };
*/
    /*const x: IsAuthorizedInput = {
      policyStoreId: policyStoreId,
      principal: {
        entityType: "MyApplication::User",
        entityId: accessToken.payload["username"],
      },
      action: {
        actionType: "MyApplication::Action",
        actionId:
          action,
      },
      resource: {
        entityType: "MyApplication::Pet",
        entityId: petId,
      },
      entities: entities,
    }
    const command = new IsAuthorizedCommand(x);
*/
    // try {
      // const client = new VerifiedPermissionsClient({ region: "eu-west-1" , credentialDefaultProvider: accessTokenAndCredentials.credentials});
      // const response = await client.send(command);
      // return (response.decision == Decision.ALLOW);
    // } catch (err) {
    //   throw err;
    // }
  }

  private addResourceEntities(entities: any, action: string, pathParams: any) {

    if (["UpdatePet", "DeletePet"].includes(action)) {
      //pet related action
      entities.entityList.push({
        identifier: {
          entityType: "MyApplication::Pet",
          entityId: pathParams.petId,
        },
        attributes: {
          store: {
            entityIdentifier: {
              entityType: "MyApplication::Store",
              entityId: pathParams.storeId,
            },
          },
        },
      });
    } else if (["GetOrder", "CancelOrder"].includes(action)) {
      //order related action
      entities.entityList.push({
        identifier: {
          entityType: "MyApplication::Order",
          entityId: pathParams.orderNumber,
        },
        attributes: {
          store: {
            entityIdentifier: {
              entityType: "MyApplication::Store",
              entityId: pathParams.storeId,
            },
          },
          owner: {
            // Hardcoding the owner to abhi , this is for demonestration purposes
            entityIdentifier: {
              entityType: "MyApplication::User",
              entityId: "abhi",
            },
          },
        },
      });
    } //application related action
    else
      entities.entityList.push({
        identifier: {
          entityType: "MyApplication::Application",
          entityId: "PetStore",
        },
        attributes: {
          store: {
            entityIdentifier: {
              entityType: "MyApplication::Store",
              entityId: pathParams.storeId,
            },
          },
        },
      });
  }

  //---------helper function to get resource mapping for an action
  private buildResource(action: string, pathParams: any) {
    if (["UpdatePet", "DeletePet"].includes(action)) {
      //pet related action
      return {
        entityType: "MyApplication::Pet",
        entityId: pathParams.petId,
      };
    } else if (["GetOrder", "CancelOrder"].includes(action)) {
      //order related action
      return {
        entityType: "MyApplication::Order",
        entityId: pathParams.orderNumber,
      };
    } else if (["ListOrders"].includes(action)) {
      //order related action
      return {
        entityType: "MyApplication::Store",
        entityId: pathParams.storeId,
      };
    } //application related action
    else
      return { entityType: "MyApplication::Application", entityId: "PetStore" };
  }

}
