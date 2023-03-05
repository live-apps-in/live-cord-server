
export interface ReactionRoleService{
    reactionRolesAction(payload: ReactionRoleActionReqDto): Promise<ReactionRoleActionResDto>
}

interface ReactionRoleActionReqDto {
  name: string
  channelId: string
  action: string
  reaction_role_message_ref: string
  discordEmbedConfig: string
}

interface ReactionRoleActionResDto {
  messageRef: string
}