import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import { Box, ButtonLink } from '../../../component-library';
import {
  getMultipleTargetsSubjectMetadata,
  getSnapMetadata,
} from '../../../../selectors';
import SnapPermissionAdapter from '../snap-permission-adapter';
import {
  Display,
  JustifyContent,
} from '../../../../helpers/constants/design-system';
import { PermissionWeightThreshold } from '../../../../../shared/constants/permissions';

export default function UpdateSnapPermissionList({
  approvedPermissions,
  revokedPermissions,
  newPermissions,
  approvedConnections,
  revokedConnections,
  newConnections,
  targetSubjectMetadata,
}) {
  const t = useI18nContext();
  const snapId = targetSubjectMetadata.origin;

  const { name: snapName } = useSelector((state) =>
    getSnapMetadata(state, targetSubjectMetadata.origin),
  );

  const targetSubjectsMetadata = useSelector((state) =>
    getMultipleTargetsSubjectMetadata(state, {
      ...newConnections,
      ...approvedConnections,
      ...revokedConnections,
    }),
  );

  const approvedPermissionsToShow = useMemo(() => {
    return {
      ...approvedPermissions,
      connection_permission: approvedConnections ?? {},
    };
  }, [approvedPermissions, approvedConnections]);

  const revokedPermissionsToShow = {
    ...revokedPermissions,
    connection_permission: revokedConnections ?? {},
  };

  const newPermissionsToShow = {
    ...newPermissions,
    connection_permission: newConnections ?? {},
  };

  const [showAll, setShowAll] = useState(false);

  const [approvedPermissionsToDisplay, setApprovedPermissionsToDisplay] =
    useState([]);

  const showAllPermissions = () => {
    setShowAll(true);
  };

  useEffect(() => {
    if (showAll) {
      setApprovedPermissionsToDisplay(
        <SnapPermissionAdapter
          permissions={approvedPermissionsToShow}
          snapId={snapId}
          snapName={snapName}
          targetSubjectsMetadata={targetSubjectsMetadata}
          weightThreshold={Infinity}
          approved
        />,
      );
    } else {
      setApprovedPermissionsToDisplay(
        <SnapPermissionAdapter
          permissions={approvedPermissionsToShow}
          snapId={snapId}
          snapName={snapName}
          targetSubjectsMetadata={targetSubjectsMetadata}
          weightThreshold={
            PermissionWeightThreshold.snapUpdateApprovedPermissions
          }
          approved
        />,
      );
    }
  }, [
    showAll,
    setApprovedPermissionsToDisplay,
    approvedPermissionsToShow,
    snapId,
    snapName,
    targetSubjectsMetadata,
  ]);

  return (
    <Box>
      <SnapPermissionAdapter
        permissions={newPermissionsToShow}
        snapId={snapId}
        snapName={snapName}
        targetSubjectsMetadata={targetSubjectsMetadata}
        weightThreshold={Infinity}
      />
      <SnapPermissionAdapter
        permissions={revokedPermissionsToShow}
        snapId={snapId}
        snapName={snapName}
        targetSubjectsMetadata={targetSubjectsMetadata}
        weightThreshold={Infinity}
        revoked
      />
      <Box className="snap-permissions-list">
        {approvedPermissionsToDisplay}
      </Box>
      {showAll ? null : (
        <Box
          display={Display.Flex}
          justifyContent={JustifyContent.center}
          paddingBottom={2}
        >
          <ButtonLink onClick={() => showAllPermissions()}>
            {t('seeAllPermissions')}
          </ButtonLink>
        </Box>
      )}
    </Box>
  );
}

UpdateSnapPermissionList.propTypes = {
  /**
   * Permissions that have already been approved
   */
  approvedPermissions: PropTypes.object.isRequired,
  /**
   * Previously used permissions that are now revoked
   */
  revokedPermissions: PropTypes.object.isRequired,
  /**
   * New permissions that are being requested
   */
  newPermissions: PropTypes.object.isRequired,
  /**
   * Pre-approved connections that have already been approved
   */
  approvedConnections: PropTypes.object.isRequired,
  /**
   * Previously used pre-approved connections that are now revoked
   */
  revokedConnections: PropTypes.object.isRequired,
  /**
   * New pre-approved connections that are being requested
   */
  newConnections: PropTypes.object.isRequired,
  targetSubjectMetadata: PropTypes.object.isRequired,
};
