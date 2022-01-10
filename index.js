const URL_LIST = 'https://fevgames.net/ifs/events/';

const translateText = require('../../utils/translateText');
const getDataFevGames = require('./utils/getDataFevGames');
const getMessageText = require('./utils/getMessageText');
const getDefualtInlineKeyboard = require('./utils/getDefualtInlineKeyboard');

const index = bot => {
    bot.start(ctx => {
        ctx.reply(
            `${translateText({language: ctx.update.message.from.language_code, text: 'Click the button below to search the 50 closest events according to the filter (location permission required)'})}.`,
            {
                reply_to_message_id: ctx.update.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: translateText({language: ctx.update.message.from.language_code, text: 'List'}),
                                switch_inline_query_current_chat: ''
                            }
                        ]
                    ]
                }
            }
        );

        ctx.reply(
            `${translateText({language: ctx.update.message.from.language_code, text: 'Submit your location and the closest IFS data will be returned'})}.`,
            {
                reply_to_message_id: ctx.update.message.message_id,
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: [
                        [
                            {
                                text: translateText({language: ctx.update.message.from.language_code, text: 'Send Location'}),
                                request_location: true
                            }
                        ]
                    ]
                }
            }
        );
    });

    bot.on('location', async ctx => {
        let messageId;
        let chatId;

        ctx.reply(
            `${translateText({language: ctx.update.message.from.language_code, text: 'Getting information'})}...`,
            {
                reply_to_message_id: ctx.update.message.message_id
            }
        ).then(result => {
            messageId = result.message_id;
            chatId = result.chat.id;
        });

        let data = await getDataFevGames(
            URL_LIST,
            ctx.update.message.location.latitude,
            ctx.update.message.location.longitude
        );

        if(data.length > 0) {
            data = data[0];

            var messageText = getMessageText(ctx.update.message.from.language_code, data, URL_LIST);
            var extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: getDefualtInlineKeyboard(
                        ctx.update.message.from.language_code,
                        data.id,
                        ctx.botInfo.id
                    )
                }
            };
        } else {
            var messageText = translateText({language: ctx.update.message.from.language_code, text: 'No records'});
            var extra = {};
        }

        ctx.telegram.editMessageText(chatId, messageId, '', messageText, extra);
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
                    || element.id                           .includes(ctx.update.inline_query.query                 )
                    || element.time                         .includes(ctx.update.inline_query.query                 )
                );
            }

            data = data.filter((element, index) => index < 50);

            data.forEach(element => {
                let inlineKeyboard = getDefualtInlineKeyboard(
                    ctx.update.inline_query.from.language_code,
                    element.id
                );

                inlineKeyboard[0].push({
                    text: 'Bot',
                    callback_data: ' '
                });

                result.push({
                    type: 'article',
                    id: String(element.id),
                    title: element.city,
                    description: element.portal.distance.toFixed(3).replace('.', ',') + ' KM',
                    input_message_content: {
                        message_text: getMessageText(ctx.update.inline_query.from.language_code, element, URL_LIST),
                        parse_mode: 'HTML'
                    },
                    reply_markup: {
                        inline_keyboard: inlineKeyboard
                    }
                });
            });
        } else {
            result.push(
                {
                    type: 'article',
                    id: '0',
                    title: ' ',
                    description: translateText({language: ctx.update.inline_query.from.language_code, text: "To use this feature, you need to allow the Telegram to access your device's location"}),
                    input_message_content: {
                        message_text: `<b>${translateText({language: ctx.update.inline_query.from.language_code, text: "To use this feature, you need to allow the Telegram to access your device's location"})}</b>`,
                        parse_mode: 'HTML'
                    }
                }
            );
        }

        ctx.answerInlineQuery(result, {
            is_personal: true
        });
    });

    bot.on('callback_query', ctx => {
        ctx.answerCbQuery(
            '',
            {
                url: 't.me/IngressFSBot?start=start'
            }
        );
    });
}

module.exports = index;

if(process.env.NODE_ENV == 'developer') {
    const { Telegraf } = require('telegraf');

    let token = process.cwd();
    token = token.substring(token.length, token.length - 45).replace('_', ':');

    const bot = new Telegraf(token);

    index(bot);

    bot.launch();
    console.log('Bot launched.');
}