import { Observable } from 'rxjs';

/** Service **/
export interface GuildService {
  getAllUserGuilds(payload: GetAllUserGuildReq): Observable<GetAllUserGuildRes>;
}
export interface ReactionRoleService {
  reactionRolesAction(
    payload: ReactionRoleActionReqDto,
  ): Observable<ReactionRoleActionResDto>;
}

/** Guild Service **/
interface GetAllUserGuildReq {
  discordId: string;
}
interface GetAllUserGuildRes {
  name: string;
}

/** Reaction Role Service **/
interface ReactionRoleActionReqDto {
  name: string;
  channelId: string;
  guildId: string;
  action: string;
  discordEmbedConfig: string;
  rolesMapping: any[];
  reactionRoleMessageRef: string;
}

interface ReactionRoleActionResDto {
  reactionRoleMessageRef: string;
}
