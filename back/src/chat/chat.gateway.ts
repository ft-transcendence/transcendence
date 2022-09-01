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
@WebSocketGateway()
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly chatservice: ChatService,
		private userService: UserService,
	) {}

	async handleJoinSocket(id: number, @ConnectedSocket() client: Socket) {
		const channels = await this.chatservice.get__channelsUserIn(id);
		client.join('default_all');
		if (channels)
			for (const channel of channels) {
				client.join(channel);
			}
	}

	@SubscribeMessage('read preview')
	async handleReadPreview(@MessageBody() email: string) {
		const data = await this.chatservice.get__previews(email);
		return data;
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
			this.updateChannelRequest('update channel request', 'default_all');
			return data;
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
			this.updateChannelRequest('update channel request', channelName);
		}
	}

	@SubscribeMessage('invite to channel')
	async inviteToChannel(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		const cName = await this.chatservice.get__Cname__ByCId(data.channelId);
		await this.chatservice.invite__toChannel(data);
		const id = await this.chatservice.get__id__ByEmail(data.email);
		const inviteds = await this.chatservice.fetch__inviteds(
			id,
			data.channelId,
		);
		client.emit('fetch inviteds', inviteds);
		this.updateChannelRequest('update channel request', cName);
	}

	@SubscribeMessage('block channel')
	async blockChannel(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		const cName = await this.chatservice.get__Cname__ByCId(data.channelId);
		await this.chatservice.block__channel(data);
		const preview = await this.chatservice.get__previews(data.email);
		client.emit('update preview', preview);
		const users = await this.chatservice.get__searchSuggest(data.email);
		client.emit('search suggest', users);
		client.emit('fetch owner', []);
		client.emit('fetch admins', []);
		client.emit('fetch members', []);
		client.emit('fetch inviteds', []);
		this.updateChannelRequest('update channel request', cName);
	}

	@SubscribeMessage('leave channel')
	async handleDeleteChannel(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		const cName = await this.chatservice.get__Cname__ByCId(data.channelId);
		await this.chatservice.leave__channel(data);
		const preview = await this.chatservice.get__previews(data.email);
		client.emit('update preview', preview);
		const users = await this.chatservice.get__searchSuggest(data.email);
		client.emit('search suggest', users);
		client.emit('fetch owner', []);
		client.emit('fetch admins', []);
		client.emit('fetch members', []);
		client.emit('fetch inviteds', []);
		this.updateChannelRequest('update channel request', cName);
	}

	@SubscribeMessage('kick out')
	async handleKickOutChannel(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		const cName = await this.chatservice.get__Cname__ByCId(data.channelId);
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
		this.updateChannelRequest('update channel request', cName);
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

	async updateChannelRequest(event: string, cName: string) {
		console.log('update request');
		this.server.in(cName).emit(event);
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
		const cName = await this.chatservice.get__Cname__ByCId(data.channelId);
		await this.chatservice.delete__msg(data);
		const fetch = await this.chatservice.fetch__msgs(data.channelId);
		client.emit('fetch msgs', fetch);
		const preview = await this.chatservice.get__previews(data.email);
		client.emit('update preview', preview);
		this.updateChannelRequest('update channel request', cName);
	}

	@SubscribeMessage('be admin')
	async handleBeAdmin(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		const cName = await this.chatservice.get__Cname__ByCId(data.channelId);
		await this.chatservice.be__admin(data);
		const id = await this.chatservice.get__id__ByEmail(data.email);
		const admins = await this.chatservice.fetch__admins(id, data.channelId);
		client.emit('fetch admins', admins);
		const members = await this.chatservice.fetch__members(
			id,
			data.channelId,
		);
		client.emit('fetch members', members);
		this.updateChannelRequest('update channel request', cName);
	}

	@SubscribeMessage('not admin')
	async handleNotAdmin(
		@MessageBody() data: updateChannel,
		@ConnectedSocket() client: Socket,
	) {
		const cName = await this.chatservice.get__Cname__ByCId(data.channelId);
		await this.chatservice.not__admin(data);
		const id = await this.chatservice.get__id__ByEmail(data.email);
		const admins = await this.chatservice.fetch__admins(id, data.channelId);
		client.emit('fetch admins', admins);
		const members = await this.chatservice.fetch__members(
			id,
			data.channelId,
		);
		client.emit('fetch members', members);
		this.updateChannelRequest('update channel request', cName);
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
		const cName = await this.chatservice.get__Cname__ByCId(data.channelId);
		await this.chatservice.update__setting(data);
		const info = await this.chatservice.get__setting(data.channelId);
		client.emit('setting info', info);
		this.updateChannelRequest('update channel request', cName);
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
}
