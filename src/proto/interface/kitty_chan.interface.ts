import { Observable } from 'rxjs';
export interface ReactionRoleService {
  reactionRolesAction(
    payload: ReactionRoleActionReqDto,
  ): Observable<ReactionRoleActionResDto>;
}

interface ReactionRoleActionReqDto {
  name: string;
  channelId: string;
  action: string;
  reactionRoleMessageRef: string;
  discordEmbedConfig: string;
}

interface ReactionRoleActionResDto {
  reactionRoleMessageRef: string;
}
