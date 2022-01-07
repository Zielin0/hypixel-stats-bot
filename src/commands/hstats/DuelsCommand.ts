import { Message, MessageEmbed } from 'discord.js'
import BaseCommand from '../../utils/structures/BaseCommand'
import DiscordClient from '../../client/client'
import fetch from 'node-fetch'
import { hypixelApiKey } from '../../../config.json'

export default class DuelsCommand extends BaseCommand {
  constructor() {
    super('duels', 'hstats', ['d', 'dls', 'duel'])
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
     * Duels things
     */

    const player = json.player.stats.Duels

    const dCoins = player.coins
    const dGames = player.games_played_duels
    const dDeaths = player.deaths
    const dKills = player.kills
    const dWins = player.wins
    const dLosses = player.losses
    const dBlocks = player.blocks_placed
    const dBow = player.bow_shots
    const dGap = player.golden_apple_eaten

    /**
     * Make duels embed
     */
    const embed = new MessageEmbed()
      .setAuthor(json.player.displayname, `https://minotar.net/avatar/${UUID}`)
      .setTitle(`${json.player.displayname}'s Duels Stats`)
      .setThumbnail(`https://minotar.net/avatar/${UUID}`)
      .setColor(0xf2b315)
      .setDescription('')
      .addField('Duels Coins', dCoins, true)
      .addField('Duels played', dGames, true)
      .addField('Duels Deaths', dDeaths, true)
      .addField('Duels Kills', dKills, true)
      .addField('Duels Wins', dWins, true)
      .addField('Duels Losses', dLosses, true)
      .addField('Blocks Placed', dBlocks, true)
      .addField('Bow Shots', dBow, true)
      .addField('Gaps eaten', dGap, true)
      .setFooter(
        message.member?.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()

    message.channel.send(embed)
  }
}
