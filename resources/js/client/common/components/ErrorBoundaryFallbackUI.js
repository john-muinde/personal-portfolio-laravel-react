import { Result } from "antd";
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// Create an ErrorTitle component that'll render an <h1> tag with some styles
const ErrorTitle = styled.h1`
    font-size: 1.5em;
    color: palevioletred;
`;

// Create an ErrorSubTitle component that'll render an <small> tag with some styles
const ErrorSubTitle = styled.small`
    color: grey;
`;

// Create a ErrorWrapper component that'll render an <section> tag with some styles
const ErrorWrapper = styled.section`
    text-align: center;
    padding: 4em;
    background: papayawhip;
`;

const Wrapper = styled.section`
    margin-top: 30px;
`;

const ErrorDetails = styled.pre`
    text-align: left;
    margin-top: 20px;
    padding: 10px;
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow-x: auto;
`;

// Check for development environment using window.__DEV__ which we'll define in webpack mix
const isDevelopment = window.__DEV__;

/**
 * Simple Error boundary fallback UI to display when error occurs
 */
export const SimpleErrorBoundaryFallbackUI = () => {
    return (
        <ErrorWrapper>
            <ErrorTitle>
                <code>Something went wrong!</code>
            </ErrorTitle>

            {isDevelopment && (
                <ErrorSubTitle>
                    <code>
                        Open <strong>console</strong> for more details.
                    </code>
                </ErrorSubTitle>
            )}
        </ErrorWrapper>
    );
};

/**
 * Error boundary fallback UI to display when error occurs
 */
export const ErrorBoundaryFallbackUI = ({ error }) => {
    return (
        <Wrapper>
            <Result
                status="error"
                title="Something went wrong!"
                subTitle={
                    isDevelopment ? (
                        <code>
                            Check the error details below or open the{" "}
                            <strong>console</strong> for more information.
                        </code>
                    ) : (
                        "An error occurred. Please try again later."
                    )
                }
            />
            {isDevelopment && error && (
                <ErrorDetails>
                    <strong>Error: </strong>
                    {error.toString()}
                    {error.stack && (
                        <>
                            <br />
                            <strong>Stack trace:</strong>
                            <br />
                            {error.stack}
                        </>
                    )}
                </ErrorDetails>
            )}
        </Wrapper>
    );
};

ErrorBoundaryFallbackUI.propTypes = {
    error: PropTypes.shape({
        toString: PropTypes.func.isRequired,
        stack: PropTypes.string,
    }),
};

ErrorBoundaryFallbackUI.defaultProps = {
    error: null,
};