const languages = require('../config/languages');

module.exports = (language, text) => {
    if(true
        && typeof(languages[language]) == 'object'
        && typeof(languages[language][text]) == 'string'
    ) {
        return(languages[language][text]);
    } else if(typeof(languages['en'][text]) == 'string') {
        return(languages['en'][text]);
    } else {
        return(text);
    }
}