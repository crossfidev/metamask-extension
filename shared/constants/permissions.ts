export const CaveatTypes = Object.freeze({
  restrictReturnedAccounts: 'restrictReturnedAccounts' as const,
  restrictNetworkSwitching: 'restrictNetworkSwitching' as const,
});

export const RestrictedMethods = Object.freeze({
  eth_accounts: 'eth_accounts',
  ///: BEGIN:ONLY_INCLUDE_IF(snaps)
  snap_dialog: 'snap_dialog',
  snap_notify: 'snap_notify',
  snap_manageState: 'snap_manageState',
  snap_getBip32PublicKey: 'snap_getBip32PublicKey',
  snap_getBip32Entropy: 'snap_getBip32Entropy',
  snap_getBip44Entropy: 'snap_getBip44Entropy',
  snap_getEntropy: 'snap_getEntropy',
  snap_getLocale: 'snap_getLocale',
  wallet_snap: 'wallet_snap',
  ///: END:ONLY_INCLUDE_IF
  ///: BEGIN:ONLY_INCLUDE_IF(keyring-snaps)
  snap_manageAccounts: 'snap_manageAccounts',
  ///: END:ONLY_INCLUDE_IF
} as const);

///: BEGIN:ONLY_INCLUDE_IF(snaps)
// ConnectionPermission is pseudo permission used to make possible
// displaying pre-approved connections in the UI seamlessly, alongside other permissions.
export const ConnectionPermission = Object.freeze({
  connection_permission: 'connection_permission',
});

// This configuration specifies permission weight thresholds used to determine which
// permissions to show or hide on certain Snap-related flows (Install, Update, etc.)
export const PermissionWeightThreshold = Object.freeze({
  snapInstall: 3 as const,
  snapUpdateApprovedPermissions: 2 as const,
});
///: END:ONLY_INCLUDE_IF

///: BEGIN:ONLY_INCLUDE_IF(snaps)
export * from './snaps/permissions';
///: END:ONLY_INCLUDE_IF
