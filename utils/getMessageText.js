const translateText = require("../../../utils/translateText");

module.exports = (language, data, urlList) => {
    return(`<b>${translateText({language, text: 'City'})}:</b> ${data.city}
<b>Portal:</b> ${data.portal.name} (<a href="${data.portal.link}">Intel</a>) (<a href="https://www.google.com/maps/@${data.portal.coordinates.latitude},${data.portal.coordinates.longitude},15z">Google Maps</a>)
<b>${translateText({language, text: 'Distance'})}:</b> ${data.portal.distance.toFixed(3).replace('.', ',')} KM
<b>${translateText({language, text: 'Language'})}:</b> ${data.language}
<b>${translateText({language, text: 'Time'})}:</b> ${data.time} (${data.timeZone})
${data.eventChannel != '' ? `<b>${translateText({language, text: 'Event channel'})}:</b> ${data.eventChannel}` : ''}

<b>${translateText({language, text: 'Event details'})}:</b> <a href="${data.eventLink}">${data.eventLink}</a>

<b>${translateText({language, text: 'Source'})}:</b> ${urlList}`);
}