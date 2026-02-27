import React from "react";

/*
    This is a utility function to create a context and a hook to use the context.
*/
export function createContext<T>() {
    const context = React.createContext({} as T);
    function useContext() {
        return React.useContext(context);
    }
    return [useContext, context.Provider] as const;
}

/*
    IProvider is a type that represents a provider component.
*/
type IProvider = ({ children }: { children: React.ReactNode }) => React.ReactNode;

/*
    withProviders is a utility function to wrap a component with multiple providers.
*/
export const withProviders = (providers: IProvider[]) => (WrappedComponent: any) => (props: any) =>
    providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>;
    }, <WrappedComponent {...props} />);
