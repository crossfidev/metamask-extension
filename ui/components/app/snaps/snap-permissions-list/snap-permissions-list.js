import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import { Box, ButtonLink } from '../../../component-library';
import { getMultipleTargetsSubjectMetadata } from '../../../../selectors';
import {
  Display,
  FlexDirection,
  JustifyContent,
} from '../../../../helpers/constants/design-system';
import SnapPermissionAdapter from '../snap-permission-adapter';
import { PermissionWeightThreshold } from '../../../../../shared/constants/permissions';

export default function SnapPermissionsList({
  snapId,
  snapName,
  permissions,
  connections,
  showOptions,
}) {
  const t = useI18nContext();
  const permissionsToShow = useMemo(() => {
    return { ...permissions, connection_permission: connections ?? {} };
  }, [permissions, connections]);
  const targetSubjectsMetadata = useSelector((state) =>
    getMultipleTargetsSubjectMetadata(state, connections),
  );
  const [showAll, setShowAll] = useState(false);
  const [permissionsToDisplay, setPermissionsToDisplay] = useState([]);

  if (permissions.length <= 3) {
    setShowAll(true);
  }

  useEffect(() => {
    if (showAll) {
      setPermissionsToDisplay(
        <SnapPermissionAdapter
          permissions={permissionsToShow}
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
          permissions={permissionsToShow}
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
    permissionsToShow,
    snapId,
    snapName,
    targetSubjectsMetadata,
    showOptions,
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
};
