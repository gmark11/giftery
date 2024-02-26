/**
 * Perform a GET request to https://platform.giftery.studio/open/random-color/{number} using the number of the square
 * Return if response is a color HEX code (string)
 * Return red in all other cases
 */
export type GET_COLOR_RES_DTO = {
    color: string
}

const isValidHexColor = (hex: string) => {
    const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$|^#(?:[0-9a-fA-F]{4}){1,2}$/
    return regex.test(hex)
}

const getColor = async (index: string): Promise<string> => {
    const redColor = '#ff0000'

    try {
        const res = await fetch(`https://platform.giftery.studio/open/random-color/${index}`)

        const hexColor = await res.text()

        if (isValidHexColor(hexColor)) {
            return hexColor
        }
        return redColor
    } catch (error: any) {
        return redColor
    }
}

export async function GET({ params }) {
    const currentIndex = params.index

    const color = await getColor(currentIndex)

    const colorData: GET_COLOR_RES_DTO = {
        color
    }

    return new Response(JSON.stringify(colorData))
}
