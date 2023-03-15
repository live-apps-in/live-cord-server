export interface GuildService {
  syncCreateGuildMember(data: GuildMemberReq): GuildMemberRes;
  syncRemoveGuildMember(data: GuildMemberReq): GuildMemberRes;
}

export interface GuildMemberReq {
  guildId: string;
  userId: string;
}

export interface GuildMemberRes {
  message: string;
}
