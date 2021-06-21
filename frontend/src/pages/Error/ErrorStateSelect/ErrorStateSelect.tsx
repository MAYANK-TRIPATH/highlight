import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StringParam, useQueryParam } from 'use-query-params';

import Select from '../../../components/Select/Select';
import { useUpdateErrorGroupStateMutation } from '../../../graph/generated/hooks';
import { ErrorState } from '../../../graph/generated/schemas';
import styles from './ErrorStateSelect.module.scss';

const ErrorStateOptions = Object.keys(ErrorState).map((key) => ({
    displayValue: `${key}`,
    value: key.toUpperCase(),
    id: key.toUpperCase(),
}));

export const ErrorStateSelect: React.FC<{
    state: ErrorState;
}> = ({ state: initialErrorState }) => {
    const { error_id } = useParams<{ error_id: string }>();
    const [updateErrorGroupState] = useUpdateErrorGroupStateMutation();
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useQueryParam('action', StringParam);
    const [errorState, setErrorState] = useState(initialErrorState);

    // Sets the state based on the query parameters. This is used for the Slack deep-linked messages.
    useEffect(() => {
        if (action) {
            const castedAction = action.toUpperCase() as ErrorState;
            if (Object.values(ErrorState).includes(castedAction)) {
                updateErrorGroupState({
                    variables: { id: error_id, state: castedAction },
                });
                showStateUpdateMessage(castedAction);
                setErrorState(castedAction);
            }
            setAction(undefined);
        }
    }, [action, error_id, setAction, updateErrorGroupState]);

    return (
        <Select
            options={ErrorStateOptions}
            className={styles.select}
            value={errorState}
            onChange={async (newState: ErrorState) => {
                setLoading(true);
                setErrorState(newState);
                await updateErrorGroupState({
                    variables: { id: error_id, state: newState },
                });
                setLoading(false);

                showStateUpdateMessage(newState);
            }}
            loading={loading}
        />
    );
};

const showStateUpdateMessage = (newState: ErrorState) => {
    let displayMessage = '';
    switch (newState) {
        case ErrorState.Open:
            displayMessage = `This error is set to Open. You will receive alerts when a new error gets thrown.`;
            break;
        case ErrorState.Ignored:
            displayMessage = `This error is set to Ignored. You will not receive any alerts even if a new error gets thrown.`;
            break;
        case ErrorState.Resolved:
            displayMessage = `This error is set to Resolved. You will receive alerts when a new error gets thrown.`;
            break;
    }

    message.success(displayMessage, 10);
};
