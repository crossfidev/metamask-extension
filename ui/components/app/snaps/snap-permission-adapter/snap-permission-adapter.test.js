import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProvider } from '../../../../../test/jest';
import configureStore from '../../../../store/store';
import { PermissionWeightThreshold } from '../../../../../shared/constants/permissions';
import SnapPermissionAdapter from './snap-permission-adapter';

describe('Snap Permission List', () => {
  const mockSnapId = 'mock-snap-id';
  const mockSnapName = 'Snap Name';
  const mockPermissionData = {
    snap_dialog: {
      caveats: null,
      date: 1680709920602,
      id: '4dduR1BpsmS0ZJfeVtiAh',
      invoker: 'local:http://localhost:8080',
      parentCapability: 'snap_dialog',
    },
    'endowment:network-access': {
      caveats: null,
      date: null,
      id: '5dduR1BpsmS0ZJfeVtiAh',
      invoker: 'local:http://localhost:8080',
      parentCapability: 'endowment:network-access',
    },
  };
  const mockTargetSubjectMetadata = {
    extensionId: null,
    iconUrl: null,
    name: 'TypeScript Example Snap',
    origin: 'local:http://localhost:8080',
    subjectType: 'snap',
    version: '0.2.2',
  };
  const mockState = {
    metamask: {
      subjectMetadata: {
        'npm:@metamask/notifications-example-snap': {
          name: 'Notifications Example Snap',
          version: '1.2.3',
          subjectType: 'snap',
        },
      },
      snaps: {
        'npm:@metamask/notifications-example-snap': {
          id: 'npm:@metamask/notifications-example-snap',
          version: '1.2.3',
          manifest: {
            proposedName: 'Notifications Example Snap',
            description: 'A snap',
          },
        },
      },
    },
  };

  const store = configureStore(mockState);

  it('renders only permissions with weight less than 3', () => {
    renderWithProvider(
      <SnapPermissionAdapter
        snapId={mockSnapId}
        snapName={mockSnapName}
        permissions={mockPermissionData}
        targetSubjectsMetadata={{ ...mockTargetSubjectMetadata }}
        weightThreshold={PermissionWeightThreshold.snapInstall}
      />,
      store,
    );
    expect(
      screen.queryByText('Display dialog windows in MetaMask.'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Approved on 2023-04-05'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Access the internet.')).toBeInTheDocument();
    expect(screen.queryByText('Requested now')).toBeInTheDocument();
  });
});
