import { DateTime } from 'luxon'
import { BaseModel, hasMany, column } from '@adonisjs/lucid/orm'
import type { HasMany } from "@adonisjs/lucid/types/relations";
import CCTLQuestion from '#models/cctl_question'

export default class Cctl extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titre: string

  @column()
  declare promotion: string

  @column.dateTime()
  declare date: DateTime | null

  @column()
  declare duree: string | null

  @hasMany(() => CCTLQuestion)
  declare cctlQuestions: HasMany<typeof CCTLQuestion>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
