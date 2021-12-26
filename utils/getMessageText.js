const capitalize = require("./capitalize");
const getLanguage = require("./getLanguage");

module.exports = (languageCode, data, urlList) => {
    return(`<b>${capitalize(getLanguage(languageCode, 'city'))}:</b> ${data.city}
<b>Portal:</b> ${data.portal.name} (<a href="${data.portal.link}">Intel</a>) (<a href="https://www.google.com/maps/@${data.portal.coordinates.latitude},${data.portal.coordinates.longitude},15z">Google Maps</a>)
<b>${capitalize(getLanguage(languageCode, 'distance'))}:</b> ${data.portal.distance.toFixed(3).replace('.', ',')} KM
<b>${capitalize(getLanguage(languageCode, 'language'))}:</b> ${data.language}
<b>${capitalize(getLanguage(languageCode, 'time'))}:</b> ${data.time} (${data.timeZone})
${data.eventChannel != '' ? `<b>${capitalize(getLanguage(languageCode, 'eventChannel'))}:</b> ${data.eventChannel}` : ''}

<b>${capitalize(getLanguage(languageCode, 'eventDetails'))}:</b> <a href="${data.eventLink}">Link</a>

<b>${capitalize(getLanguage(languageCode, 'source'))}:</b> ${urlList}`);
}