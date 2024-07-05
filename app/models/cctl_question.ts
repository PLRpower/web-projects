import { DateTime } from 'luxon'
import CCTL from '#models/cctl'
import CCTLAnswer from '#models/cctl_answer'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class CctlQuestion extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare numero: number

  @column()
  declare type: string

  @column()
  declare texte: string

  @column()
  declare correction: string | null

  @column()
  declare cctlId: number

  @belongsTo(() => CCTL)
  declare cctl: BelongsTo<typeof CCTL>

  @hasMany(() => CCTLAnswer)
  declare cctlAnswers: HasMany<typeof CCTLAnswer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
