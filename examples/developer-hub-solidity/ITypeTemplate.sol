// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6 <0.9;

///////////////////////////////////////////////////////////////////
// DO NOT CHANGE Request and Response definitions!!!
///////////////////////////////////////////////////////////////////

/**
 * @custom:name TypeTemplate
 * @custom:supported BTC
 * @author <author of the type>
 * @notice <description of the type>
 * @custom:verification <general verification rules>
 * @custom:lut <lowestUsedTimestamp>
 */
interface ITypeTemplate {
    /**
     * @notice Toplevel request
     * @param attestationType ID of the attestation type.
     * @param sourceId ID of the data source.
     * @param messageIntegrityCode `MessageIntegrityCode` that is derived from the expected response.
     * @param requestBody Data defining the request. Type (struct) and interpretation is determined by the `attestationType`.
     */
    struct Request {
        bytes32 attestationType;
        bytes32 sourceId;
        bytes32 messageIntegrityCode;
        RequestBody requestBody;
    }

    /**
     * @notice Toplevel response
     * @param attestationType Extracted from the request.
     * @param sourceId Extracted from the request.
     * @param votingRound The ID of the State Connector round in which the request was considered.
     * @param lowestUsedTimestamp The lowest timestamp used to generate the response.
     * @param requestBody Extracted from the request.
     * @param responseBody Data defining the response. The verification rules for the construction of the response body and the type are defined per specific `attestationType`.
     */
    struct Response {
        bytes32 attestationType;
        bytes32 sourceId;
        uint64 votingRound;
        uint64 lowestUsedTimestamp;
        RequestBody requestBody;
        ResponseBody responseBody;
    }

    /**
     * @notice Toplevel proof
     * @param merkleProof Merkle proof corresponding to the attestation response.
     * @param data Attestation response.
     */
    struct Proof {
        bytes32[] merkleProof;
        Response data;
    }

    /**
     * @notice Request body for TypeTemplate attestation type
     * @param bytes32Field example bytes32 field with explanation
     * @param boolField example bool field field with explanation
     * @param requestSubstruct1 example RequestSubstruct1 field with explanation
     * @param requestSubstruct2Array example RequestSubstruct2 array field with explanation
     **/
    struct RequestBody {
        bytes32 bytes32Field;
        bool boolField;
        RequestSubstruct1 requestSubstruct1;
        RequestSubstruct2[] requestSubstruct2Array;
    }

    /**
     * @notice Additional struct first used in Request body fields
     * @param templateStructField example bytes32 field with explanation
     * @param uintArrayField example uint256 array field with explanation
     * @param boolArrayField example bool array field with explanation
     **/
    struct RequestSubstruct1 {
        bytes32 templateStructField;
        uint256[] uintArrayField;
        bool[] boolArrayField;
    }

    /**
     * @notice Additional struct first used in Request body fields
     * @param templateStructField example bytes32 field with explanation
     * @param intArrayField example int256 array field with explanation
     * @param boolArrayField example bool array field with explanation
     **/
    struct RequestSubstruct2 {
        bytes32 templateStructField;
        int256[] intArrayField;
        bool[] boolArrayField;
    }

    /**
     * @notice Response body for TypeTemplate attestation type.
     * @param templateResponseField example bytes32 field with explanation
     * @param responseSubstruct1Array example ResponseSubstruct1 array field with explanation
     **/
    struct ResponseBody {
        // define the rest of the fields here ...
        bytes32 templateResponseField;
        ResponseSubstruct1[] responseSubstruct1Array;
    }

    /**
     * @notice Additional struct first used in Response body fields
     * @param templateStructField description
     **/
    struct ResponseSubstruct1 {
        bytes32 templateStructField;
    }
}
