import fs from 'fs'
import stream from 'stream'
import got from 'got'
import { promisify } from 'util'

import { zoomLevelMapper, getImageTypeString } from './mappers'
import { Tile } from '../../usecases/download-image/types'
import { Timeout } from '../../types'

const pipeline = promisify(stream.pipeline)

export const downloadTile = async (
  tile: Tile,
  outputPath: string,
  timeout: Timeout,
): Promise<void> => {
  const file = `${outputPath}/${tile.name}`
  const stream = fs.createWriteStream(file)

  try {
    return await pipeline(
      got.stream(tile.url, {
        timeout,
        retry: 4,
        headers: {
          Connection: 'keep-alive',
        },
      }),
      stream,
    )
  } catch (err) {
    console.error(`Failed to download ${tile.url}`)
    throw err
  }
}

export { zoomLevelMapper, getImageTypeString }
