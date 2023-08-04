/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { setMockValues } from '../../../../../__mocks__/kea_logic';
import React from 'react';
import { shallow } from 'enzyme';
import { EuiButton } from '@elastic/eui';
import { TextExpansionDismissButton } from './text_expansion_callout';
import { DeployModel } from './deploy_model';

const DEFAULT_VALUES = {
  startTextExpansionModelError: undefined,
  isCreateButtonDisabled: false,
  isModelDownloadInProgress: false,
  isModelDownloaded: false,
  isModelStarted: false,
  isStartButtonDisabled: false,
};

describe('DeployModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setMockValues(DEFAULT_VALUES);
  });
  it('renders deploy button', () => {
    const wrapper = shallow(
      <DeployModel
        dismiss={() => {}}
        ingestionMethod="crawler"
        isCreateButtonDisabled={false}
        isDismissable={false}
      />
    );
    expect(wrapper.find(EuiButton).length).toBe(1);
    const button = wrapper.find(EuiButton);
    expect(button.prop('disabled')).toBe(false);
  });
  it('renders disabled deploy button if it is set to disabled', () => {
    const wrapper = shallow(
      <DeployModel
        dismiss={() => {}}
        ingestionMethod="crawler"
        isCreateButtonDisabled
        isDismissable={false}
      />
    );
    expect(wrapper.find(EuiButton).length).toBe(1);
    const button = wrapper.find(EuiButton);
    expect(button.prop('disabled')).toBe(true);
  });
  it('renders dismiss button if it is set to dismissable', () => {
    const wrapper = shallow(
      <DeployModel
        dismiss={() => {}}
        ingestionMethod="crawler"
        isCreateButtonDisabled={false}
        isDismissable
      />
    );
    expect(wrapper.find(TextExpansionDismissButton).length).toBe(1);
  });
  it('does not render dismiss button if it is set to non-dismissable', () => {
    const wrapper = shallow(
      <DeployModel
        dismiss={() => {}}
        ingestionMethod="crawler"
        isCreateButtonDisabled={false}
        isDismissable={false}
      />
    );
    expect(wrapper.find(TextExpansionDismissButton).length).toBe(0);
  });
});
