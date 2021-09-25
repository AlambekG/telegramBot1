const TelegramApi = require('node-telegram-bot-api')
const{gameOptions, againOption} = require('./options')
const token = '***'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const start = ()=> {
    bot.setMyCommands([
        {command: '/start', description: 'Welcome'},
        {command: '/info', description: 'info'},
        {command: '/game', description: 'guess the digit'},


    ])
    bot.on('message', async msg=>{
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/3.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Аламбека ${text}`)
        }
        if(text === '/info'){
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text === '/game'){
            await bot.sendMessage(chatId, 'Сейчас я загадаю цифру, а ты должен ее угадать')
            const randomNum = Math.floor(Math.random() * 10);
            chats[chatId] = randomNum;
            return bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю :(')
    })
    bot.on('callback_query', async msg=> {
         const data = msg.data;
         const chatId = msg.message.chat.id;

         if(data === '/again')
            return bot.sendMessage(chatId, 'Отгадывай!', gameOptions);

         if(data === chats[chatId]){
              return bot.sendMessage(chatId, `Поздравляю! ты отгадал цифру ${data}`, againOption)
         }
         else{
             return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOption)
         }

    })
}

start()
