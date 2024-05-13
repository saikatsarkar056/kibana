/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { DEFAULT_INITIAL_APP_DATA } from '../../../common/__mocks__';
import { setMockValues } from '../__mocks__/kea_logic';
import '../__mocks__/shallow_useeffect.mock';
import '../__mocks__/enterprise_search_url.mock';

import React from 'react';

import { shallow } from 'enzyme';

import { SetupGuide } from '../enterprise_search_overview/components/setup_guide';
import { VersionMismatchPage } from '../shared/version_mismatch';

import { InferenceEndpointsRouter } from './components/inference_endpoints/inference_endpoints_router';

import { EnterpriseSearchRelevance, EnterpriseSearchRelevanceConfigured } from '.';

describe('EnterpriseSearchRelevance', () => {
  it('always renders the Setup Guide', () => {
    const wrapper = shallow(<EnterpriseSearchRelevance />);

    expect(wrapper.find(SetupGuide)).toHaveLength(1);
  });

  it('renders VersionMismatchPage when there are mismatching versions', () => {
    setMockValues({ config: { canDeployEntSearch: true, host: 'host' } });
    const wrapper = shallow(
      <EnterpriseSearchRelevance enterpriseSearchVersion="7.15.0" kibanaVersion="7.16.0" />
    );

    expect(wrapper.find(VersionMismatchPage)).toHaveLength(1);
  });

  it('renders EnterpriseSearchRelevanceConfigured when config.host is set & available', () => {
    setMockValues({
      config: { canDeployEntSearch: true, host: 'some.url' },
      errorConnectingMessage: '',
    });
    const wrapper = shallow(<EnterpriseSearchRelevance />);

    expect(wrapper.find(EnterpriseSearchRelevanceConfigured)).toHaveLength(1);
  });

  it('renders EnterpriseSearchRelevanceConfigured when config.host is not set & Ent Search cannot be deployed', () => {
    setMockValues({ config: { canDeployEntSearch: false, host: '' }, errorConnectingMessage: '' });
    const wrapper = shallow(<EnterpriseSearchRelevance />);

    expect(wrapper.find(EnterpriseSearchRelevanceConfigured)).toHaveLength(1);
  });
});

describe('EnterpriseSearchRelevanceConfigured', () => {
  const wrapper = shallow(<EnterpriseSearchRelevanceConfigured {...DEFAULT_INITIAL_APP_DATA} />);

  it('renders engine routes', () => {
    expect(wrapper.find(InferenceEndpointsRouter)).toHaveLength(1);
  });
});
