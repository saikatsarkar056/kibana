import React from 'react';
import { TextExpansionCallOutState, TextExpansionDismissButton } from './text_expansion_callout';
import { useActions } from 'kea';
import { TextExpansionCalloutLogic } from './text_expansion_callout_logic';
import {
  EuiBadge,
  EuiButton,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiText,
} from '@elastic/eui';
import { FormattedMessage, FormattedHTMLMessage } from '@kbn/i18n-react';
import { i18n } from '@kbn/i18n';
import { docLinks } from '../../../../../shared/doc_links';

export const DeployModel = ({
  dismiss,
  ingestionMethod,
  isCreateButtonDisabled,
  isDismissable,
}: Pick<
  TextExpansionCallOutState,
  'dismiss' | 'ingestionMethod' | 'isCreateButtonDisabled' | 'isDismissable'
>) => {
  const { createTextExpansionModel } = useActions(TextExpansionCalloutLogic);

  return (
    <EuiCallOut color="success">
      <EuiFlexGroup direction="column" gutterSize="s">
        <EuiFlexItem>
          <EuiFlexGroup direction="row" gutterSize="s" alignItems="center">
            <EuiFlexItem grow={false}>
              <EuiBadge color="success">
                <FormattedMessage
                  id="xpack.enterpriseSearch.content.index.pipelines.textExpansionCallOut.titleBadge"
                  defaultMessage="New"
                />
              </EuiBadge>
            </EuiFlexItem>
            <EuiFlexItem grow>
              <EuiText color="success" size="xs">
                <h3>
                  {i18n.translate(
                    'xpack.enterpriseSearch.content.index.pipelines.textExpansionCallOut.title',
                    { defaultMessage: 'Improve your results with ELSER' }
                  )}
                </h3>
              </EuiText>
            </EuiFlexItem>
            {isDismissable && (
              <EuiFlexItem grow={false}>
                <TextExpansionDismissButton dismiss={dismiss} />
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFlexGroup direction="column">
            <EuiFlexItem>
              <EuiText size="s">
                <FormattedHTMLMessage
                  id="xpack.enterpriseSearch.content.index.pipelines.textExpansionCallOut.body"
                  defaultMessage="ELSER (Elastic Learned Sparse EncodeR) is our <strong>new trained machine learning model</strong> designed to efficiently use context in natural language queries. This model delivers better results than BM25 without further training on your data."
                  tagName="p"
                />
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGroup
                direction="row"
                gutterSize="m"
                alignItems="center"
                justifyContent="flexStart"
              >
                <EuiFlexItem grow={false}>
                  <EuiButton
                    color="success"
                    data-telemetry-id={`entSearchContent-${ingestionMethod}-pipelines-textExpansionCallOut-deployModel`}
                    disabled={isCreateButtonDisabled}
                    iconType="launch"
                    onClick={() => createTextExpansionModel(undefined)}
                  >
                    {i18n.translate(
                      'xpack.enterpriseSearch.content.indices.pipelines.textExpansionCallOut.deployButton.label',
                      {
                        defaultMessage: 'Deploy',
                      }
                    )}
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiLink target="_blank" href={docLinks.elser}>
                    <FormattedMessage
                      id="xpack.enterpriseSearch.content.index.pipelines.textExpansionCallOut.learnMoreLink"
                      defaultMessage="Learn more"
                    />
                  </EuiLink>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiCallOut>
  );
};
