import fs from 'fs'
import { menuSchema, roleSchema, userSchema } from "../src/utils/validators"
import assert from "assert"
import app from '../src/app'
import { PORT } from '../src/config/config'
import { getDb } from '../src/services/mongodb'
import { DbCollections } from '../src/config/enums'

function docToObject(obj: any) {
  if (Object.keys(obj).length == 1) {
    for (let k in obj) {
      if (k.includes('$numberLong'))
        return Number(obj[k])
      if (k.includes('$'))
        return obj[k]
    }
  }
  for (let k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      const a = docToObject(obj[k])
      if (a)
        obj[k] = a
    }
  }
}

export default async (globalConfig: unknown, projectConfig: unknown) => {
  const menusJsn = JSON.parse(fs.readFileSync('./src/config/data/menus.json', 'utf-8'))
  const rolesJsn = JSON.parse(fs.readFileSync('./src/config/data/roles.json', 'utf-8'))
  const usersJsn = JSON.parse(fs.readFileSync('./src/config/data/users.json', 'utf-8'))

  docToObject(menusJsn)
  docToObject(rolesJsn)
  docToObject(usersJsn)

  const menus = []
  const roles = []
  const users = []

  try {
    for (let m in menusJsn) menus.push(menuSchema.parse(menusJsn[m]))
    for (let r in rolesJsn) roles.push(roleSchema.parse(rolesJsn[r]))
    for (let u in usersJsn) users.push(userSchema.parse(usersJsn[u]))
  } catch (e) {
    console.error(e)
  }

  assert(menus.length == 6)
  assert(roles.length == 2)
  assert(users.length == 1)

  try {
    const db = await getDb()

    await db.collection(DbCollections.DEVICES)
      .createIndex({
        name: 'text',
        topic: 'text',
      })
  } catch (e) {
    console.error(`[TEST SETUP] ${e}`);
  }

  console.log(`[TEST SETUP] Done!!!...`);

  app.listen(PORT, () => console.log(`[SERVER STARTED ON ${PORT}]`))
}