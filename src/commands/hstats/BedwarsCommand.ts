import { Message, MessageEmbed } from 'discord.js'
import BaseCommand from '../../utils/structures/BaseCommand'
import DiscordClient from '../../client/client'
import fetch from 'node-fetch'
import { hypixelApiKey } from '../../../config.json'

export default class BedwarsCommand extends BaseCommand {
  constructor() {
    super('bedwars', 'hstats', ['b', 'bw', 'bed'])
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
      message.reply('An error ocurred while fetching hypixel user data')
      return
    }

    /**
     * Bedwars things
     */

    const bwExp = json.player.stats.Bedwars.Experience
    const bwCoins = json.player.stats.Bedwars.coins
    const bwGamesPlayed = json.player.stats.Bedwars.games_played_bedwars
    const bwKills = json.player.stats.Bedwars.kills_bedwars
    const bwDeaths = json.player.stats.Bedwars.deaths_bedwars
    const bwLoses = json.player.stats.Bedwars.losses_bedwars
    const bwBroken = json.player.stats.Bedwars.beds_broken_bedwars
    const bwPurchased = json.player.stats.Bedwars._items_purchased_bedwars
    const bwLost = json.player.stats.Bedwars.beds_lost_bedwars
    const bwVoidKills = json.player.stats.Bedwars.void_kills_bedwars
    const bwCollectedRes = json.player.stats.Bedwars.resources_collected_bedwars
    const bwFinalls = json.player.stats.Bedwars.final_kills_bedwars

    /**
     * Make bedwars embed
     */
    const embed = new MessageEmbed()
      .setAuthor(json.player.displayname, `https://minotar.net/avatar/${UUID}`)
      .setTitle(`${json.player.displayname}'s BedWars stats`)
      .setThumbnail(`https://minotar.net/avatar/${UUID}`)
      .setColor(0xe85590)
      .setDescription(``)
      .addField('BedWars Experience', bwExp, true)
      .addField('BedWars Coins', bwCoins, true)
      .addField('Played Games', bwGamesPlayed, true)
      .addField('BedWars Kills', bwKills, true)
      .addField('BedWars Deaths', bwDeaths, true)
      .addField('BedWars Loses', bwLoses, true)
      .addField('Broken Beds', bwBroken, true)
      .addField('Purchased Items', bwPurchased, true)
      .addField('Beds Lost', bwLost, true)
      .addField('Void Kills', bwVoidKills, true)
      .addField('Collected Resources', bwCollectedRes, true)
      .addField('Final Kills', bwFinalls, true)
      .setFooter(
        message.member?.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()

    message.channel.send(embed)
  }
}
