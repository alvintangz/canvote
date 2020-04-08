import { ApolloError } from 'apollo-boost';
import { AlertType } from '../enums/alert-type';
import React from 'react';


interface GenericAlertProps {
    shouldShow: boolean;
    title?: string;
    message: string | HTMLElement;
    type: AlertType;
}

interface ErrorAlertProps {
    error?: ApolloError;
}

const GenericAlert = (props: GenericAlertProps) => (
    props.shouldShow ? (
        <div className={ "alert " + (AlertType.success === props.type ? "alert-success" : (AlertType.danger === props.type ? "alert-danger" : "alert-info") )}>
            { props.title && <h2>{ props.title }</h2> }
            <p>{ props.message } </p>
        </div>
    ) : (<div></div>)
);

const GraphQLErrorAlert = (props: ErrorAlertProps) => (
    props.error ? (
        <div className="alert alert-danger">
            { props.error.message }
        </div>
    ) : (<div></div>)
);

export { GenericAlert, GraphQLErrorAlert };
