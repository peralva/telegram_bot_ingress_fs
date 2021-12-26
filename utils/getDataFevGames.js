const cheerio = require('cheerio');

const getDistanceCoordinates = require('./getDistanceCoordinates');
const httpAccess = require('./httpAccess');

module.exports = async (urlList, latitude, longitude) => {
    let dom;

    let $ = cheerio.load((await httpAccess('get', urlList)).body);

    let fields = {
        'city'          : { fevgames: 'City'            },
        'portal'        : { fevgames: 'Base Portal'     },
        'eventChannel'  : { fevgames: 'Social Platform' },
        'language'      : { fevgames: 'Language'        },
        'time'          : { fevgames: 'Local Time'      },
        'timeZone'      : { fevgames: 'Time Zone'       }
    };

    dom = $('#eventListTbl').children('thead').children('tr').children('th');

    for(let i = 0; i < dom.length; i++) {
        let field = Object.keys(fields).find(element => fields[element].fevgames == dom[i].children[0].children[0].data);

        if(typeof(field) == 'string') {
            fields[field].index = i;
        }
    }

    dom = $('#eventListTbl').children('tbody').children('tr');

    let records = [];

    for(let i = 0; i < dom.length; i++) {
        let record = {};

        for(let field in fields) {
            if(field == 'city') {
                record[field] = dom[i].children[fields[field].index].children[0].children[0].data;
                record.eventLink = urlList + dom[i].children[fields[field].index].children[0].attribs.href;
                record.id = record.eventLink.substring(record.eventLink.lastIndexOf('=') + 1);
            } else if(field == 'portal') {
                record[field] = {
                    name: dom[i].children[fields[field].index].children[0].children[0].data,
                    link: dom[i].children[fields[field].index].children[0].attribs.href
                };

                let index = {
                    pll: record[field].link.lastIndexOf('pll=') + 4
                };

                index['&'] = record[field].link.indexOf('&', index.pll);

                let coordinates = record[field].link.substring(
                    index.pll,
                    index['&'] == -1 ? Infinity : index['&']
                ).split(',');

                record[field].coordinates = {
                    latitude: Number(coordinates[0]),
                    longitude: Number(coordinates[1])
                };

                record[field].distance = getDistanceCoordinates(
                    latitude,
                    longitude,
                    record[field].coordinates.latitude,
                    record[field].coordinates.longitude
                );
            } else if(field == 'eventChannel') {
                record[field] = dom[i].children[fields[field].index].children[0].attribs.href;
            } else {
                record[field] = dom[i].children[fields[field].index].children[0].data;
            }
        }

        records.push(record);
    }

    records.sort((a, b) => {
        if(a.portal.distance > b.portal.distance) {
            return(1);
        } else if(a.portal.distance < b.portal.distance) {
            return(-1);
        } else {
            return(0);
        }
    });

    return(records);
}