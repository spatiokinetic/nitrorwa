const axios = require('axios');
const BaseEvent = require('../utils/structures/BaseEvent');

module.exports = class GuildMemberUpdateEvent extends BaseEvent {
	constructor() {
	  super('guildMemberUpdate');
	}

	async run(client, oldMember, newMember) {
	  const channel = client.channels.cache.get('ID');
	  
	  if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
	    if (!oldMember.roles.cache.has('ROLEID') && newMember.roles.cache.has('ROLEID')) {

	      // Fetch Roblox username using Bloxlink API
	      const discordID = newMember.id;
	      try {
	        const response = await axios.get(`https://v3.blox.link/developer/discord/${discordID}`, {
	          headers: {
	            'Authorization': 'your-bloxlink-api-key'
	          }
	        });

	        const robloxUsername = response.data?.primaryAccount?.username;

	        if (robloxUsername) {
	          // Add to the {BOOSTERS} table
	          BOOSTERS.set(newMember.id, robloxUsername);

	          // Additional code you may want to include
	          channel.send(`${newMember.user.tag} (${robloxUsername}) has become a booster!`);
	        } else {
	          console.log('No Roblox username found for this user.');
	        }
	      } catch (error) {
	        console.error('Error fetching Roblox username:', error);
	      }
	    }
	  }
	}
};
