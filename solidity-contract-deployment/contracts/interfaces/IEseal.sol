// SPDX-License-Identifier: Hedera Foundation

pragma solidity ^0.8.15;

contract IEseal {

    /**
     * @dev
     * struct which stores a single seal
     */
    struct Seal {
        uint256 sealingBlock;
        uint256 revokingBlock;
        address sealOwner;
    }

    /**
     * @dev
     * public function to create a seal if the hash has not been used before
     * @param hash is the hash to check
     */
    function seal(string calldata hash) external;

    /**
     * @dev
     * public getter which retrieves a seal object to a given hash (if existing)
     * @param hash is the hash to check
     */
    function getSeal(string calldata hash) external view returns (Seal memory _seal);

    /**
     * @dev
     * public function which allows the user to check if a seal has been revoked
     * @param hash is the hash to check
     */
    function checkSealRevocationStatus(string calldata hash) external view returns (bool);

    /**
     * @dev
     * public function which allows the owner of a seal to revoke it
     * @param hash is the hash to revoke
     */
    function revokeSeal(string calldata hash) external;

}
