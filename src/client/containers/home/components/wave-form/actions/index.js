export const Actions = {
    UPDATEWAVEFORM: 'UPDATE-WAVEFORM',
    ADDWAVEFORM: 'ADD-WAVEFORM',
    EXPANDWAVEFORM: 'EXPAND-WAVEFORM'
};

export const ActionCreators = {
    update: ({slot, ...rest}) => ({
        type: Actions.UPDATEWAVEFORM,
        payload: {slot, ...rest}
    }),
    add: ({...rest}) => ({
        type: Actions.ADDWAVEFORM,
        payload: {...rest}
    }),
    expand: ({slot, expanded}) => ({
        type: Actions.EXPANDWAVEFORM,
        payload: {slot, expanded}
    })
};
