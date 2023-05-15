export interface GuildService {
  getGuildById(data: GetGuildReq): GetGuildRes;
  syncCreateGuildMember(data: GuildMemberReq): GuildMemberRes;
  syncRemoveGuildMember(data: GuildMemberReq): GuildMemberRes;
}

export interface GetGuildReq {
  guildId: string;
}

export interface GetGuildRes {
  name: string;
}

export interface GuildMemberReq {
  guildId: string;
  userId: string;
}

export interface GuildMemberRes {
  message: string;
}
