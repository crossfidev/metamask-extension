import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import { Box, ButtonLink } from '../../../component-library';
import {
  getMultipleTargetsSubjectMetadata,
  getSnapsMetadata,
} from '../../../../selectors';
import {
  Display,
  FlexDirection,
  JustifyContent,
} from '../../../../helpers/constants/design-system';
import SnapPermissionAdapter from '../snap-permission-adapter';
import { PermissionWeightThreshold } from '../../../../../shared/constants/permissions';
import { getSnapName } from '../../../../helpers/utils/util';
import { getWeightedPermissions } from '../../../../helpers/utils/permission';

export default function SnapPermissionsList({
  snapId,
  snapName,
  permissions,
  connections,
  showOptions,
  turnOffAbstraction,
}) {
  const t = useI18nContext();

  const permissionsToShow = useMemo(() => {
    return { ...permissions, connection_permission: connections ?? {} };
  }, [permissions, connections]);

  const targetSubjectsMetadata = useSelector((state) =>
    getMultipleTargetsSubjectMetadata(state, connections),
  );

  const snapsMetadata = useSelector(getSnapsMetadata);

  const [showAll, setShowAll] = useState(false);

  const [permissionsToDisplay, setPermissionsToDisplay] = useState([]);

  const [weightedPermissions, setWeightedPermissions] = useState({});

  useEffect(() => {
    let finalPermissions = weightedPermissions;
    if (Object.keys(finalPermissions).length === 0) {
      finalPermissions = getWeightedPermissions({
        t,
        permissions: permissionsToShow,
        subjectName: snapName,
        getSubjectName: getSnapName(snapsMetadata),
      });
      setWeightedPermissions(finalPermissions);
    }

    if (turnOffAbstraction) {
      setShowAll(true);
    }

    if (Object.keys(finalPermissions).length <= 3 && !showAll) {
      setShowAll(true);
    }

    if (showAll) {
      setPermissionsToDisplay(
        <SnapPermissionAdapter
          permissions={finalPermissions}
          snapId={snapId}
          snapName={snapName}
          targetSubjectsMetadata={targetSubjectsMetadata}
          showOptions={showOptions}
          weightThreshold={Infinity}
        />,
      );
    } else {
      setPermissionsToDisplay(
        <SnapPermissionAdapter
          permissions={finalPermissions}
          snapId={snapId}
          snapName={snapName}
          targetSubjectsMetadata={targetSubjectsMetadata}
          showOptions={showOptions}
          weightThreshold={PermissionWeightThreshold.snapInstall}
        />,
      );
    }
  }, [
    showAll,
    setPermissionsToDisplay,
    weightedPermissions,
    setWeightedPermissions,
    snapId,
    snapName,
    targetSubjectsMetadata,
    showOptions,
    permissionsToShow,
    t,
    snapsMetadata,
    permissions,
    connections,
  ]);

  const showAllPermissions = () => {
    setShowAll(true);
  };

  return (
    <Box display={Display.Flex} flexDirection={FlexDirection.Column}>
      <Box className="snap-permissions-list">{permissionsToDisplay}</Box>
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

SnapPermissionsList.propTypes = {
  snapId: PropTypes.string.isRequired,
  snapName: PropTypes.string.isRequired,
  permissions: PropTypes.object.isRequired,
  connections: PropTypes.object,
  showOptions: PropTypes.bool,
  turnOffAbstraction: PropTypes.bool,
};
