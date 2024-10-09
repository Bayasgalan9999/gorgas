import { ObjectId } from 'mongodb'
import {
  ALL_ACTIONS,
  KIND_AND_ACTIONS,
  KIND_AND_DB,
  AccessConrtolActions,
  AccessControlKinds,
  DbCollections,
} from '../config/enums'
import { getDb } from './mongodb'

function mergeResources(actions: AccessConrtolActions[], refinedActions: { [K in AccessConrtolActions]?: string[] }) {
  const areActionsRecorded = actions.every(action => ALL_ACTIONS.includes(action))
  if (!areActionsRecorded)
    return []

  const result = actions.reduce<string[]>((total, action, index) => {
    if (index <= 0)
      return [...refinedActions[action] || []]
    if (total.includes('*') && !(refinedActions[action] || []).includes('*'))
      return [...refinedActions[action] || []]
    if (total.includes('*') && (refinedActions[action] || []).includes('*'))
      return [...total]

    return total.filter(item => (refinedActions[action] || []).includes(item))
  }, [])

  // console.log('[mergeResources]')
  // console.log(result)
  return result
}

async function refineActions(userId: ObjectId, kind: AccessControlKinds) {
  const db = await getDb()
  const user = await db
    .collection(DbCollections.USERS)
    .findOne({ _id: userId })

  if (!user) return {}

  const role = await db
    .collection(DbCollections.ROLES)
    .findOne({ _id: user.roleId })

  if (!role) return {}

  const rule = role.rules[kind] || []
  const refinedActions: { [K in AccessConrtolActions]?: string[] } = {}

  rule.forEach(({
    actions: originalActions,
    resources
  }) => {
    const actions = originalActions.includes(AccessConrtolActions.ALL) ?
      KIND_AND_ACTIONS[kind] :
      originalActions

    actions.forEach(action => {
      refinedActions[action] = [
        ...new Set([
          ...(resources ?? []).map(x => String(x)),
          ...refinedActions[action] || []
        ])
      ]
      if ((refinedActions[action] || []).includes('*'))
        refinedActions[action] = ['*']
    })
  })

  return refinedActions
}

export async function checkAllowance(challenge: {
  userId: ObjectId;
  kind: AccessControlKinds;
  actions: AccessConrtolActions[],
  resources: string[]
}) {
  const db = await getDb()
  const refinedActions = await refineActions(challenge.userId, challenge.kind)
  // console.log('refined-actions', refinedActions)

  const countOfResources = await db
    .collection(KIND_AND_DB[challenge.kind])
    .countDocuments()
  // console.log('count-of-resources', countOfResources)
  // console.log('every actions in refined: ', challenge.actions.every(x => x in refinedActions))

  if (!challenge.actions.every(x => x in refinedActions))
    return { allowance: false }

  // challenge-actions:ALL
  if (challenge.actions.includes(AccessConrtolActions.ALL) || challenge.actions.length >= KIND_AND_ACTIONS[challenge.kind].length) {
    // number of actions not enough
    if (Object.keys(refinedActions).length < KIND_AND_ACTIONS[challenge.kind].length)
      return { allowance: false }

    // number of actions enough
    const mergedResources = mergeResources(Object.keys(refinedActions) as AccessConrtolActions[], refinedActions)
    // number of resources enough
    if (mergedResources.includes('*') || mergedResources.length >= countOfResources && countOfResources !== 0)
      return { allowance: true }

    // number of resources not enough
    // challenge-resources:ALL
    if (challenge.resources.includes('*') || challenge.resources.length >= countOfResources && countOfResources !== 0)
      return { allowance: false }

    // challenge-resources:NOT ALL
    return {
      allowance: challenge.resources.every(resource => mergedResources.includes(resource))
    }
  }
  // challenge-actions:NOT ALL
  const mergedResources = mergeResources(challenge.actions, refinedActions)
  // number of resources enough
  if (mergedResources.includes('*') || mergedResources.length >= countOfResources)
    return { allowance: true }

  // number of resources not enough
  // challenge-resources:ALL
  if (challenge.resources.includes('*') || challenge.resources.length >= countOfResources)
    return { allowance: false }

  // challenge-resources:NOT ALL
  return {
    allowance: challenge.resources.every(resource => mergedResources.includes(resource))
  }
}

export async function getAllowedResources(challenge: {
  userId: ObjectId;
  kind: AccessControlKinds;
  actions: AccessConrtolActions[],
}) {
  // console.log('[getAllowedResources]')
  // console.log(challenge)
  const refinedActions = await refineActions(challenge.userId, challenge.kind)
  // console.log('refined-actions', refinedActions)

  const actions = challenge.actions.includes(AccessConrtolActions.ALL) ?
    KIND_AND_ACTIONS[challenge.kind] :
    challenge.actions

  return {
    resources: mergeResources(actions, refinedActions)
  }
}