// send: id
// rece: {id, author, filename, caption, type, chunks_count, received_chunks_count, chunks}
let initialState = {
    sendingMediaList: [],
    receivingMediaList: []
};
const mediaReducer = (state = initialState, action) => {
    switch (action.type) {
        default: return state;
    }
};