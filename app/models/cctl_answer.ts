import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm'
import CCTLQuestion from "#models/cctl_question";
import type {BelongsTo} from "@adonisjs/lucid/types/relations";

export default class CctlAnswer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare texte: string | null

  @column()
  declare correction: string

  @column()
  declare cctlQuestionId: number

  @belongsTo(() => CCTLQuestion)
  declare cctlQuestion: BelongsTo<typeof CCTLQuestion>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
