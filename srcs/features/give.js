const Discord = require('discord.js');
var config = require('../../config/config.json');
var save = require('../../config/save.json');
var localization = require('../../config/localization.json');

function ChangeStatusReward(message, rewards, idx, status, lang, name) {
  if (status != rewards[idx]) {
    rewards[idx] = status;
    message.channel.send("<@" + message.author.id + "> " +
                         ((status) ? (localization["statusReward"][lang]["give"]) : (localization["statusReward"][lang]["remove"])) +
                         " **" + name + "**!");
  }
}

module.exports = (client, message, args) => {
    delete require.cache[require.resolve("../../config/config.json")]
    delete require.cache[require.resolve("../../config/save.json")]
    delete require.cache[require.resolve("../../config/localization.json")]

    var lang;
    for (var i in save.users) {
        if (save.users[i].id == message.author.id) {
            lang = save.users[i].language;
            break;
        }
    }
    if (typeof(message.member.roles.get("385092290458288130")) != "undefined" ||
        typeof(message.member.roles.get("376432343616978955")) != "undefined" ||
        typeof(message.member.roles.get("385084045169786880")) != "undefined") {
            if (args.length < 2 || !/<@![0-9]+>$/.test(args[0])) {
                message.channel.send(localization["badArguments"][lang] + "\n`" + config.prefix + "give @user reward_to_give`");
            } else {
                console.log("The user " + message.author.username + " has the right to use the command " + config.prefix + "give");
                var userId = args.splice(0, 1)[0].replace(/[<@!>]/g, '');
                var reward = args.join(" ");
                for (var i in save.users) {
                    if (save.users[i].id == message.author.id) {
                        var idx;
                        if ((idx = localization.rewards.listRewards.findIndex(function(item) {
                            var keys = Object.keys(item);
                            for (var lang in keys) {
                                if (item[keys[lang]]["name"] == reward) {
                                    return (true);
                                }
                            }
                            return (false);
                        })) != -1) {
                            ChangeStatusReward(message, save.users[i].rewards, idx, true, save.users[i].language,
                                               localization.rewards.listRewards[idx][save.users[i].language]["name"]);
                        } else {
                            message.channel.send(localization["giveRemove"][lang]["failedNotExists1"] + " `" + reward +
                                                "` " + localization["giveRemove"][lang]["failedNotExists2"]);
                        }
                        break;
                    }
                }
                const UserInfoSaver = require('../utils/UserInfoSaver.js');
                const saver = new UserInfoSaver();
                saver.SaveUsersInfos('./config/save.json', save);
            }
        } else {
            message.channel.send(localization["giveRemove"][lang]["failedPermission"]);
        }
};
