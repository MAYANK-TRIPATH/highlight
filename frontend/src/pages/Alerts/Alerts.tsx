import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';

import LeadAlignLayout from '../../components/layout/LeadAlignLayout';
import layoutStyles from '../../components/layout/LeadAlignLayout.module.scss';
import { useGetAlertsPagePayloadQuery } from '../../graph/generated/hooks';
import { AlertConfigurationCard } from './AlertConfigurationCard/AlertConfigurationCard';
import styles from './Alerts.module.scss';

export enum ALERT_TYPE {
    Error,
    FirstTimeUser,
}

const ALERT_CONFIGURATIONS = [
    {
        name: 'Errors',
        canControlThreshold: true,
        type: ALERT_TYPE.Error,
    },
    {
        name: 'First Time User',
        canControlThreshold: false,
        type: ALERT_TYPE.FirstTimeUser,
        description:
            'Get alerted when a new user starts their first journey in your application.',
    },
];

const AlertsPage = () => {
    const { organization_id } = useParams<{ organization_id: string }>();
    const { data, loading } = useGetAlertsPagePayloadQuery({
        variables: { organization_id: organization_id },
    });

    return (
        <LeadAlignLayout>
            <h2>Configure Your Alerts</h2>
            <p className={layoutStyles.subTitle}>
                Configure the environments you want alerts for.
            </p>

            <div className={styles.configurationContainer}>
                {loading ? (
                    Array(3)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton
                                key={index}
                                style={{
                                    width: '100%',
                                    height: 79,
                                    borderRadius: 8,
                                }}
                            />
                        ))
                ) : (
                    <>
                        {/* {ALERT_CONFIGURATIONS.map((configuration) => (
                            <AlertConfigurationCard
                                key={configuration.name}
                                configuration={configuration}
                                environmentOptions={
                                    data?.environment_suggestion || []
                                }
                                channelSuggestions={
                                    data?.slack_channel_suggestion || []
                                }
                            />
                        ))} */}
                        <AlertConfigurationCard
                            configuration={ALERT_CONFIGURATIONS[0]}
                            alert={
                                data?.error_alerts ? data?.error_alerts[0] : {}
                            }
                            environmentOptions={
                                data?.environment_suggestion || []
                            }
                            channelSuggestions={
                                data?.slack_channel_suggestion || []
                            }
                        />
                        <AlertConfigurationCard
                            configuration={ALERT_CONFIGURATIONS[1]}
                            alert={
                                data?.session_alerts
                                    ? data?.session_alerts[0]
                                    : {}
                            }
                            environmentOptions={
                                data?.environment_suggestion || []
                            }
                            channelSuggestions={
                                data?.slack_channel_suggestion || []
                            }
                        />
                    </>
                )}
            </div>
        </LeadAlignLayout>
    );
};

export default AlertsPage;
