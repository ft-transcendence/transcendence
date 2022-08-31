import { UseFilters } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseMessageDto, ChannelDto, DMDto } from './dto/chat.dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { HttpToWsFilter, ProperWsFilter } from './filter/transformation-filter';
import {
	gameInvitation,
	mute,
	oneMsg as oneMessage,
	oneUser,
	updateChannel,
	updateUser,
} from './type/chat.type';
import { UserService } from 'src/user/user.service';

@UsePipes(new ValidationPipe())
@UseFilters(new HttpToWsFilter())
@UseFilters(new ProperWsFilter())
@WebSocketGateway({
	cors: {
		origin: process.env.FRONT_URL,
	},
	path: '/sockets/',
	//namespace: 'chatspace',
})
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly chatservice: ChatService,
		private userService: UserService,
	) {}

	async handleFetchChannel(email: string, @ConnectedSocket() client: Socket) {
		const channels = await this.chatservice.get__channelsToJoin(email);
		if (channels)
			for (let index = 0; index < channels.length; index++)
				client.join(channels[index]);
	}

	@SubscribeMessage('read preview')
	async handleReadPreview(
		@MessageBody() email: string,
		@ConnectedSocket() client: Socket,
	) {
		await this.handleFetchChannel(email, client);
		const data = await this.chatservice.get__previews(email);
		client.emit('set preview', data);
	}

	@SubscribeMessage('add preview')
	async handleChatSearch(
		@MessageBody() data: any,
		@ConnectedSocket() client: Socket,
	) {
		const preview = await this.chatservice.get__onePreview(
			data.channelId,
			data.email,
		);
		client.join(preview.name);
		client.emit('add preview', preview);
	}

	// @SubscribeMessage('read blocked')
	// async handleReadBlocked(
	// 	@MessageBody() email: string,
	// 	@ConnectedSocket() client: Socket,
	// ) {
	// 	const data = await this.chatservice.get__blockedTags(email);
	// 	client.emit('fetch blocked', data);
	// }

	@SubscribeMessage('new channel')
	async handleNewChannel(
		@MessageBody() data: ChannelDto,
		@ConnectedSocket() client: Socket,
	) {
		const channelId = await this.chatservice.new__channel(data);
		if (channelId == undefined)
			client.emit('exception', {
				error: 'channel exist, try another channel name!',
			});
		else {
			const preview = await this.chatservice.get__onePreview(
				channelId,
				data.email,
			);
			client.join(preview.name);
			client.emit('add preview', preview);
		}
	}

	@SubscribeMessage('join channel')
	async joinChannel(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		const channelId = await this.chatservice.join__channel(data);
		if (channelId == undefined)
			client.emit('exception', { error: 'Wrong password' });
		else {
			const channelName = await this.chatservice.get__Cname__ByCId(
				data.channelId,
			);
			client.join(channelName);
			const id = await this.chatservice.get__id__ByEmail(data.email);
			const preview = await this.chatservice.get__previews(data.email);
			client.emit('update preview', preview);
			const members = await this.chatservice.fetch__members(
				id,
				data.channelId,
			);
			client.emit('fetch members', members);
			const inviteds = await this.chatservice.fetch__inviteds(
				id,
				data.channelId,
			);
			client.emit('fetch inviteds', inviteds);
			const role = await this.get__role(
				data.email,
				[],
				[],
				members,
				inviteds,
			);
			client.emit('fetch role', role);
		}
	}

	@SubscribeMessage('invite to channel')
	async inviteToChannel(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		await this.chatservice.invite__toChannel(data);
		const id = await this.chatservice.get__id__ByEmail(data.email);
		const inviteds = await this.chatservice.fetch__inviteds(
			id,
			data.channelId,
		);
		client.emit('fetch inviteds', inviteds);
	}

	@SubscribeMessage('block channel')
	async blockChannel(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		await this.chatservice.block__channel(data);
		const preview = await this.chatservice.get__previews(data.email);
		client.emit('update preview', preview);
		const users = await this.chatservice.get__searchSuggest(data.email);
		client.emit('search suggest', users);
		client.emit('fetch owner', []);
		client.emit('fetch admins', []);
		client.emit('fetch members', []);
		client.emit('fetch inviteds', []);
	}

	@SubscribeMessage('leave channel')
	async handleDeleteChannel(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		await this.chatservice.leave__channel(data);
		const preview = await this.chatservice.get__previews(data.email);
		client.emit('update preview', preview);
		const users = await this.chatservice.get__searchSuggest(data.email);
		client.emit('search suggest', users);
		client.emit('fetch owner', []);
		client.emit('fetch admins', []);
		client.emit('fetch members', []);
		client.emit('fetch inviteds', []);
	}

	@SubscribeMessage('kick out')
	async handleKickOutChannel(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		await this.chatservice.leave__channel(data);
		const id = await this.chatservice.get__id__ByEmail(data.email);
		const admins = await this.chatservice.fetch__admins(id, data.channelId);
		client.emit('fetch admins', admins);
		const members = await this.chatservice.fetch__members(
			id,
			data.channelId,
		);
		client.emit('fetch members', members);
		const inviteds = await this.chatservice.fetch__inviteds(
			id,
			data.channelId,
		);
		client.emit('fetch inviteds', inviteds);
		const invitationTags = await this.chatservice.get__invitationTags(
			data.channelId,
		);
		client.emit('invitation tags', invitationTags);
		const users = await this.chatservice.get__searchSuggest(data.email);
		client.emit('search suggest', users);
	}

	@SubscribeMessage('new dm')
	async newDM(@MessageBody() data: DMDto, @ConnectedSocket() client: Socket) {
		const channelId = await this.chatservice.new__DM(data);
		const preview = await this.chatservice.get__onePreview(
			channelId,
			data.email,
		);
		const channelName = await this.chatservice.get__Cname__ByCId(channelId);
		client.join(channelName);
		client.emit('add preview', preview);
	}

	@SubscribeMessage('read msgs')
	async handleFetchMsgs(
		@MessageBody() channelId: number,
		@ConnectedSocket() client: Socket,
	) {
		const data = await this.chatservice.fetch__msgs(channelId);
		client.emit('fetch msgs', data);
	}

	@SubscribeMessage('msg')
	async handleNewMsg(
		@MessageBody() data: UseMessageDto,
		@ConnectedSocket() client: Socket,
	) {
		const message = await this.chatservice.new__msg(data);
		if (message) {
			this.broadcast('broadcast', message, data.channelId);
			const preview = await this.chatservice.get__previews(data.email);
			client.emit('update preview', preview);
		}
	}

	async broadcast(event: string, message: oneMessage, channelId: number) {
		const cName = await this.chatservice.get__Cname__ByCId(channelId);
		this.server.in(cName).emit(event, message);
	}

	async get__role(
		email: string,
		owners: oneUser[],
		admins: oneUser[],
		members: oneUser[],
		inviteds: oneUser[],
	) {
		let role = 'noRole';
		if (inviteds && inviteds.length > 0) {
			const isInvited: number = inviteds.filter((invited) => {
				return invited.email === email;
			}).length;
			if (isInvited > 0) role = 'invited';
		}
		if (members && members.length > 0) {
			const isMember: number = members.filter((member) => {
				return member.email === email;
			}).length;
			if (isMember > 0) role = 'member';
		}
		if (admins && admins.length > 0) {
			const isAdmin: number = admins.filter((admin) => {
				return admin.email === email;
			}).length;
			if (isAdmin > 0) role = 'admin';
		}
		if (owners && owners.length > 0) {
			const isOwner: number = owners.filter((owner) => {
				return owner.email === email;
			}).length;
			if (isOwner > 0) role = 'owner';
		}
		return role;
	}

	@SubscribeMessage('read room status')
	async handleFetchStatus(
		@MessageBody() data: any,
		@ConnectedSocket() client: Socket,
	) {
		const id = await this.chatservice.get__id__ByEmail(data.email);
		const owners = await this.chatservice.fetch__owners(id, data.channelId);
		client.emit('fetch owner', owners);
		const admins = await this.chatservice.fetch__admins(id, data.channelId);
		client.emit('fetch admins', admins);
		const members = await this.chatservice.fetch__members(
			id,
			data.channelId,
		);
		client.emit('fetch members', members);
		const inviteds = await this.chatservice.fetch__inviteds(
			id,
			data.channelId,
		);
		client.emit('fetch inviteds', inviteds);
		const role = await this.get__role(
			data.email,
			owners,
			admins,
			members,
			inviteds,
		);
		client.emit('fetch role', role);
	}

	@SubscribeMessage('get search suggest')
	async handleSuggestUsers(
		@MessageBody() email: string,
		@ConnectedSocket() client: Socket,
	) {
		const users = await this.chatservice.get__searchSuggest(email);
		client.emit('search suggest', users);
	}

	@SubscribeMessage('get user tags')
	async handleUserTags(
		@MessageBody() email: string,
		@ConnectedSocket() client: Socket,
	) {
		const userTags = await this.chatservice.get__userTags(email);
		client.emit('user tags', userTags);
	}

	@SubscribeMessage('get invitation tags')
	async handleInvitationTags(
		@MessageBody() channelId: number,
		@ConnectedSocket() client: Socket,
	) {
		const invitationTags = await this.chatservice.get__invitationTags(
			channelId,
		);
		client.emit('invitation tags', invitationTags);
	}

	@SubscribeMessage('delete msg')
	async handleDeleteMsg(
		@MessageBody() data: UseMessageDto,
		@ConnectedSocket() client: Socket,
	) {
		await this.chatservice.delete__msg(data);
		const fetch = await this.chatservice.fetch__msgs(data.channelId);
		client.emit('fetch msgs', fetch);
		const preview = await this.chatservice.get__previews(data.email);
		client.emit('update preview', preview);
	}

	@SubscribeMessage('edit msg')
	async handleEditMsg(
		@MessageBody() data: UseMessageDto,
		@ConnectedSocket() client: Socket,
	) {
		await this.chatservice.edit__msg(data);
		const fetch = await this.chatservice.fetch__msgs(data.channelId);
		client.emit('fetch msgs', fetch);
		const preview = await this.chatservice.get__previews(data.email);
		client.emit('update preview', preview);
	}

	@SubscribeMessage('be admin')
	async handleBeAdmin(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		await this.chatservice.be__admin(data);
		const id = await this.chatservice.get__id__ByEmail(data.email);
		const admins = await this.chatservice.fetch__admins(id, data.channelId);
		client.emit('fetch admins', admins);
		const members = await this.chatservice.fetch__members(
			id,
			data.channelId,
		);
		client.emit('fetch members', members);
	}

	@SubscribeMessage('not admin')
	async handleNotAdmin(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		await this.chatservice.not__admin(data);
		const id = await this.chatservice.get__id__ByEmail(data.email);
		const admins = await this.chatservice.fetch__admins(id, data.channelId);
		client.emit('fetch admins', admins);
		const members = await this.chatservice.fetch__members(
			id,
			data.channelId,
		);
		client.emit('fetch members', members);
	}

	@SubscribeMessage('get setting')
	async handleGetSetting(
		@MessageBody() channelId: number,
		@ConnectedSocket() client: Socket,
	) {
		const info = await this.chatservice.get__setting(channelId);
		client.emit('setting info', info);
	}

	@SubscribeMessage('update setting')
	async handleUpdateSetting(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		await this.chatservice.update__setting(data);
		const info = await this.chatservice.get__setting(data.channelId);
		client.emit('setting info', info);
	}

	@SubscribeMessage('mute user')
	async handleMuteUser(@MessageBody() data: mute) {
		await this.chatservice.new__mute(data);
	}

	@SubscribeMessage('add friend')
	async addFriend(
		@MessageBody() data: updateUser,
		// @ConnectedSocket() client: Socket,
	) {
		const id = await this.chatservice.get__id__ByEmail(data.selfEmail);
		await this.userService.addFriend(id, data.otherId);
	}

	@SubscribeMessage('block user')
	async blockUser(
		@MessageBody() data: updateUser,
		// @ConnectedSocket() client: Socket,
	) {
		const id = await this.chatservice.get__id__ByEmail(data.selfEmail);
		await this.userService.blockUser(id, data.otherId);
	}

	/* I need a function from user status, to get the target socket */

	// @SubscribeMessage('invite to game')
	// async gameInvitation(@MessageBody() data: gameInvitation) {
	// 	const client = this.findClient(data.targetId);
	// 	client.emit('invite to game', data);
	// }
}
