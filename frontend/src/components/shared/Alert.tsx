import { ApolloError } from 'apollo-client';
import { AlertType } from '../../enums/alert-type';
import React from 'react';


interface GenericAlertProps {
    shouldShow?: boolean;
    title?: string;
    message: string | React.ReactNode;
    type: AlertType;
}

interface ErrorAlertProps {
    error?: ApolloError;
    title?: string;
}


const GenericAlert = (props: GenericAlertProps) => (
    props.shouldShow !== false ? (
        <div className={ "alert " + (AlertType.success === props.type ? "alert-success" : (AlertType.danger === props.type ? "alert-danger" : "alert-info") )}>
            { props.title && <h2>{ props.title }</h2> }
            <p>{ props.message } </p>
        </div>
    ) : null
);

const ApolloErrorAlert = (props: ErrorAlertProps) => {
    if (!props.error) return null;
    return (
        <div className="alert alert-danger">
            { props.title && <h2>{ props.title }</h2> }
            { (props.error.graphQLErrors && (props.error.graphQLErrors.length > 1 || (props.error.graphQLErrors.length > 0 && props.error.networkError))) ? (
                <ul>
                    {
                        props.error.graphQLErrors.map((error, index) => (
                            <li key={index}>error.message</li>
                        ))
                    }
                    { props.error.networkError && <li>{ props.error.networkError }</li> }
                </ul>
            ) : (props.error.graphQLErrors.length === 1 ?
                    props.error.graphQLErrors[0].message :
                    ( props.error.networkError ? props.error.networkError : props.error.message)
                )
            }
        </div>
    );
};

export { GenericAlert, ApolloErrorAlert };
