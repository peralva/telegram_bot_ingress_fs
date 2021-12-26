const URL_LIST = 'https://fevgames.net/ifs/events/';

const { Telegraf } = require('telegraf');

const capitalize = require('./utils/capitalize');
const getLanguage = require('./utils/getLanguage');
const getDataFevGames = require('./utils/getDataFevGames');
const getMessageText = require('./utils/getMessageText');

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => ctx.reply(
    capitalize(getLanguage(ctx.update.message.from.language_code, 'sendMeYourLocation')),
    {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: capitalize(getLanguage(ctx.update.message.from.language_code, 'list')),
                        switch_inline_query_current_chat: ''
                    }
                ]
            ]
        }
    }
));

bot.on('location', async ctx => {
    let messageId;
    let chatId;

    ctx.reply(
        `${capitalize(getLanguage(ctx.update.message.from.language_code, 'gettingInformation'))}...`,
        {
            parse_mode: 'HTML',
            reply_to_message_id: ctx.update.message.message_id
        }
    ).then(result => {
        messageId = result.message_id;
        chatId = result.chat.id;
    });

    let data = (await getDataFevGames(
        URL_LIST,
        ctx.update.message.location.latitude,
        ctx.update.message.location.longitude
    ))[0];

    ctx.telegram.editMessageText(
        chatId,
        messageId,
        '',
        getMessageText(ctx.update.message.from.language_code, data, URL_LIST),
        {
            parse_mode: 'HTML'
        }
    );
});

bot.on('inline_query', async ctx => {
    let result = [];

    if(typeof(ctx.update.inline_query.location) == 'object') {
        var data = (await getDataFevGames(
            URL_LIST,
            ctx.update.inline_query.location.latitude,
            ctx.update.inline_query.location.longitude
        ));

        if(ctx.update.inline_query.query != '') {
            data = data.filter(element => false
                || element.city         .toLowerCase()  .includes(ctx.update.inline_query.query.toLowerCase()   )
                || element.portal.name  .toLowerCase()  .includes(ctx.update.inline_query.query.toLowerCase()   )
                || element.language     .toLowerCase()  .includes(ctx.update.inline_query.query.toLowerCase()   )
                || element.time                         .includes(ctx.update.inline_query.query                 )
            );
        }

        data = data.filter((element, index) => index < 50);

        data.forEach(element => result.push({
            type: 'article',
            id: element.eventLink.substring(element.eventLink.lastIndexOf('=') + 1),
            title: element.city,
            description: element.portal.distance.toFixed(3).replace('.', ',') + ' KM',
            input_message_content: {
                message_text: getMessageText(ctx.update.inline_query.from.language_code, element, URL_LIST),
                parse_mode: 'HTML'
            }
        }));
    } else {
        result.push(
            {
                type: 'article',
                id: '0',
                title: ' ',
                description: capitalize(getLanguage(ctx.update.inline_query.from.language_code, 'locationPermission')),
                input_message_content: {
                    message_text: `<b>${capitalize(getLanguage(ctx.update.inline_query.from.language_code, 'locationPermission'))}</b>`,
                    parse_mode: 'HTML'
                }
            }
        );
    }

    ctx.answerInlineQuery(result, {
        cache_time: 10
    });
});

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))