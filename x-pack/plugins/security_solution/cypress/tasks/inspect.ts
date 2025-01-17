/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { InspectLensVisualizationsMetadata, InspectTableMetadata } from '../screens/inspect';
import {
  EMBEDDABLE_PANEL_INSPECT,
  EMBEDDABLE_PANEL_TOGGLE_ICON,
  INSPECT_BUTTON_ICON,
} from '../screens/inspect';

export const closesModal = () => {
  cy.get('[data-test-subj="modal-inspect-close"]').click();
};

export const clickInspectButton = (container: string) => {
  cy.get(`${container} ${INSPECT_BUTTON_ICON}`).should('exist');
  cy.get(`${container} ${INSPECT_BUTTON_ICON}`).invoke('show');
  cy.get(`${container} ${INSPECT_BUTTON_ICON}`).trigger('click', { force: true });
};

const LOADER_ARIA = '[aria-label="Loading"]';
const TABLE_LOADER = `[data-test-subj="initialLoadingPanelPaginatedTable"],${LOADER_ARIA}`;

export const openTableInspectModal = (table: InspectTableMetadata) => {
  // wait for table to load
  cy.get(table.id).then(($table) => {
    if ($table.find(TABLE_LOADER).length > 0) {
      cy.get(TABLE_LOADER).should('not.exist');
    }
  });

  if (table.altInspectId) {
    cy.get(table.altInspectId).invoke('show');
    cy.get(table.altInspectId).trigger('click', {
      force: true,
    });
  } else {
    clickInspectButton(table.id);
  }
};

export const openLensVisualizationsInspectModal = (
  { panelSelector, embeddableId, tab }: InspectLensVisualizationsMetadata,
  onOpen: () => void
) => {
  cy.get(panelSelector)
    .get(`[data-test-embeddable-id="${embeddableId}"]`)
    .each(($el) => {
      const container = cy.wrap($el);

      // wait for visualization to load
      if ($el.find(LOADER_ARIA).length > 0) {
        cy.get(LOADER_ARIA).should('not.exist');
      }

      container.find(EMBEDDABLE_PANEL_TOGGLE_ICON).click();
      cy.get(EMBEDDABLE_PANEL_INSPECT).click();

      onOpen();

      closesModal();
    });
};

export const openTab = (tab: string) => {
  cy.get(tab).invoke('show');
  cy.get(tab).click({ force: true });
};
