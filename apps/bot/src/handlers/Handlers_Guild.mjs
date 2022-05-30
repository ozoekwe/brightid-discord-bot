// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Js_dict from "../../../../node_modules/rescript/lib/es6/js_dict.js";
import * as $$Promise from "../../../../node_modules/@ryyppy/rescript-promise/src/Promise.mjs";
import * as Belt_Array from "../../../../node_modules/rescript/lib/es6/belt_Array.js";
import * as DiscordJs from "discord.js";
import * as Caml_option from "../../../../node_modules/rescript/lib/es6/caml_option.js";
import * as Caml_exceptions from "../../../../node_modules/rescript/lib/es6/caml_exceptions.js";
import * as UpdateOrReadGistMjs from "../updateOrReadGist.mjs";

var GuildHandlerError = /* @__PURE__ */Caml_exceptions.create("Handlers_Guild.GuildHandlerError");

function readGist(prim) {
  return UpdateOrReadGistMjs.readGist();
}

function getGuildDataFromGist(guilds, guildId, message) {
  var guildData = Js_dict.get(guilds, guildId);
  if (guildData !== undefined) {
    return Caml_option.valFromOption(guildData);
  }
  message.reply("Failed to retreive data for this Discord Guild");
  throw {
        RE_EXN_ID: GuildHandlerError,
        _1: "Failed to retreive data for this Discord Guild",
        Error: new Error()
      };
}

function generateEmbed(guilds, message, offset) {
  var current = Belt_Array.slice(guilds, offset, offset + 10 | 0);
  var embed = new DiscordJs.MessageEmbed().setTitle("Showing guilds " + (offset + 1 | 0).toString() + "-" + (offset + current.length | 0).toString() + " out of " + guilds.length.toString());
  return UpdateOrReadGistMjs.readGist().then(function (guilds) {
              Belt_Array.forEach(current, (function (g) {
                      var guildData = getGuildDataFromGist(guilds, g.id, message);
                      var inviteLink = guildData.inviteLink;
                      var guildLink = (inviteLink == null) ? "No Invite Link Available" : "**Invite:** " + inviteLink;
                      embed.addField(g.name, guildLink, false);
                      
                    }));
              return Promise.resolve(embed);
            });
}

function guilds(member, client, message) {
  var clientGuildManager = client.guilds;
  var unsortedGuilds = clientGuildManager.cache;
  var guilds$1 = unsortedGuilds.sort(function (a, b) {
          if (a.memberCount > b.memberCount) {
            return -1;
          } else {
            return 1;
          }
        }).array();
  return $$Promise.$$catch(generateEmbed(guilds$1, message, 0).then(function (embed) {
                    return message.reply({
                                embed: embed
                              });
                  }).then(function (guildsMessage) {
                  if (guilds$1.length >= 10) {
                    guildsMessage.react("➡️");
                    var collector = guildsMessage.createReactionCollector((function (reaction, user) {
                            var emoji = reaction.emoji;
                            var name = emoji.emoji;
                            return Promise.resolve(Belt_Array.some([
                                            "⬅️",
                                            "➡️"
                                          ], (function (arrow) {
                                              return name === arrow;
                                            })) && user.id === member.id);
                          }), {
                          time: 60000
                        });
                    collector.on("collect", (function (reaction) {
                            guildsMessage.reactions.removeAll();
                            var emoji = reaction.emoji;
                            var name = emoji.emoji;
                            var currentIndex = name === "⬅️" ? -10 : 10;
                            generateEmbed(guilds$1, message, currentIndex).then(function (param) {
                                  return message.edit(param);
                                });
                            if (currentIndex !== 0) {
                              if ((currentIndex + 10 | 0) < guilds$1.length) {
                                guildsMessage.react("➡️");
                                return ;
                              } else {
                                return ;
                              }
                            } else {
                              guildsMessage.react("⬅️");
                              return ;
                            }
                          }));
                  }
                  return Promise.resolve(message);
                }), (function (e) {
                if (e.RE_EXN_ID === GuildHandlerError) {
                  console.error(e._1);
                } else if (e.RE_EXN_ID === $$Promise.JsError) {
                  var msg = e._1.message;
                  if (msg !== undefined) {
                    console.error(msg);
                  } else {
                    console.error("Must be some non-error value");
                  }
                } else {
                  console.error("Some unknown error");
                }
                return Promise.resolve(message);
              }));
}

export {
  GuildHandlerError ,
  readGist ,
  getGuildDataFromGist ,
  generateEmbed ,
  guilds ,
  
}
/* discord.js Not a pure module */