const translateText = require("../../../utils/translateText");

module.exports = (language, eventId) => {
    return([
        [
            {
                text: translateText({language, text: 'Share'}),
                switch_inline_query: eventId
            },
            {
                text: translateText({language, text: 'List'}),
                switch_inline_query_current_chat: ''
            }
        ]
    ]);
}