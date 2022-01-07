import { Message, MessageEmbed } from 'discord.js'
import BaseCommand from '../../utils/structures/BaseCommand'
import DiscordClient from '../../client/client'
import fetch from 'node-fetch'
import { hypixelApiKey } from '../../../config.json'
import moment from 'moment'

export default class UserCommand extends BaseCommand {
  constructor() {
    super('user', 'hstats', ['u', 'p', 'player', 'usr'])
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0]) {
      message.channel.send('Provide a minecraft player username')
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
     * User things
     */
    const player = json.player

    const ID = player._id
    const rank = player.rank ? player.rank : 'Player'
    const karma = player.karma ? player.karma : '0'
    const exp = player.networkExp ? player.networkExp : '0'
    const achievmentPoints = player.achievmentPoints
      ? player.achievmentPoints
      : '0'
    const lang = player.userLanguage ? player.userLanguage : 'ENGLISH'
    const totalRewards = player.totalRewards ? player.totalRewards : '0'

    const recentGameType = player.mostRecentGameType
      ? player.mostRecentGameType
      : 'None'

    const firstLogin = moment(player.firstLogin).format('DD MMM YYYY HH:mm:ss')
    const lastLogin = moment(player.lastLogin).format('DD MMM YYYY HH:mm:ss')

    /**
     * Make user embed
     */
    const embed = new MessageEmbed()
      .setAuthor(player.displayname, `https://minotar.net/avatar/${UUID}`)
      .setTitle(player.displayname)
      .setThumbnail(`https://minotar.net/avatar/${UUID}`)
      .setColor(0xc5e855)
      .setDescription(`ID: ${ID}`)
      .addField('Rank', rank, true)
      .addField('Karma', karma, true)
      .addField('Network Experience', exp, true)
      .addField('Achievment Points', achievmentPoints, true)
      .addField('Language', lang, true)
      .addField('Total Rewards', totalRewards, true)
      .addField('Most Recent Game Type', recentGameType, true)
      .addField('First Login', firstLogin, true)
      .addField('Last Login', lastLogin, true)
      .setFooter(
        message.member?.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()

    message.channel.send(embed)
  }
}
