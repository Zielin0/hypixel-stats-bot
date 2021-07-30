import { Message, MessageEmbed } from 'discord.js'
import BaseCommand from '../../utils/structures/BaseCommand'
import DiscordClient from '../../client/client'
import fetch from 'node-fetch'
import { hypixelApiKey } from '../../../config.json'

export default class SkywarsCommand extends BaseCommand {
  constructor() {
    super('skywars', 'hstats', ['s', 'sw', 'sky'])
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0]) {
      message.reply('Provide a minecraft player username')
      return
    }

    /**
     * Fetch minecraft uuid
     */
    const resUUID = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${args[0]}`
    )
    const jsonUUID = await resUUID.json()

    var UUID = jsonUUID.id

    /**
     * Fetch hypixel information
     */
    const res = await fetch(
      `https://api.hypixel.net/player?uuid=${UUID}&key=${hypixelApiKey}`
    )
    const json = await res.json()

    /**
     * Check if success
     */
    if (!json.success) {
      message.reply('An error ocured while fetching hypixel user data')
      return
    }

    /**
     * Skywars things
     */
    const swCoins = json.player.stats.SkyWars.coins
    const swExp = json.player.stats.SkyWars.skywars_experience
    const swSouls = json.player.stats.SkyWars.souls
    const swChests = json.player.stats.SkyWars.chests_opened
    const swDeaths = json.player.stats.SkyWars.deaths
    const swLoses = json.player.stats.SkyWars.losses
    const swKills = json.player.stats.SkyWars.kills
    const swWins = json.player.stats.SkyWars.wins
    const swHeads = json.player.stats.SkyWars.heads

    /**
     * Make skwywars embed
     */
    const embed = new MessageEmbed()
      .setAuthor(json.player.displayname, `https://minotar.net/avatar/${UUID}`)
      .setTitle(`${json.player.displayname}'s SkyWars Stats`)
      .setThumbnail(`https://minotar.net/avatar/${UUID}`)
      .setColor('RANDOM')
      .setDescription('')
      .addField('SkyWars Experience', swExp, true)
      .addField('SkyWars Coins', swCoins, true)
      .addField('SkyWars Opened Chests', swChests, true)
      .addField('SkyWars Souls', swSouls, true)
      .addField('SkyWars Heads', swHeads, true)
      .addField('SkyWars Losses', swLoses, true)
      .addField('SkyWars Wins', swWins, true)
      .addField('SkyWards Kills', swKills, true)
      .addField('SkyWards Deaths', swDeaths, true)
      .setFooter(
        message.member?.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()

    message.channel.send(embed)
  }
}
