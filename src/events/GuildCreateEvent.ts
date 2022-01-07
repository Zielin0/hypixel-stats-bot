// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
import { Guild } from 'discord.js'
import BaseEvent from '../utils/structures/BaseEvent'
import DiscordClient from '../client/client'

export default class GuildCreateEvent extends BaseEvent {
  constructor() {
    super('guildCreate')
  }

  async run(client: DiscordClient, guild: Guild) {
    let channelToSend
  }
}
