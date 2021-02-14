import { mongoHelper } from '../infra/db/mongodb/helpers/mongoHelper'

import env from './config/env'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '..', '..', '.env') })

mongoHelper.connect(env.mongoUrl).then(async () => {
  const { default: app } = (await import('./config/app'))
  app.listen(env.port, () => console.log(`Server listening on port ${env.port}`))
}).catch(console.error)
