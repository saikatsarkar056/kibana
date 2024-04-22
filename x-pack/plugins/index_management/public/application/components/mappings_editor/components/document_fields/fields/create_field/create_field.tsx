/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiOutsideClickDetector,
  EuiSpacer,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { MlPluginStart } from '@kbn/ml-plugin/public';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useComponentTemplatesContext } from '../../../../../component_templates/component_templates_context';
import { EUI_SIZE, TYPE_DEFINITION } from '../../../../constants';
import { fieldSerializer } from '../../../../lib';
import { useDispatch, useMappingsState } from '../../../../mappings_state_context';
import {
  Form,
  FormDataProvider,
  FormHook,
  UseField,
  useForm,
  useFormData,
} from '../../../../shared_imports';
import { Field, MainType, NormalizedFields } from '../../../../types';
import { NameParameter, SubTypeParameter, TypeParameter } from '../../field_parameters';
import { ReferenceFieldSelects } from '../../field_parameters/reference_field_selects';
import { SelectInferenceId } from '../../field_parameters/select_inference_id';
import { FieldBetaBadge } from '../field_beta_badge';
import { getRequiredParametersFormForType } from './required_parameters_forms';

const formWrapper = (props: any) => <form {...props} />;
export interface InferenceToModelIdMap {
  [key: string]: {
    trainedModelId?: string;
    isDeployed: boolean;
    isDeployable: boolean;
    defaultInferenceEndpoint: boolean;
  };
}

export interface SemanticTextInfo {
  isSemanticTextEnabled?: boolean;
  indexName?: string;
  ml?: MlPluginStart;
  setErrorsInTrainedModelDeployment: React.Dispatch<React.SetStateAction<string[]>>;
}
interface Props {
  allFields: NormalizedFields['byId'];
  isRootLevelField: boolean;
  isMultiField?: boolean;
  paddingLeft?: number;
  isCancelable?: boolean;
  maxNestedDepth?: number;
  onCancelAddingNewFields?: () => void;
  isAddingFields?: boolean;
  semanticTextInfo?: SemanticTextInfo;
}

const useFieldEffect = (
  form: FormHook,
  fieldName: string,
  setState: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  const fieldValue = form.getFields()?.[fieldName]?.value;
  useEffect(() => {
    if (typeof fieldValue === 'string') {
      setState(fieldValue);
    }
  }, [form, fieldValue, setState]);
};

export const CreateField = React.memo(function CreateFieldComponent({
  allFields,
  isRootLevelField,
  isMultiField,
  paddingLeft,
  isCancelable,
  maxNestedDepth,
  onCancelAddingNewFields,
  isAddingFields,
  semanticTextInfo,
}: Props) {
  const { isSemanticTextEnabled, indexName, ml, setErrorsInTrainedModelDeployment } =
    semanticTextInfo ?? {};
  const { inferenceToModelIdMap } = useMappingsState();

  const { toasts } = useComponentTemplatesContext();

  const dispatch = useDispatch();

  const { form } = useForm<Field>({
    serializer: fieldSerializer,
    options: { stripEmptyFields: false },
  });

  useFormData({ form });

  const { subscribe } = form;

  useEffect(() => {
    const subscription = subscribe((updatedFieldForm) => {
      dispatch({ type: 'fieldForm.update', value: updatedFieldForm });
    });

    return subscription.unsubscribe;
  }, [dispatch, subscribe]);

  const cancel = () => {
    if (isAddingFields && onCancelAddingNewFields) {
      onCancelAddingNewFields();
    } else {
      dispatch({ type: 'documentField.changeStatus', value: 'idle' });
    }
  };

  const [referenceFieldComboValue, setReferenceFieldComboValue] = useState<string>();
  const [nameValue, setNameValue] = useState<string>();
  const [inferenceIdComboValue, setInferenceIdComboValue] = useState<string>();
  const [semanticFieldType, setSemanticTextFieldType] = useState<string>();

  const [inferenceValue, setValue] = useState<string>('elser_model_2');
  useFieldEffect(form, 'referenceField', setReferenceFieldComboValue);
  useFieldEffect(form, 'name', setNameValue);

  const fieldTypeValue = form.getFields()?.type?.value;
  useEffect(() => {
    if (!Array.isArray(fieldTypeValue) || fieldTypeValue.length === 0) {
      return;
    }
    setSemanticTextFieldType(
      fieldTypeValue[0]?.value === 'semantic_text' ? fieldTypeValue[0].value : undefined
    );
  }, [form, fieldTypeValue]);

  const inferenceId = form.getFields()?.inferenceId?.value;
  useEffect(() => {
    if (typeof inferenceId === 'string') {
      setInferenceIdComboValue(inferenceId);
    }
  }, [form, inferenceId, inferenceToModelIdMap]);

  const handleSemanticText = (data: Field) => {
    data.inferenceId = inferenceValue;
    if (data.inferenceId === undefined) {
      return;
    }

    const inferenceData = inferenceToModelIdMap?.[data.inferenceId];

    if (!inferenceData) {
      return;
    }

    const { trainedModelId, defaultInferenceEndpoint, isDeployed, isDeployable } = inferenceData;

    if (trainedModelId && defaultInferenceEndpoint) {
      const modelConfig = {
        service: 'elasticsearch',
        service_settings: {
          num_allocations: 1,
          num_threads: 1,
          model_id: trainedModelId,
        },
      };
      ml?.mlApi?.inferenceModels?.createInferenceEndpoint(
        data.inferenceId,
        'text_embedding',
        modelConfig
      );
    }

    if (isDeployable && trainedModelId && !isDeployed) {
      try {
        ml?.mlApi?.trainedModels.startModelAllocation(trainedModelId);
        toasts?.addSuccess({
          title: i18n.translate(
            'xpack.idxMgmt.mappingsEditor.createField.modelDeploymentStartedNotification',
            {
              defaultMessage: 'Model deployment started',
            }
          ),
          text: i18n.translate(
            'xpack.idxMgmt.mappingsEditor.createField.modelDeploymentNotification',
            {
              defaultMessage: '1 model is being deployed on your ml_node.',
            }
          ),
        });
      } catch (error) {
        setErrorsInTrainedModelDeployment?.((prevItems) => [...prevItems, trainedModelId]);
        toasts?.addError(error.body && error.body.message ? new Error(error.body.message) : error, {
          title: i18n.translate(
            'xpack.idxMgmt.mappingsEditor.createField.modelDeploymentErrorTitle',
            {
              defaultMessage: 'Model deployment failed',
            }
          ),
        });
      }
    }

    dispatch({ type: 'field.addSemanticText', value: data });
  };

  const submitForm = async (
    e?: React.FormEvent,
    exitAfter: boolean = false,
    clickOutside: boolean = false
  ) => {
    if (e) {
      e.preventDefault();
    }

    const { isValid, data } = await form.submit();

    if (isValid) {
      form.reset();

      if (data.type === 'semantic_text' && !clickOutside) {
        handleSemanticText(data);
      } else {
        dispatch({ type: 'field.add', value: data });
      }

      if (exitAfter) {
        cancel();
      }
    }
  };

  const onClickOutside = () => {
    const name = form.getFields().name.value as string;

    if (name.trim() === '') {
      if (isCancelable !== false) {
        cancel();
      }
    } else {
      submitForm(undefined, true, true);
    }
  };

  const renderFormFields = () => (
    <EuiFlexGroup gutterSize="s">
      {/* Field type */}
      <EuiFlexItem grow={false}>
        <TypeParameter
          isRootLevelField={isRootLevelField}
          isMultiField={isMultiField}
          showDocLink
          isSemanticTextEnabled={isSemanticTextEnabled}
        />
      </EuiFlexItem>

      {/* Field subType (if any) */}
      <FormDataProvider pathsToWatch="type">
        {({ type }) => {
          if (type === undefined) {
            return null;
          }

          const [fieldType] = type;
          return (
            <SubTypeParameter
              key={fieldType?.value}
              type={fieldType?.value}
              isMultiField={isMultiField ?? false}
              isRootLevelField={isRootLevelField}
            />
          );
        }}
      </FormDataProvider>

      {/* Field reference_field for semantic_text field type */}
      <ReferenceFieldCombo indexName={indexName} />

      {/* Field name */}
      <EuiFlexItem>
        <NameParameter />
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const isAddFieldButtonDisabled = (): boolean => {
    if (semanticFieldType) {
      return !referenceFieldComboValue || !nameValue || !inferenceIdComboValue;
    }

    return false;
  };

  const renderFormActions = () => (
    <EuiFlexGroup gutterSize="s" justifyContent="flexEnd">
      {(isCancelable !== false || isAddingFields) && (
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty onClick={cancel} data-test-subj="cancelButton">
            {i18n.translate('xpack.idxMgmt.mappingsEditor.createField.cancelButtonLabel', {
              defaultMessage: 'Cancel',
            })}
          </EuiButtonEmpty>
        </EuiFlexItem>
      )}
      <EuiFlexItem grow={false}>
        <EuiButton
          color="primary"
          fill
          onClick={submitForm}
          type="submit"
          data-test-subj="addButton"
          isDisabled={isAddFieldButtonDisabled()}
        >
          {isMultiField
            ? i18n.translate('xpack.idxMgmt.mappingsEditor.createField.addMultiFieldButtonLabel', {
                defaultMessage: 'Add multi-field',
              })
            : i18n.translate('xpack.idxMgmt.mappingsEditor.createField.addFieldButtonLabel', {
                defaultMessage: 'Add field',
              })}
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  return (
    <>
      <EuiOutsideClickDetector onOutsideClick={onClickOutside}>
        <Form
          form={form}
          FormWrapper={formWrapper}
          onSubmit={submitForm}
          data-test-subj="createFieldForm"
        >
          <div
            className={classNames('mappingsEditor__createFieldWrapper', {
              'mappingsEditor__createFieldWrapper--toggle':
                Boolean(maxNestedDepth) && maxNestedDepth! > 0,
              'mappingsEditor__createFieldWrapper--multiField': isMultiField,
            })}
            style={{
              paddingLeft: `${
                isMultiField
                  ? paddingLeft! - EUI_SIZE * 1.5 // As there are no "L" bullet list we need to substract some indent
                  : paddingLeft
              }px`,
            }}
          >
            <div className="mappingsEditor__createFieldContent">
              {renderFormFields()}

              <FormDataProvider pathsToWatch={['type', 'subType']}>
                {({ type, subType }) => {
                  const RequiredParametersForm = getRequiredParametersFormForType(
                    type?.[0]?.value,
                    subType?.[0]?.value
                  );

                  if (!RequiredParametersForm) {
                    return null;
                  }

                  const typeDefinition = TYPE_DEFINITION[type?.[0].value as MainType];

                  return (
                    <div className="mappingsEditor__createFieldRequiredProps">
                      {typeDefinition.isBeta ? (
                        <>
                          <FieldBetaBadge />
                          <EuiSpacer size="m" />
                        </>
                      ) : null}

                      <RequiredParametersForm key={subType ?? type} allFields={allFields} />
                    </div>
                  );
                }}
              </FormDataProvider>
              {/* Field inference_id for semantic_text field type */}
              <InferenceIdCombo inferenceToModelIdMap={inferenceToModelIdMap} setValue={setValue} />
              {renderFormActions()}
            </div>
          </div>
        </Form>
      </EuiOutsideClickDetector>
    </>
  );
});

function ReferenceFieldCombo({ indexName }: { indexName?: string }) {
  const [{ type }] = useFormData({ watch: 'type' });

  if (type === undefined || type[0]?.value !== 'semantic_text') {
    return null;
  }

  return (
    <EuiFlexItem grow={false}>
      <UseField path="referenceField">
        {(field) => <ReferenceFieldSelects onChange={field.setValue} indexName={indexName} />}
      </UseField>
    </EuiFlexItem>
  );
}

interface InferenceProps {
  inferenceToModelIdMap?: InferenceToModelIdMap;
  setValue: (value: string) => void;
}

function InferenceIdCombo({ setValue }: InferenceProps) {
  const [{ type }] = useFormData({ watch: 'type' });

  if (type === undefined || type[0]?.value !== 'semantic_text') {
    return null;
  }

  return (
    <>
      <EuiSpacer />
      <UseField path="inferenceId">
        {(field) => <SelectInferenceId onChange={field.setValue} setValue={setValue} />}
      </UseField>
    </>
  );
}
