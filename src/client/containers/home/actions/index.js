export const Actions = {
    WINDOW: 'WINDOW',
    SHIFT: 'SHIFT',
    LOADAUDIO: 'LOADAUDIO'
};

export const ActionCreators = {
    window: ({tMin, tMax}) => ({
        type: Actions.WINDOW,
        payload: {tMin, tMax}
    }),
    loadAudio: (audio, url) => {
        return {
            type: Actions.LOADAUDIO,
            payload: audio.load(url)
        };
    }
};
