import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import { Box, ButtonLink } from '../../../component-library';
import {
  getMultipleTargetsSubjectMetadata,
  getSnapMetadata,
  getSnapsMetadata,
} from '../../../../selectors';
import SnapPermissionAdapter from '../snap-permission-adapter';
import {
  Display,
  JustifyContent,
} from '../../../../helpers/constants/design-system';
import { PermissionWeightThreshold } from '../../../../../shared/constants/permissions';
import { getSnapName } from '../../../../helpers/utils/util';
import { getWeightedPermissions } from '../../../../helpers/utils/permission';

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

  const snapsMetadata = useSelector(getSnapsMetadata);

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

  const newWeightedPermissions = getWeightedPermissions({
    t,
    permissions: newPermissionsToShow,
    subjectName: snapName,
    getSubjectName: getSnapName(snapsMetadata),
  });

  const revokedWeightedPermissions = getWeightedPermissions({
    t,
    permissions: revokedPermissionsToShow,
    subjectName: snapName,
    getSubjectName: getSnapName(snapsMetadata),
  });

  const approvedWeightedPermissions = useMemo(() => {
    return getWeightedPermissions({
      t,
      permissions: approvedPermissionsToShow,
      subjectName: snapName,
      getSubjectName: getSnapName(snapsMetadata),
    });
  }, [t, approvedPermissionsToShow, snapName, snapsMetadata]);

  useEffect(() => {
    // If there are no approved permissions to show, then hide "See all" button-link
    if (Object.keys(approvedWeightedPermissions).length < 1 && !showAll) {
      setShowAll(true);
    }

    if (showAll) {
      setApprovedPermissionsToDisplay(
        <SnapPermissionAdapter
          permissions={approvedWeightedPermissions}
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
          permissions={approvedWeightedPermissions}
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
    approvedWeightedPermissions,
    snapId,
    snapName,
    targetSubjectsMetadata,
  ]);

  return (
    <Box>
      <SnapPermissionAdapter
        permissions={newWeightedPermissions}
        snapId={snapId}
        snapName={snapName}
        targetSubjectsMetadata={targetSubjectsMetadata}
        weightThreshold={Infinity}
      />
      <SnapPermissionAdapter
        permissions={revokedWeightedPermissions}
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
          paddingTop={2}
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
