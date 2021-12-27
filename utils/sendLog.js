module.exports = (log, logs, telegram, chatId) => {
    let startTime = new Date();

    let milliseconds = String(startTime.getMilliseconds());

    while(milliseconds.length < 3) {
        milliseconds = '0' + milliseconds;
    }

    log = `${startTime.toLocaleTimeString()}.${milliseconds} ${typeof(chatId) != 'number' || chatId != 124127197 ? '000000000' : chatId} ${log}`;

    console.log(log);

    if(Object.keys(logs).length > 0) {
        logs.log += `${log}
`;
        telegram.editMessageText(
            124127197,
            logs.messageId,
            '',
            logs.log
        );
    } else {
        logs.log = `${log}
`;
        telegram.sendMessage(124127197, logs.log).then(result => logs.messageId = result.message_id);
    }
}