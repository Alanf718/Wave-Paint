export const Actions = {
    UPDATEWAVEFORM: 'UPDATE-WAVEFORM',
    ADDWAVEFORM: 'ADD-WAVEFORM'
};

export const ActionCreators = {
    update: ({slot, ...rest}) => ({
        type: Actions.UPDATEWAVEFORM,
        payload: {slot, ...rest}
    }),
    add: ({...rest}) => ({
        type: Actions.ADDWAVEFORM,
        payload: {...rest}
    })
};
