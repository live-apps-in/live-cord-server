export interface GuildService {
  hello(data: NewGuildMemberReq): NewGuildMemberRes;
}

export interface NewGuildMemberReq {
  guildId: string;
  userId: string;
}

export interface NewGuildMemberRes {
  message: string;
}
