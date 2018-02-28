export const Actions = {
    ADDSTACK: 'ADDSTACK'
};

export const ActionCreators = {
    add: ({...rest}) => ({
        type: Actions.ADDSTACK,
        payload: {...rest}
    })
};
