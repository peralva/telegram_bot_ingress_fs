const capitalize = require("./capitalize");
const getLanguage = require("./getLanguage");

module.exports = (language_code, data, urlList) => {
    return(`<b>${capitalize(getLanguage(language_code, 'city'))}:</b> ${data.city}
<b>Portal:</b> ${data.portal.name} (<a href="https://intel.ingress.com/intel?pll=${data.portal.coordinates.latitude},${data.portal.coordinates.longitude}">Intel</a>) (<a href="https://www.google.com/maps/@${data.portal.coordinates.latitude},${data.portal.coordinates.longitude},15z">Google Maps</a>)
<b>${capitalize(getLanguage(language_code, 'distance'))}:</b> ${data.portal.distance.toFixed(3).replace('.', ',')} KM
<b>${capitalize(getLanguage(language_code, 'language'))}:</b> ${data.language}
<b>${capitalize(getLanguage(language_code, 'time'))}:</b> ${data.time} (${data.timeZone})
${data.eventChannel != '' ? `<b>${capitalize(getLanguage(language_code, 'eventChannel'))}:</b> ${data.eventChannel}` : ''}

<b>${capitalize(getLanguage(language_code, 'eventDetails'))}:</b> <a href="${data.eventLink}">Link</a>

<b>${capitalize(getLanguage(language_code, 'source'))}:</b> ${urlList}`);
}