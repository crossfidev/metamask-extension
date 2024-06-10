import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getWeightedPermissions } from '../../../../helpers/utils/permission';
import { getSnapName } from '../../../../helpers/utils/util';
import SnapPermissionCell from '../snap-permission-cell';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import { getSnapsMetadata } from '../../../../selectors';

export default function SnapPermissionAdapter({
  snapId,
  snapName,
  permissions,
  showOptions,
  targetSubjectsMetadata,
  weightThreshold,
  revoked,
  approved,
}) {
  const t = useI18nContext();
  const snapsMetadata = useSelector(getSnapsMetadata);

  return getWeightedPermissions({
    t,
    permissions,
    subjectName: snapName,
    getSubjectName: getSnapName(snapsMetadata),
  })
    .filter((permission) => permission.weight <= weightThreshold ?? Infinity)
    .map((permission, index) => (
      <SnapPermissionCell
        snapId={snapId}
        showOptions={showOptions}
        connectionSubjectMetadata={
          targetSubjectsMetadata[permission.connection]
        }
        permission={permission}
        index={index}
        key={`permissionCellDisplay_${snapId}_${index}`}
        revoked={revoked}
        approved={approved}
      />
    ));
}

SnapPermissionAdapter.propTypes = {
  snapId: PropTypes.string.isRequired,
  snapName: PropTypes.string.isRequired,
  permissions: PropTypes.object.isRequired,
  showOptions: PropTypes.bool,
  targetSubjectsMetadata: PropTypes.object,
  weightThreshold: PropTypes.number,
  revoked: PropTypes.bool,
  approved: PropTypes.bool,
};
