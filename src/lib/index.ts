import { fabric } from 'fabric'
import random from 'lodash/random'
import type { GET_COLOR_RES_DTO } from '../routes/color/[index]/+server'

export const generateRectangle = ({
    height,
    width,
    color,
    area
}: {
    height: number
    width: number
    color: string
    area: { width: number; height: number }
}) => {
    const top = random(height, area.height)
    const left = random(width, area.width)

    const rect = new fabric.Rect({
        left,
        top,
        fill: color,
        width,
        height
    })

    return rect
}

export const fetchColor = async (index: number) => {
    const res = await fetch(`/color/${index}`)

    const json = (await res.json()) as GET_COLOR_RES_DTO

    return json
}
