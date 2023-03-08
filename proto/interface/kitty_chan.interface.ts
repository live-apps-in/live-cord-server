import * as grpc from '@grpc/grpc-js'
export interface ReactionRoleService{
    reactionRolesAction(payload: ReactionRoleActionReqDto, metadata: grpc.Metadata): Promise<ReactionRoleActionResDto>
}

interface ReactionRoleActionReqDto {
  name: string
  channelId: string
  action: string
  reactionRoleMessageRef: string
  discordEmbedConfig: string
}

interface ReactionRoleActionResDto {
  reactionRoleMessageRef: string
}