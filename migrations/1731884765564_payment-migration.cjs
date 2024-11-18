/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
  pgm.createSchema('payment', { ifNotExists: true, authorization: '"payment-api-tech-challenge"' });
  pgm.createTable('payment.payment', {
    id: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
      primaryKey: true
    },
    order_id: {
      type: 'varchar(255)',
      notNull: true,
    },
    value: {
      type: 'decimal',
      notNull: true
    },
    integration_id: {
      type: 'varchar'
    },
    qr_code: {
      type: 'varchar'
    },
    cpf: {
        type: 'varchar(11)'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
  pgm.createTable('payment.payment_status', {
    id: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
      primaryKey: true
    },
    payment_id: {
      type: 'varchar(255)',
      notNull: true,
      references: 'payment.payment',
      onDelete: 'cascade'
    },
    status: {
      type: 'varchar(255)',
      notNull: true
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {}
