/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type {
  EuiTableComputedColumnType,
  EuiContextMenuPanelDescriptor,
  EuiContextMenuPanelItemDescriptor,
} from '@elastic/eui';
import { EuiButtonIcon, EuiContextMenu, EuiPopover } from '@elastic/eui';
import React, { useCallback, useMemo, useState } from 'react';
import { InferenceEndpointUI } from './types';
import { useCopyIDAction } from './actions/copy_id/use_copy_id_action';
import { useDeleteAction } from './actions/delete/use_delete_action';
import { ConfirmDeleteEndpointModal } from './confirm_delete_endpoint';

const ActionColumnComponent: React.FC<{ interfaceEndpoint: InferenceEndpointUI }> = ({
  interfaceEndpoint,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const tooglePopover = useCallback(() => setIsPopoverOpen(!isPopoverOpen), [isPopoverOpen]);
  const closePopover = useCallback(() => setIsPopoverOpen(false), []);
  const refreshCases = () => {};

  const copyIDAction = useCopyIDAction({
    onActionSuccess: closePopover,
  });

  const deleteAction = useDeleteAction({
    onAction: closePopover,
    onActionSuccess: refreshCases,
  });

  const panels = useMemo((): EuiContextMenuPanelDescriptor[] => {
    const mainPanelItems: EuiContextMenuPanelItemDescriptor[] = [];
    const panelsToBuild: EuiContextMenuPanelDescriptor[] = [
      { id: 0, items: mainPanelItems, title: 'Actions' },
    ];

    mainPanelItems.push(copyIDAction.getAction(interfaceEndpoint));
    mainPanelItems.push(deleteAction.getAction(interfaceEndpoint));

    return panelsToBuild;
  }, [copyIDAction, deleteAction, interfaceEndpoint]);

  return (
    <>
      <EuiPopover
        id={`inference-action-popover-${interfaceEndpoint.endpoint}`}
        key={`inference-action-popover-${interfaceEndpoint.endpoint}`}
        data-test-subj={`inference-action-popover-${interfaceEndpoint.endpoint}`}
        button={
          <EuiButtonIcon
            onClick={tooglePopover}
            iconType="boxesHorizontal"
            aria-label={'Actions'}
            color="text"
            key={`inference-action-popover-button-${interfaceEndpoint.endpoint}`}
            data-test-subj={`inference-action-popover-button-${interfaceEndpoint.endpoint}`}
            disabled={false}
          />
        }
        isOpen={isPopoverOpen}
        closePopover={closePopover}
        panelPaddingSize="none"
        anchorPosition="downLeft"
      >
        <EuiContextMenu
          initialPanelId={0}
          panels={panels}
          key={`inference-action-menu-${interfaceEndpoint.endpoint}`}
          data-test-subj={`inference-action-menu-${interfaceEndpoint.endpoint}`}
        />
      </EuiPopover>
      {deleteAction.isModalVisible ? (
        <ConfirmDeleteEndpointModal
          onCancel={deleteAction.onCloseModal}
          onConfirm={deleteAction.onConfirmDeletion}
        />
      ) : null}
    </>
  );
};

ActionColumnComponent.displayName = 'ActionColumnComponent';

const ActionColumn = React.memo(ActionColumnComponent);

interface UseBulkActionsReturnValue {
  actions: EuiTableComputedColumnType<InferenceEndpointUI>;
}

export const useActions = (): UseBulkActionsReturnValue => {
  return {
    actions: {
      name: 'Actions',
      align: 'right',
      render: (interfaceEndpoint: InferenceEndpointUI) => {
        return (
          <ActionColumn
            interfaceEndpoint={interfaceEndpoint}
            key={interfaceEndpoint.endpoint.model_id}
          />
        );
      },
      width: '100px',
    },
  };
};
