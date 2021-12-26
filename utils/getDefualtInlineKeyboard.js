const capitalize = require("./capitalize");
const getLanguage = require("./getLanguage");

module.exports = (languageCode, eventId) => {
    return([
        [
            {
                text: capitalize(getLanguage(languageCode, 'share')),
                switch_inline_query: eventId
            },
            {
                text: capitalize(getLanguage(languageCode, 'list')),
                switch_inline_query_current_chat: ''
            }
        ]
    ]);
}