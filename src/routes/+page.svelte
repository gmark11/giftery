<script lang="ts">
    import Button from '../components/Button.svelte'
    import { onDestroy, onMount } from 'svelte'
    import { fabric } from 'fabric'
    import { generateRectangle, fetchColor } from '$lib'
    import fileSaver from 'file-saver'
    import type { Canvas } from 'fabric/fabric-impl'

    let fabricInstance: Canvas
    let counter: number = 0
    let isLoading: boolean = false
    let zIndex = 1

    let fabricObjects = []
    let fabricObjectsTrigger = 0

    $: (fabricObjects = fabricInstance?.getObjects().sort((a: any, b: any) => b.zIndex - a.zIndex)),
        fabricObjectsTrigger

    onMount(() => {
        fabricInstance = new fabric.Canvas('canvas')
        fabricInstance.backgroundColor = '#E9D5FF'
        fabricInstance.renderAll()

        fabricInstance.on('selection:updated', (ev) => {
            ev.selected
                .sort((a: any, b: any) => a.zIndex - b.zIndex)
                .forEach((ob) => {
                    ob.moveTo(zIndex)
                    zIndex += 1
                    ob.setOptions({ zIndex })
                })
            fabricObjectsTrigger += 1
        })

        fabricInstance.on('selection:created', (ev) => {
            ev.selected
                .sort((a: any, b: any) => a.zIndex - b.zIndex)
                .forEach((ob) => {
                    ob.moveTo(zIndex)
                    zIndex += 1
                    ob.setOptions({ zIndex })
                })
            fabricObjectsTrigger += 1
        })
    })

    onDestroy(() => {
        fabricInstance?.dispose()
    })

    const addSquare = async () => {
        counter += 1

        isLoading = true
        const colorRes = await fetchColor(counter)

        isLoading = false

        const rect = generateRectangle({
            height: 50,
            width: 50,
            color: colorRes.color,
            area: { height: 400, width: 400 }
        })

        rect.setOptions({ zIndex })
        rect.moveTo(zIndex)
        zIndex += 1

        fabricInstance.add(rect)
        fabricObjectsTrigger += 1

        /**
         * Perform a GET request to /color with the number of the square to get a random color
         * Display a loading spinner instead of button while loading
         * Add a 50x50px square of color, to random position on canvas
         *
         * See: http://fabricjs.com/fabric-intro-part-1#objects
         */
    }

    const clearSquares = () => {
        /**
         * Remove all squares from canvas
         */

        counter = 0
        zIndex = 1
        fabricObjectsTrigger += 1
        fabricInstance.clear()
        fabricInstance.backgroundColor = '#E9D5FF'
        fabricInstance.renderAll()
    }

    const downloadImage = () => {
        /**
         * Download canvas as PNG
         */
        const url = fabricInstance.toDataURL({
            format: 'png'
        })

        fileSaver.saveAs(url, 'canvas.png')
    }
</script>

<div class="container mx-auto py-8">
    <div class="flex bg-slate-100">
        <canvas id="canvas" width="400" height="400" />
        <div class="p-8 space-y-4">
            <div class="flex gap-4">
                <Button action={addSquare} label="Add square" {isLoading} disabled={isLoading} />
                <Button action={clearSquares} label="Clear squares" disabled={isLoading} />
                <Button action={downloadImage} label="Download image" disabled={isLoading} />
            </div>
            <h2 class="text-xl">Squares:</h2>
            <ul class="max-h-96 overflow-auto">
                {#if fabricObjects}
                    {#each fabricObjects as fabricObject}
                        <li class="flex items-center mt-2">
                            <div
                                class="size-10"
                                style="background-color: {fabricObject.fill};"
                            ></div>
                            <span class="ml-1">zIndex : {fabricObject.zIndex}</span>
                        </li>
                    {/each}
                {/if}
                <!-- List of squares in the order of their "z" index -->
                <!-- Entries of list can be drag&dropped and that action should updateir "z" order on the canvas -->
            </ul>
        </div>
    </div>
</div>
