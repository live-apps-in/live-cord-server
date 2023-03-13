import { Observable } from 'rxjs';
export interface ReactionRoleService {
  reactionRolesAction(
    payload: ReactionRoleActionReqDto,
  ): Observable<ReactionRoleActionResDto>;
}

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
