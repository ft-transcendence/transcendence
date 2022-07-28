import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto, DMDto, UseMessageDto } from './dto/chat.dto';
import {
	chatPreview,
	mute,
	oneMsg as oneMessage,
	oneSuggestion,
	oneUser,
	updateChannel,
} from './type/chat.type';
import * as moment from 'moment';

@Injectable()
export class ChatService {
	constructor(private readonly prisma: PrismaService) {}

	async list__allUsers() {
		const users = await this.prisma.user.findMany();
		let count = 0;
		for (const [index, user] of users.entries()) {
			console.log('   user %d: %s', index, user.email);
			count = index + 1;
		}
		console.log('total %d users', count);
		return;
	}

	async list__allChannels() {
		const channels = await this.prisma.channel.findMany();
		let count = 0;
		for (const [index, channel] of channels.entries()) {
			console.log('   channel %d: %s', index, channel.name);
			count = index + 1;
		}
		console.log('total %d channels', count);
		return;
	}

	async get__id__ByEmail(email: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					email: email,
				},
			});
			return user.id;
		} catch (error) {
			console.log('get__id__ByEmail error:', error);
		}
	}

	async get__cId__ByCname(name: string) {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: name,
				},
			});
			return channel.id;
		} catch (error) {
			console.log('get__cId__ByCname error:', error);
		}
	}

	async get__Cname__ByCId(cid: number) {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: {
					id: cid,
				},
			});
			return channel.name;
		} catch (error) {
			console.log('get__Cname__ByCId error:', error);
			throw new WsException(error);
		}
	}

	async get__channelsToJoin(email: string) {
		try {
			const source = await this.prisma.user.findUnique({
				where: {
					email: email,
				},
				select: {
					admin: true,
					member: true,
					invited: true,
				},
			});
			const channels = this.organize__channelToJoin(source);
			return channels;
		} catch (error) {
			console.log('get__channels error:', error);
		}
	}

	organize__channelToJoin(source: any) {
		const channels = [];
		if (source) {
			if (source.admin)
				for (let index = 0; index < source.admin.length; index++) {
					const channel = source.admin[index].name;
					channels.push(channel);
				}
			if (source.member)
				for (let index = 0; index < source.member.length; index++) {
					const channel = source.member[index].name;
					channels.push(channel);
				}
			if (source.invited)
				for (let index = 0; index < source.invited.length; index++) {
					const channel = source.invited[index].name;
					channels.push(channel);
				}
		}
		return channels;
	}

	async get__previews(email: string): Promise<chatPreview[]> {
		try {
			const source = await this.get__chatList__ByEmail(email);
			const data = await this.organize__previews(source, email);
			return data;
		} catch (error) {
			console.log('get__preview error:', error);
		}
	}

	organize__previews(source: any, email: string) {
		const data = [];
		if (source) {
			if (source.owner) {
				for (let index = 0; index < source.owner.length; index++) {
					let dmName = '';
					if (source.owner[index].owners.length > 1) {
						dmName =
							source.owner[index].owners[0].email === email
								? source.owner[index].owners[1].username
								: source.owner[index].owners[0].username;
					} else dmName = 'No One';
					const messageCount = source.owner[index].messages.length;
					const element: chatPreview = {
						id: source.owner[index].id,
						dm: source.owner[index].dm,
						name: dmName,
						isPassword: source.owner[index].isPassword,
						picture: source.owner[index].picture,
						updateAt: source.owner[index].updateAt,
						lastMsg:
							messageCount > 0
								? source.owner[index].messages[messageCount - 1]
										.msg
								: '',
						ownerEmail: source.owner[index].owners[0].email,
					};
					data.push(element);
				}
			}
			if (source.admin)
				for (let index = 0; index < source.admin.length; index++) {
					const messageCount = source.admin[index].messages.length;
					const element: chatPreview = {
						id: source.admin[index].id,
						dm: source.admin[index].dm,
						isPassword: source.admin[index].isPassword,
						name: source.admin[index].name,
						picture: source.admin[index].picture,
						updateAt: source.admin[index].updateAt,
						lastMsg:
							messageCount > 0
								? source.admin[index].messages[messageCount - 1]
										.msg
								: '',
						ownerEmail: source.admin[index].owners[0].email,
					};
					data.push(element);
				}
			if (source.member)
				for (let index = 0; index < source.member.length; index++) {
					const messageCount = source.member[index].messages.length;
					const element: chatPreview = {
						id: source.member[index].id,
						dm: source.member[index].dm,
						name: source.member[index].name,
						isPassword: source.member[index].isPassword,
						picture: source.member[index].picture,
						updateAt: source.member[index].updateAt,
						lastMsg:
							messageCount > 0
								? source.member[index].messages[0].msg
								: '',
						ownerEmail: source.member[index].owners[0].email,
					};
					data.push(element);
				}
			if (source.invited)
				for (let index = 0; index < source.invited.length; index++) {
					const messageCount = source.invited[index].messages.length;
					const element: chatPreview = {
						id: source.invited[index].id,
						dm: source.invited[index].dm,
						name: source.invited[index].name,
						isPassword: source.invited[index].isPassword,
						picture: source.invited[index].picture,
						updateAt: source.invited[index].updateAt,
						// eslint-disable-next-line unicorn/no-nested-ternary, prettier/prettier
					lastMsg: source.invited[index].isPassword ? '' : (messageCount > 0 ? source.invited[index].messages[0].msg : ''),
						ownerEmail: source.invited[index].owners[0].email,
					};
					data.push(element);
				}
		}
		return data;
	}

	async get__onePreview(channelId: number): Promise<chatPreview> {
		try {
			const source = await this.get__chat__ByChannelId(channelId);
			const data = this.organize__onePreview(source);
			return data;
		} catch (error) {
			console.log('get__onePreview error:', error);
		}
	}

	organize__onePreview(source: any) {
		let messageCount = 0;
		if (source.messages) messageCount = source.messages.length;
		const data: chatPreview = {
			id: source.id,
			dm: source.dm,
			name: source.name,
			isPassword: source.isPassword,
			updateAt: source.updateAt,
			// eslint-disable-next-line unicorn/no-nested-ternary, prettier/prettier
			lastMsg: source.isPassword ? '' : (messageCount > 0 ? source.messages[0].msg : ''),
			ownerEmail: source.owners.length > 0 ? source.owners[0].email : '',
		};
		return data;
	}

	async get__chat__ByChannelId(channelId: number) {
		try {
			const source = await this.prisma.channel.findUnique({
				where: {
					id: channelId,
				},
				select: {
					id: true,
					dm: true,
					name: true,
					isPassword: true,
					picture: true,
					updatedAt: true,
					owners: {
						select: {
							email: true,
							username: true,
						},
					},
					messages: {
						where: {
							unsent: false,
						},
						select: {
							msg: true,
						},
					},
				},
			});
			return source;
		} catch (error) {
			console.log('get__chat__ByChannelName error:', error);
			throw new WsException(error);
		}
	}

	async get__chatList__ByEmail(email: string) {
		try {
			const returnValue = await this.prisma.user.findUnique({
				where: {
					email: email,
				},
				select: {
					owner: {
						where: {
							dm: true,
						},
						select: {
							id: true,
							dm: true,
							name: true,
							picture: true,
							isPassword: true,
							updatedAt: true,
							owners: {
								select: {
									email: true,
									username: true,
								},
							},
							messages: {
								where: {
									unsent: false,
								},
								select: {
									msg: true,
								},
							},
						},
					},
					admin: {
						select: {
							id: true,
							dm: true,
							name: true,
							isPassword: true,
							picture: true,
							updatedAt: true,
							owners: {
								select: {
									email: true,
									username: true,
								},
							},
							messages: {
								where: {
									unsent: false,
								},
								select: {
									msg: true,
								},
							},
						},
					},
					member: {
						select: {
							id: true,
							dm: true,
							name: true,
							isPassword: true,
							picture: true,
							updatedAt: true,
							owners: {
								select: {
									email: true,
									username: true,
								},
							},
							messages: {
								where: {
									unsent: false,
								},
								select: {
									msg: true,
								},
							},
						},
					},
					invited: {
						select: {
							id: true,
							dm: true,
							name: true,
							isPassword: true,
							picture: true,
							updatedAt: true,
							owners: {
								select: {
									email: true,
									username: true,
								},
							},
							messages: {
								where: {
									unsent: false,
								},
								select: {
									msg: true,
								},
							},
						},
					},
				},
			});
			return returnValue;
		} catch (error) {
			console.log('get__chatList__ByEmail error:', error);
			throw new WsException(error);
		}
	}

	async new__DM(info: DMDto) {
		try {
			const ids: number[] = [];
			const id = await this.get__id__ByEmail(info.email);
			ids.push(id, info.added_id);
			const dm = await this.prisma.channel.create({
				data: {
					dm: true,
					private: true,
					owners: {
						connect: ids.map((id) => ({ id: id })),
					},
				},
			});
			return dm.id;
		} catch (error) {
			console.log('new__DM error:', error);
			throw new WsException(error);
		}
	}

	async new__channel(info: ChannelDto) {
		try {
			const password = await argon.hash(info.password);
			const channel = await this.prisma.channel.create({
				data: {
					name: info.name,
					private: info.private,
					isPassword: info.isPassword,
					password: password,
					owners: {
						connect: {
							email: info.email,
						},
					},
					admins: {
						connect: {
							email: info.email,
						},
					},
					members: {
						connect: info.members.map((id) => ({ id: id.id })),
					},
				},
			});
			return channel.id;
		} catch (error) {
			console.log('new__channel error:', error);
			throw new WsException(error);
		}
	}

	async join__channel(data: updateChannel): Promise<number> {
		try {
			const database = await this.prisma.channel.findUnique({
				where: {
					id: data.channelId,
				},
				select: {
					password: true,
				},
			});
			const pwMatches = await argon.verify(
				database.password,
				data.password,
			);
			if (pwMatches) {
				const channel = await this.prisma.channel.update({
					where: {
						id: data.channelId,
					},
					data: {
						members: {
							connect: {
								email: data.email,
							},
						},
						inviteds: {
							disconnect: {
								email: data.email,
							},
						},
					},
				});
				return channel.id;
			}
		} catch (error) {
			console.log('join__channel error:', error);
			throw new WsException(error.message);
		}
	}

	async leave__channel(data: updateChannel) {
		try {
			await this.prisma.channel.update({
				where: {
					id: data.channelId,
				},
				data: {
					owners: {
						disconnect: {
							email: data.email,
						},
					},
					admins: {
						disconnect: {
							email: data.email,
						},
					},
					members: {
						disconnect: {
							email: data.email,
						},
					},
					inviteds: {
						disconnect: {
							email: data.email,
						},
					},
				},
			});
			const channel = await this.get__chat__ByChannelId(data.channelId);
			if (channel.owners.length === 0) {
				await this.prisma.msg.deleteMany({
					where: {
						cid: data.channelId,
					},
				});
				await this.prisma.user.update({
					where: {
						email: data.email,
					},
					data: {
						owner: {
							disconnect: {
								id: data.channelId,
							},
						},
						admin: {
							disconnect: {
								id: data.channelId,
							},
						},
						member: {
							disconnect: {
								id: data.channelId,
							},
						},
						invited: {
							disconnect: {
								id: data.channelId,
							},
						},
					},
				});
				const deleted = await this.prisma.channel.delete({
					where: {
						id: data.channelId,
					},
				});
				return deleted;
			}
		} catch (error) {
			console.log('delete__channel error:', error);
			throw new WsException(error.message);
		}
	}

	async invite__toChannel(data: updateChannel): Promise<number> {
		try {
			const channel = await this.prisma.channel.update({
				where: {
					id: data.channelId,
				},
				data: {
					inviteds: {
						connect: {
							id: data.invitedId,
						},
					},
				},
			});
			return channel.id;
		} catch (error) {
			console.log('invite__toChannel error:', error);
			throw new WsException(error.message);
		}
	}

	async block__channel(data: updateChannel) {
		try {
			const deleted = await this.leave__channel(data);
			if (!deleted) {
				await this.prisma.channel.update({
					where: {
						id: data.channelId,
					},
					data: {
						blocked: {
							connect: {
								email: data.email,
							},
						},
					},
				});
			}
		} catch (error) {
			console.log('block__channel error:', error);
			throw new WsException(error.message);
		}
	}

	async fetch__msgs(channelId: number): Promise<oneMessage[]> {
		try {
			const source = await this.get__allMsgs(channelId);
			const data = await this.organize__msgs(source);
			return data;
		} catch (error) {
			console.log('fetch__msgs error:', error);
			throw new WsException(error);
		}
	}

	async get__allMsgs(channelId: number) {
		try {
			const source = this.prisma.channel.findUnique({
				where: {
					id: channelId,
				},
				select: {
					messages: {
						where: {
							unsent: false,
						},
						select: {
							id: true,
							msg: true,
							createdAt: true,
							updatedAt: true,
							owner: {
								select: {
									id: true,
									email: true,
									username: true,
								},
							},
						},
					},
				},
			});
			return source;
		} catch (error) {
			console.log('get__allMsgs error:', error);
			throw new WsException(error);
		}
	}

	async organize__msgs(source: any): Promise<oneMessage[]> {
		try {
			const data = [];
			if (source.messages)
				for (let index = 0; index < source.messages.length; index++) {
					const element: oneMessage = {
						msgId: source.messages[index].id,
						id: source.messages[index].owner.id,
						email: source.messages[index].owner.email,
						username: source.messages[index].owner.username,
						msg: source.messages[index].msg,
						createAt: source.messages[index].createdAt,
						updateAt: source.messages[index].updateAt,
						isInvite: false,
					};
					data.push(element);
				}
			return data;
		} catch (error) {
			console.log('organize__msgs error:', error);
			throw new WsException(error);
		}
	}

	async new__msg(data: UseMessageDto) {
		try {
			const id = await this.get__id__ByEmail(data.email);
			const isMuted = await this.check__isMuted(
				data.email,
				data.channelId,
			);
			const allInsiders = await this.get__allInsiders(data.channelId);
			const isInsider = allInsiders.find((insider) => {
				return insider.id === id;
			});
			if (isMuted || !isInsider) return;
			const message = await this.prisma.msg.create({
				data: {
					msg: data.msg,
					history: [data.msg],
					userId: id,
					cid: data.channelId,
				},
			});
			await this.prisma.msg.update({
				where: {
					id: message.id,
				},
				data: {
					updatedAt: message.createdAt,
				},
			});
			const source = await this.get__oneNewMsg(message.id);
			const one = this.organize__oneMsg(source);
			return one;
		} catch (error) {
			console.log('new__msg error:', error);
			throw new WsException(error);
		}
	}

	async update__muteCheckAt(id: number, channelId: number) {
		try {
			await this.prisma.mute.updateMany({
				where: {
					AND: [
						{ userId: id },
						{ cid: channelId },
						{ finished: false },
					],
				},
				data: {
					checkAt: new Date(),
				},
			});
		} catch (error) {
			console.log('update__muteCheckAt error:', error);
			throw new WsException(error);
		}
	}

	async get__mutedRecord(id: number, channelId: number) {
		try {
			const mutedRecord = await this.prisma.mute.findMany({
				where: {
					AND: [
						{ userId: id },
						{ cid: channelId },
						{ finished: false },
					],
				},
			});
			return mutedRecord;
		} catch (error) {
			console.log('get__mutedRecord error:', error);
			throw new WsException(error);
		}
	}

	async update__mute(id: number) {
		try {
			await this.prisma.mute.update({
				where: {
					id: id,
				},
				data: {
					finished: true,
				},
			});
		} catch (error) {
			console.log('check__isMuted error:', error);
			throw new WsException(error);
		}
	}

	async check__isMuted(email: string, channelId: number) {
		try {
			const id = await this.get__id__ByEmail(email);
			await this.update__muteCheckAt(id, channelId);
			const mutedRecord = await this.get__mutedRecord(id, channelId);
			if (mutedRecord.length > 0) {
				const isMuted = mutedRecord.find(async (record) => {
					if (record.checkAt > record.finishAt)
						await this.update__mute(record.id);
					return record.finishAt > record.checkAt;
				});
				return isMuted;
			}
		} catch (error) {
			console.log('check__isMuted error:', error);
			throw new WsException(error);
		}
	}

	async get__oneNewMsg(messageId: number) {
		try {
			const message = await this.prisma.msg.findUnique({
				where: {
					id: messageId,
				},
				select: {
					id: true,
					msg: true,
					createdAt: true,
					updatedAt: true,
					owner: {
						select: {
							id: true,
							email: true,
							username: true,
						},
					},
				},
			});
			return message;
		} catch (error) {
			console.log('get__oneNewMsg error:', error);
			throw new WsException(error);
		}
	}

	async organize__oneMsg(source: any): Promise<oneMessage> {
		try {
			if (source) {
				const element: oneMessage = {
					msgId: source.id,
					id: source.owner.id,
					email: source.owner.email,
					username: source.owner.username,
					msg: source.msg,
					createAt: source.createdAt,
					updateAt: source.updateAt,
					isInvite: false,
				};
				return element;
			}
		} catch (error) {
			console.log('organize__msgs error:', error);
			throw new WsException(error);
		}
	}

	async delete__msg(data: UseMessageDto) {
		try {
			await this.prisma.msg.update({
				where: {
					id: data.msgId,
				},
				data: {
					unsent: true,
				},
			});
		} catch (error) {
			console.log('delete__msg error:', error);
			throw new WsException(error);
		}
	}

	async edit__msg(data: UseMessageDto) {
		try {
			await this.prisma.msg.update({
				where: {
					id: data.msgId,
				},
				data: {
					msg: data.msg,
					history: [data.msg],
				},
			});
		} catch (error) {
			console.log('edit__msg error:', error);
			throw new WsException(error);
		}
	}

	async fetch__owners(channelId: number) {
		try {
			const source = await this.prisma.channel.findUnique({
				where: {
					id: channelId,
				},
				select: {
					owners: true,
				},
			});
			const owners = this.organize__owners(source);
			return owners;
		} catch (error) {
			console.log('fetch__owners error:', error);
			throw new WsException(error);
		}
	}

	organize__owners(source: any) {
		const owners = [];
		if (source)
			for (let index = 0; index < source.owners.length; index++) {
				const owner: oneUser = {
					online: false,
					username: source.owners[index].username,
					email: source.owners[index].email,
					picture: source.owners[index].picture,
					isOwner: true,
					isAdmin: true,
					isInvited: false,
					isMuted: false,
				};
				owners.push(owner);
			}
		return owners;
	}

	async fetch__admins(channelId: number) {
		try {
			const source = await this.prisma.channel.findUnique({
				where: {
					id: channelId,
				},
				select: {
					admins: true,
				},
			});
			const admins = this.organize__admins(source);
			return admins;
		} catch (error) {
			console.log('fetch__admins error:', error);
			throw new WsException(error);
		}
	}

	organize__admins(source: any) {
		const admins = [];
		if (source && source.admins)
			for (let index = 0; index < source.admins.length; index++) {
				const admin: oneUser = {
					online: false,
					username: source.admins[index].username,
					email: source.admins[index].email,
					picture: source.admins[index].picture,
					isOwner: false,
					isAdmin: true,
					isInvited: false,
					isMuted: false,
				};
				admins.push(admin);
			}
		return admins;
	}

	async fetch__members(channelId: number) {
		try {
			const source = await this.prisma.channel.findUnique({
				where: {
					id: channelId,
				},
				select: {
					members: true,
				},
			});
			const members = this.organize__members(source);
			return members;
		} catch (error) {
			console.log('fetch__members error:', error);
			throw new WsException(error);
		}
	}

	organize__members(source: any) {
		const members = [];
		if (source && source.members)
			for (let index = 0; index < source.members.length; index++) {
				const member: oneUser = {
					online: false,
					username: source.members[index].username,
					email: source.members[index].email,
					picture: source.members[index].picture,
					isOwner: false,
					isAdmin: false,
					isInvited: false,
					isMuted: false,
				};
				members.push(member);
			}
		return members;
	}

	async fetch__inviteds(channelId: number) {
		try {
			const source = await this.prisma.channel.findUnique({
				where: {
					id: channelId,
				},
				select: {
					inviteds: true,
				},
			});
			const inviteds = this.organize__inviteds(source);
			return inviteds;
		} catch (error) {
			console.log('fetch__inviteds error:', error);
			throw new WsException(error);
		}
	}

	organize__inviteds(source: any) {
		const inviteds = [];
		if (source && source.inviteds)
			for (let index = 0; index < source.inviteds.length; index++) {
				const member: oneUser = {
					online: false,
					username: source.inviteds[index].username,
					email: source.inviteds[index].email,
					picture: source.inviteds[index].picture,
					isOwner: false,
					isAdmin: false,
					isInvited: true,
					isMuted: false,
				};
				inviteds.push(member);
			}
		return inviteds;
	}

	async get__allUsers() {
		try {
			const suggestion = await this.prisma.user.findMany({
				select: {
					id: true,
					username: true,
					avatar: true,
				},
			});
			return suggestion;
		} catch (error) {
			console.log('get__allUsers error:', error);
			throw new WsException(error);
		}
	}

	async get__allBlockers(channelId: number) {
		try {
			const source = await this.prisma.channel.findUnique({
				where: {
					id: channelId,
				},
				select: {
					blocked: {
						select: {
							id: true,
						},
					},
				},
			});
			return source;
		} catch (error) {
			console.log('get__allBlockers error:', error);
			throw new WsException(error);
		}
	}

	async get__allInsiders(channelId: number) {
		try {
			const source = await this.prisma.channel.findUnique({
				where: {
					id: channelId,
				},
				select: {
					owners: {
						select: {
							id: true,
							username: true,
						},
					},
					admins: {
						select: {
							id: true,
							username: true,
						},
					},
					members: {
						select: {
							id: true,
							username: true,
						},
					},
					inviteds: {
						select: {
							id: true,
							username: true,
						},
					},
				},
			});
			const suggestion = this.organize__allInsider(source);
			return suggestion;
		} catch (error) {
			console.log('get__allInsiders error:', error);
			throw new WsException(error);
		}
	}

	organize__allInsider(source: any) {
		const insiders = [];
		if (source.owners) {
			for (let index = 0; index < source.owners.length; index++) {
				const insider = {
					id: source.owners[index].id,
					name: source.owners[index].name,
				};
				insiders.push(insider);
			}
		}
		if (source.admins) {
			for (let index = 0; index < source.admins.length; index++) {
				const insider = {
					id: source.admins[index].id,
					name: source.admins[index].name,
				};
				insiders.push(insider);
			}
		}
		if (source.members) {
			for (let index = 0; index < source.members.length; index++) {
				const insider = {
					id: source.members[index].id,
					name: source.members[index].name,
				};
				insiders.push(insider);
			}
		}
		if (source.inviteds) {
			for (let index = 0; index < source.inviteds.length; index++) {
				const insider = {
					id: source.inviteds[index].id,
					name: source.inviteds[index].name,
				};
				insiders.push(insider);
			}
		}
		return insiders;
	}

	organize__tags(source: any, id: number) {
		const users = [];
		if (source.length > 0) {
			for (const element of source) {
				if (element.id !== id) {
					const user = {
						id: element.id,
						name: element.username,
					};
					users.push(user);
				}
			}
		}
		return users;
	}

	async get__userTags(email: string) {
		try {
			const id = await this.get__id__ByEmail(email);
			const source = await this.get__allUsers();
			const tags = await this.organize__tags(source, id);
			return tags;
		} catch (error) {
			console.log('get__userTags error:', error);
			throw new WsException(error);
		}
	}

	async get__invitationTags(channelId: number) {
		try {
			const usersSource = await this.get__allUsers();
			const allUsers = await this.organize__tags(usersSource, -1);
			const allInsiders = await this.get__allInsiders(channelId);
			const allBlockers = await this.get__allBlockers(channelId);
			const invitationTags = await this.organize__invitationTags(
				allUsers,
				allInsiders,
				allBlockers,
			);
			return invitationTags;
		} catch (error) {
			console.log('get__invitationTags error:', error);
			throw new WsException(error);
		}
	}

	async organize__invitationTags(
		allUsers: any,
		allInsiders: any,
		allBlockers: any,
	) {
		const filterInsiders = allUsers.filter((user: any) => {
			return !allInsiders.some((insider: any) => {
				return user.id === insider.id;
			});
		});
		if (allBlockers.blocked.length > 0) {
			const filterBlockers = filterInsiders.filter((user: any) => {
				return !allBlockers.blocked.some((blocker: any) => {
					return user.id === blocker.id;
				});
			});
			return filterBlockers;
		}
		return filterInsiders;
	}

	// async get__blockedTags(email: string) {
	// 	try {
	// 		const id = await this.get__id__ByEmail(email);
	// 		const source = await this.get__allBlocked(id);
	// 		const tags = await this.organize__tags(source, -1);
	// 		return tags;
	// 	} catch (error) {
	// 		console.log('get__userTags error:', error);
	// 		throw new WsException(error);
	// 	}
	// }

	// async get__allBlocked(id: number) {
	// 	try {
	// 		const source = await this.prisma.user.findUnique({
	// 			where: {
	// 				id: id,
	// 			},
	// 			select: {
	// 				blocked: {
	// 					select: {
	// 						id: true,
	// 						username: true,
	// 					},
	// 				},
	// 			},
	// 		});
	// 		return source;
	// 	} catch (error) {
	// 		console.log('get__allBlocked error:', error);
	// 		throw new WsException(error);
	// 	}
	// }

	async get__publicChats() {
		try {
			const rooms = await this.prisma.channel.findMany({
				where: {
					private: false,
				},
				select: {
					id: true,
					name: true,
					picture: true,
				},
			});
			return rooms;
		} catch (error) {
			console.log('get__publicChats error:', error);
			throw new WsException(error);
		}
	}

	async organize__searchSuggest(id, users, publicChats, myChats) {
		try {
			const suggestion = [];
			let myChatsLength = 0,
				usersLength = 0;
			if (myChats) {
				myChatsLength = myChats.length;
				for (const [index, myChat] of myChats.entries()) {
					const one: oneSuggestion = {
						catagory: 'my chat',
						picture: myChat.picture,
						name: myChat.name,
						id: index,
						data_id: myChat.id,
					};
					suggestion.push(one);
				}
			}

			if (users) {
				const usersFiltered = users.filter((user) => {
					return (
						suggestion.filter((sug: oneSuggestion) => {
							return sug.name == user.name;
						}).length === 0 && user.id != id
					);
				});

				usersLength = usersFiltered.length;

				for (const [index, element] of usersFiltered.entries()) {
					const one: oneSuggestion = {
						catagory: 'user',
						picture: element.picture,
						name: element.username,
						id: myChatsLength + index,
						data_id: element.id,
					};
					suggestion.push(one);
				}
			}

			if (publicChats) {
				const publicChatsFiltered = publicChats.filter((chat) => {
					return (
						suggestion.filter((sug) => {
							return sug.data_id == chat.id;
						}).length === 0
					);
				});

				for (const [index, element] of publicChatsFiltered.entries()) {
					const one: oneSuggestion = {
						catagory: 'public chat',
						picture: element.picture,
						name: element.name,
						id: usersLength + myChatsLength + index,
						data_id: element.id,
					};
					suggestion.push(one);
				}
			}
			return suggestion;
		} catch (error) {
			console.log('organize__searchSuggest error:', error);
			throw new WsException(error);
		}
	}

	async get__searchSuggest(email: string) {
		try {
			const id = await this.get__id__ByEmail(email);
			const users = await this.get__allUsers();
			const publicChats = await this.get__publicChats();
			const myChats = await this.get__previews(email);
			const suggestion = await this.organize__searchSuggest(
				id,
				users,
				publicChats,
				myChats,
			);
			return suggestion;
		} catch (error) {
			console.log('get__searchSuggest error:', error);
			throw new WsException(error);
		}
	}

	async be__admin(data: updateChannel) {
		try {
			await this.prisma.channel.update({
				where: {
					id: data.channelId,
				},
				data: {
					admins: {
						connect: {
							email: data.adminEmail,
						},
					},
					members: {
						disconnect: {
							email: data.adminEmail,
						},
					},
				},
			});
		} catch (error) {
			console.log('be__admin error:', error);
			throw new WsException(error.message);
		}
	}

	async not__admin(data: updateChannel) {
		try {
			await this.prisma.channel.update({
				where: {
					id: data.channelId,
				},
				data: {
					admins: {
						disconnect: {
							email: data.adminEmail,
						},
					},
					members: {
						connect: {
							email: data.adminEmail,
						},
					},
				},
			});
		} catch (error) {
			console.log('not__admin error:', error);
			throw new WsException(error.message);
		}
	}

	async get__setting(channelId: number) {
		try {
			const info = await this.prisma.channel.findUnique({
				where: {
					id: channelId,
				},
				select: {
					private: true,
					isPassword: true,
				},
			});
			return info;
		} catch (error) {
			console.log('get__setting error:', error);
			throw new WsException(error.message);
		}
	}

	async verify__UpdateSettingRight(ownerHash: string, channelId: number) {
		const ownerPass = await this.prisma.channel.findUnique({
			where: {
				id: channelId,
			},
			select: {
				owners: {
					select: {
						hash: true,
					},
				},
			},
		});
		return await argon.verify(ownerPass.owners[0].hash, ownerHash);
	}

	async update__setting(data: updateChannel) {
		try {
			const verified = await this.verify__UpdateSettingRight(
				data.ownerPassword,
				data.channelId,
			);
			if (verified) {
				await this.prisma.channel.update({
					where: {
						id: data.channelId,
					},
					data: {
						private: data.private,
						isPassword: data.isPassword,
					},
				});
				if (data.newPassword !== '')
					await this.prisma.channel.update({
						where: {
							id: data.channelId,
						},
						data: {
							password: data.newPassword,
						},
					});
			}
		} catch (error) {
			console.log('update__setting error:', error);
			throw new WsException(error.message);
		}
	}

	async new__mute(data: mute) {
		try {
			const id = await this.get__id__ByEmail(data.email);
			await this.prisma.mute.create({
				data: {
					finishAt: moment
						.utc(new Date())
						.add(data.duration, 'minute')
						.toISOString(),
					userId: id,
					cid: data.chanelId,
				},
			});
		} catch (error) {
			console.log('new__mute error:', error);
			throw new WsException(error.message);
		}
	}
}
