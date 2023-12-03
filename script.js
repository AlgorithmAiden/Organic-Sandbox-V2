//setup the canvas
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

import * as Colors from './utils/Colors.js'

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.onresize = () => location.reload()


const changePixel = (x, y, type, newHeat) => {
    const oldPixel = grid[x][y]
    const oldPixelType = pixelTypes[oldPixel.type]
    oldPixelType.onDestroy ? oldPixelType.onDestroy(x, y, oldPixel) : null
    const newPixelType = pixelTypes[type]
    const newPixel = { type, hasMoved: false, mem: {}, heat: oldPixel.heat }
    newHeat ? newPixel.heat = newPixelType.defaultHeat : null
    grid[x][y] = newPixel
    newPixelType.onCreate ? newPixelType.onCreate(x, y, newPixel) : null
    newPixel.hasMoved = true
}

const shareHeat = (x1, y1, x2, y2) => {
    const pixel1 = grid[x1][y1]
    const pixel2 = grid[x2][y2]
    const averageRate = (pixelTypes[pixel1.type].heatSpeed + pixelTypes[pixel2.type].heatSpeed) / 2
    const difference = pixel1.heat - pixel2.heat
    pixel1.heat -= difference * averageRate
    pixel2.heat += difference * averageRate
}

const isPixelAt = (x, y) => x >= 0 && y >= 0 && x < gridX && y < gridY

const typeAt = (x, y) => pixelTypes[grid[x][y].type]

const gasSim = (x, y, pixel, verticalChance, horizontalChance) => {
    const pixelType = pixelTypes[pixel.type]
    if (isPixelAt(x, y - 1)) {
        const otherType = typeAt(x, y - 1)
        if (
            (otherType.types.includes('gas') &&
                otherType.weight > pixelType.weight) ||
            otherType.types.includes('empty')) {
            if (Math.random() <= verticalChance && !grid[x][y - 1].hasMoved) {
                swapPixels(x, y, x, y - 1)
                return true
            }
            return false
        }
    }
    if (Math.random() < .5) {
        if (isPixelAt(x - 1, y)) {
            const otherType = typeAt(x - 1, y)
            if (
                (otherType.types.includes('gas') &&
                    otherType.weight > pixelType.weight) ||
                otherType.types.includes('empty')) {
                if (Math.random() <= horizontalChance && !grid[x - 1][y].hasMoved) {
                    swapPixels(x, y, x - 1, y)
                    return true
                }
                return false
            }
        }
        if (isPixelAt(x + 1, y)) {
            const otherType = typeAt(x + 1, y)
            if (
                (otherType.types.includes('gas') &&
                    otherType.weight > pixelType.weight) ||
                otherType.types.includes('empty')) {
                if (Math.random() <= horizontalChance && !grid[x + 1][y].hasMoved) {
                    swapPixels(x, y, x + 1, y)
                    return true
                }
                return false
            }
        }
    }
    if (isPixelAt(x + 1, y)) {
        const otherType = typeAt(x + 1, y)
        if (
            (otherType.types.includes('gas') &&
                otherType.weight > pixelType.weight) ||
            otherType.types.includes('empty')) {
            if (Math.random() <= horizontalChance && !grid[x + 1][y].hasMoved) {
                swapPixels(x, y, x + 1, y)
                return true
            }
            return false
        }
    }
    if (isPixelAt(x - 1, y)) {
        const otherType = typeAt(x - 1, y)
        if (
            (otherType.types.includes('gas') &&
                otherType.weight > pixelType.weight) ||
            otherType.types.includes('empty')) {
            if (Math.random() <= horizontalChance && !grid[x - 1][y].hasMoved) {
                swapPixels(x, y, x - 1, y)
                return true
            }
            return false
        }
    }
}

const liquidSim = (x, y, pixel, verticalChance = 1, horizontalChance = 1) => {
    const pixelType = pixelTypes[pixel.type]
    if (isPixelAt(x, y + 1)) {
        const otherType = typeAt(x, y + 1)
        if (
            (otherType.types.includes('liquid') &&
                otherType.weight > pixelType.weight) ||
            otherType.types.includes('gas') ||
            otherType.types.includes('empty')) {
            if (Math.random() <= verticalChance && !grid[x][y + 1].hasMoved) {
                swapPixels(x, y, x, y + 1)
                return true
            }
            return false
        }
    }
    if (Math.random() < .5) {
        if (isPixelAt(x - 1, y)) {
            const otherType = typeAt(x - 1, y)
            if (
                (otherType.types.includes('liquid') &&
                    otherType.weight > pixelType.weight) ||
                otherType.types.includes('gas') ||
                otherType.types.includes('empty')) {
                if (Math.random() <= horizontalChance && !grid[x - 1][y].hasMoved) {
                    swapPixels(x, y, x - 1, y)
                    return true
                }
                return false
            }
        }
        if (isPixelAt(x + 1, y)) {
            const otherType = typeAt(x + 1, y)
            if (
                (otherType.types.includes('liquid') &&
                    otherType.weight > pixelType.weight) ||
                otherType.types.includes('gas') ||
                otherType.types.includes('empty')) {
                if (Math.random() <= horizontalChance && !grid[x + 1][y].hasMoved) {
                    swapPixels(x, y, x + 1, y)
                    return true
                }
                return false
            }
        }
    }
    if (isPixelAt(x + 1, y)) {
        const otherType = typeAt(x + 1, y)
        if (
            (otherType.types.includes('liquid') &&
                otherType.weight > pixelType.weight) ||
            otherType.types.includes('gas') ||
            otherType.types.includes('empty')) {
            if (Math.random() <= horizontalChance && !grid[x + 1][y].hasMoved) {
                swapPixels(x, y, x + 1, y)
                return true
            }
            return false
        }
    }
    if (isPixelAt(x - 1, y)) {
        const otherType = typeAt(x - 1, y)
        if (
            (otherType.types.includes('liquid') &&
                otherType.weight > pixelType.weight) ||
            otherType.types.includes('gas') ||
            otherType.types.includes('empty')) {
            if (Math.random() <= horizontalChance && !grid[x - 1][y].hasMoved) {
                swapPixels(x, y, x - 1, y)
                return true
            }
            return false
        }
    }
}

const sandSim = (x, y, pixel, verticalChance = 1) => {
    const pixelType = pixelTypes[pixel.type]
    if (isPixelAt(x, y + 1)) {
        const otherType = typeAt(x, y + 1)
        if (otherType.types.includes('liquid') ||
            otherType.types.includes('gas') ||
            otherType.types.includes('empty')) {
            if (Math.random() <= verticalChance && !grid[x][y + 1].hasMoved) {
                swapPixels(x, y, x, y + 1)
                return true
            }
            return false
        }
    }
}

const swapPixels = (x1, y1, x2, y2) => {
    const pixel1 = grid[x1][y1]
    const pixel2 = grid[x2][y2]
    pixel1.hasMoved = true
    pixel2.hasMoved = true
    grid[x1][y1] = pixel2
    grid[x2][y2] = pixel1
}

const colorList = {
    heat200: Colors.createColor(['hex', '#ff0000']),
    heat100: Colors.createColor(['hex', '#ffff00']),
    heat0: Colors.createColor(['hex', '#ffffff']),
    'heat-100': Colors.createColor(['hex', '#0000ff']),
    'heat-200': Colors.createColor(['hex', '#9900ff']),
    air: Colors.createColor(['hex', '#ffffff']),
    water: Colors.createColor(['hex', '#0000ff']),
    ice: Colors.createColor(['hex', '#80e5ff']),
    steam: Colors.createColor(['hex', '#9999ff']),
    lava: Colors.createColor(['hex', '#ff6600']),
    stone: Colors.createColor(['hex', '#666666']),
    ash: Colors.createColor(['hex', '#1d1d30']),
    wood: Colors.createColor(['hex', '#452421']),
    fire: Colors.createColor(['hex', '#ff3300']),
    stem: Colors.createColor(['hex', '#66ff66']),
    deadPlant: Colors.createColor(['hex', '#3f733f']),
    dirt: Colors.createColor(['hex', '#8f5924']),
    flower: Colors.createColor(['hex', '#ec79cf']),
    heatSource: Colors.createColor(['hex', '#ff6600']),
    coldSource: Colors.createColor(['hex', '#0000ff']),
    void: Colors.createColor(['hex', '#000000']),
}

const pixelTypes = {
    air: {
        weight: 0,
        heatSpeed: .1,
        types: ['air', 'gas'],
        defaultHeat: 0,
        color: colorList.air
    },
    steam: {
        weight: -5,
        heatSpeed: .5,
        types: ['steam', 'gas'],
        color: colorList.steam,
        defaultHeat: 50,
        faze3(x, y, pixel) {
            if (pixel.heat <= 0)
                changePixel(x, y, 'water')
        },
        faze4(x, y, pixel) {
            gasSim(x, y, pixel, .25, .1)
        }
    },
    water: {
        weight: 10,
        heatSpeed: .5,
        types: ['air', 'liquid'],
        color: colorList.water,
        defaultHeat: 0,
        faze3(x, y, pixel) {
            if (pixel.heat <= -25)
                changePixel(x, y, 'ice')
            else if (pixel.heat >= 25)
                changePixel(x, y, 'steam')
        },
        faze4(x, y, pixel) {
            liquidSim(x, y, pixel)
        }
    },
    ice: {
        weight: 8,
        heatSpeed: .25,
        types: ['ice', 'solid'],
        color: colorList.ice,
        defaultHeat: -50,
        faze3(x, y, pixel) {
            if (pixel.heat >= 0)
                changePixel(x, y, 'water')
        }
    },
    lava: {
        weight: 20,
        heatSpeed: .1,
        types: ['lava', 'liquid'],
        color: colorList.lava,
        defaultHeat: 100,
        faze3(x, y, pixel) {
            if (pixel.heat <= 25)
                changePixel(x, y, 'stone')
        },
        faze4(x, y, pixel) {
            liquidSim(x, y, pixel, .5, .1)
        }
    },
    stone: {
        weight: 20,
        heatSpeed: .01,
        types: ['stone', 'solid'],
        color: colorList.stone,
        defaultHeat: 0,
        faze3(x, y, pixel) {
            if (pixel.heat >= 50)
                changePixel(x, y, 'lava')
        }
    },
    ash: {
        weight: 2,
        heatSpeed: .005,
        types: ['ash', 'sand'],
        color: colorList.ash,
        defaultHeat: 0,
        onCreate(x, y) { grid[x][y].mem.counter = 0, x, y },
        faze3(x, y, pixel) {
            let mem = pixel.mem
            if (pixel.mem.counter > 1000)
                changePixel(x, y, 'dirt')
            if (x == mem.x && y == mem.y)
                pixel.mem.counter++
            else {
                mem.x = x
                mem.y = y
                mem.counter = 0
            }
            pixel.mem = mem
        },
        faze4(x, y, pixel) {
            sandSim(x, y, pixel, .5)
        }
    },
    wood: {
        weight: 10,
        heatSpeed: .01,
        types: ['wood', 'solid'],
        color: colorList.wood,
        defaultHeat: 0,
        faze3(x, y, pixel) {
            if (pixel.heat >= 20)
                changePixel(x, y, 'fire')
        }
    },
    fire: {
        weight: -1,
        heatSpeed: .5,
        types: ['fire', 'gas'],
        color: colorList.fire,
        defaultHeat: 50,
        faze3(x, y, pixel) {
            let solid =
                (isPixelAt(x - 1, y) && typeAt(x - 1, y).types.includes('solid')) ||
                (isPixelAt(x + 1, y) && typeAt(x + 1, y).types.includes('solid')) ||
                (isPixelAt(x, y - 1) && typeAt(x, y - 1).types.includes('solid')) ||
                (isPixelAt(x, y + 1) && typeAt(x, y + 1).types.includes('solid'))
            if (pixel.heat <= 10 || !solid) changePixel(x, y, 'ash')
        }
    },
    deadPlant: {
        weight: 2,
        heatSpeed: .005,
        types: ['deadPlant', 'sand'],
        color: colorList.deadPlant,
        defaultHeat: 0,
        onCreate(x, y) { grid[x][y].mem.lifeTime = 0 },
        faze4(x, y, pixel) {
            sandSim(x, y, pixel, .5)
            pixel.mem.lifeTime += Math.random()
            if (pixel.mem.lifeTime >= 250)
                changePixel(x, y, 'dirt')
        }
    },
    stem: {
        weight: 3,
        heatSpeed: .01,
        types: ['stem', 'plant'],
        color: colorList.stem,
        defaultHeat: 0,
        onCreate(x, y) {
            grid[x][y].mem.distanceFromSoil = 50
            grid[x][y].mem.lifeTime = 0
        },
        faze3(x, y, pixel) {
            pixel.mem.lifeTime++
            if (pixel.mem.lifeTime > 1000)
                changePixel(x, y, 'deadPlant')

            let distanceFromSoil = pixel.mem.distanceFromSoil + 1
            isPixelAt(x - 1, y) ? typeAt(x - 1, y).types.includes('soil') ? distanceFromSoil = 0 : null : null
            isPixelAt(x + 1, y) ? typeAt(x + 1, y).types.includes('soil') ? distanceFromSoil = 0 : null : null
            isPixelAt(x, y - 1) ? typeAt(x, y - 1).types.includes('soil') ? distanceFromSoil = 0 : null : null
            isPixelAt(x, y + 1) ? typeAt(x, y + 1).types.includes('soil') ? distanceFromSoil = 0 : null : null

            isPixelAt(x - 1, y) && typeAt(x - 1, y).types.includes('plant') ? distanceFromSoil = Math.min(grid[x - 1][y].mem.distanceFromSoil + 1, distanceFromSoil) : null
            isPixelAt(x + 1, y) && typeAt(x + 1, y).types.includes('plant') ? distanceFromSoil = Math.min(grid[x + 1][y].mem.distanceFromSoil + 1, distanceFromSoil) : null
            isPixelAt(x, y - 1) && typeAt(x, y - 1).types.includes('plant') ? distanceFromSoil = Math.min(grid[x][y - 1].mem.distanceFromSoil + 1, distanceFromSoil) : null
            isPixelAt(x, y + 1) && typeAt(x, y + 1).types.includes('plant') ? distanceFromSoil = Math.min(grid[x][y + 1].mem.distanceFromSoil + 1, distanceFromSoil) : null

            if (distanceFromSoil >= 50)
                changePixel(x, y, 'deadPlant')

            if (pixel.heat >= 20)
                changePixel(x, y, 'fire')
            pixel.mem.distanceFromSoil = distanceFromSoil

            if (Math.random() < .0001) changePixel(x, y, 'flower')
        }
    },
    flower: {
        weight: 3,
        heatSpeed: .01,
        types: ['flower', 'plant'],
        color: colorList.flower,
        defaultHeat: 0,
        onCreate(x, y) {
            grid[x][y].mem.distanceFromSoil = 50
            grid[x][y].mem.lifeTime = 0
        },
        faze3(x, y, pixel) {
            pixel.mem.lifeTime++
            if (pixel.mem.lifeTime > 10_000)
                changePixel(x, y, 'deadPlant')
            let distanceFromSoil = pixel.mem.distanceFromSoil + 1
            isPixelAt(x - 1, y) ? typeAt(x - 1, y).types.includes('soil') ? distanceFromSoil = 0 : null : null
            isPixelAt(x + 1, y) ? typeAt(x + 1, y).types.includes('soil') ? distanceFromSoil = 0 : null : null
            isPixelAt(x, y - 1) ? typeAt(x, y - 1).types.includes('soil') ? distanceFromSoil = 0 : null : null
            isPixelAt(x, y + 1) ? typeAt(x, y + 1).types.includes('soil') ? distanceFromSoil = 0 : null : null

            isPixelAt(x - 1, y) && typeAt(x - 1, y).types.includes('plant') ? distanceFromSoil = Math.min(grid[x - 1][y].mem.distanceFromSoil + 1, distanceFromSoil) : null
            isPixelAt(x + 1, y) && typeAt(x + 1, y).types.includes('plant') ? distanceFromSoil = Math.min(grid[x + 1][y].mem.distanceFromSoil + 1, distanceFromSoil) : null
            isPixelAt(x, y - 1) && typeAt(x, y - 1).types.includes('plant') ? distanceFromSoil = Math.min(grid[x][y - 1].mem.distanceFromSoil + 1, distanceFromSoil) : null
            isPixelAt(x, y + 1) && typeAt(x, y + 1).types.includes('plant') ? distanceFromSoil = Math.min(grid[x][y + 1].mem.distanceFromSoil + 1, distanceFromSoil) : null

            if (distanceFromSoil >= 50)
                changePixel(x, y, 'deadPlant')

            if (pixel.heat >= 20)
                changePixel(x, y, 'fire')
            pixel.mem.distanceFromSoil = distanceFromSoil

            const heat = pixel.heat
            if (heat >= 10) {
                const distanceFromSoil = pixel.mem.distanceFromSoil + 0
                const replacement = Math.random() < .1 ? 'flower' : 'stem'
                switch (Math.floor(Math.random() * 4)) {
                    case (0):
                        if (isPixelAt(x - 1, y) && grid[x - 1][y].type == 'air') {
                            changePixel(x - 1, y, 'flower')
                            changePixel(x, y, replacement)
                            grid[x - 1][y].mem.distanceFromSoil = distanceFromSoil + 1
                            grid[x][y].mem.distanceFromSoil = distanceFromSoil + 0
                            grid[x][y].heat -= 10
                        }
                        break
                    case (1):
                        if (isPixelAt(x + 1, y) && grid[x + 1][y].type == 'air') {
                            changePixel(x + 1, y, 'flower')
                            changePixel(x, y, replacement)
                            grid[x + 1][y].mem.distanceFromSoil = distanceFromSoil + 1
                            grid[x][y].mem.distanceFromSoil = distanceFromSoil + 0
                            grid[x][y].heat -= 10
                        }
                        break
                    case (2):
                        if (isPixelAt(x, y - 1) && grid[x][y - 1].type == 'air') {
                            changePixel(x, y - 1, 'flower')
                            changePixel(x, y, replacement)
                            grid[x][y - 1].mem.distanceFromSoil = distanceFromSoil + 1
                            grid[x][y].mem.distanceFromSoil = distanceFromSoil + 0
                            grid[x][y].heat -= 10
                        }
                        break
                    case (3):
                        if (isPixelAt(x, y + 1) && grid[x][y + 1].type == 'air') {
                            changePixel(x, y + 1, 'flower')
                            changePixel(x, y, replacement)
                            grid[x][y + 1].mem.distanceFromSoil = distanceFromSoil + 1
                            grid[x][y].mem.distanceFromSoil = distanceFromSoil + 0
                            grid[x][y].heat -= 10
                        }
                        break
                }
            }
        }
    },
    dirt: {
        weight: 5,
        heatSpeed: .01,
        types: ['dirt', 'sand', 'soil'],
        color: colorList.dirt,
        defaultHeat: 0,
        faze3(x, y, pixel) {
            if (Math.random() < .001) {
                let exposed = false
                isPixelAt(x - 1, y) && grid[x - 1][y].type == 'air' ? exposed = true : null
                isPixelAt(x + 1, y) && grid[x + 1][y].type == 'air' ? exposed = true : null
                isPixelAt(x, y - 1) && grid[x][y - 1].type == 'air' ? exposed = true : null
                isPixelAt(x, y + 1) && grid[x][y + 1].type == 'air' ? exposed = true : null


                if (exposed) {
                    isPixelAt(x - 1, y) && (grid[x - 1][y].type == 'stem' || grid[x - 1][y].type == 'flower') ? exposed = false : null
                    isPixelAt(x + 1, y) && (grid[x + 1][y].type == 'stem' || grid[x + 1][y].type == 'flower') ? exposed = false : null
                    isPixelAt(x, y - 1) && (grid[x][y - 1].type == 'stem' || grid[x][y - 1].type == 'flower') ? exposed = false : null
                    isPixelAt(x, y + 1) && (grid[x][y + 1].type == 'stem' || grid[x][y + 1].type == 'flower') ? exposed = false : null

                    if (exposed)
                        changePixel(x, y, 'stem')
                }
            }
        },
        faze4(x, y, pixel) {
            sandSim(x, y, pixel)
        }
    },
    heatSource: {
        weight: 0,
        heatSpeed: .5,
        types: ['heatSource', 'solid'],
        color: colorList.heatSource,
        defaultHeat: 0,
        faze3(x, y, pixel) {
            pixel.heat += 100
        }
    },
    coldSource: {
        weight: 0,
        heatSpeed: .5,
        types: ['coldSource', 'solid'],
        color: colorList.coldSource,
        defaultHeat: 0,
        faze3(x, y, pixel) {
            pixel.heat -= 100
        }
    },
    void: {
        weight: 0,
        heatSpeed: .5,
        types: ['void', 'solid'],
        color: colorList.void,
        defaultHeat: 0,
        faze4(x, y, pixel) {
            isPixelAt(x - 1, y) ? changePixel(x - 1, y, 'air', true) : null
            isPixelAt(x + 1, y) ? changePixel(x + 1, y, 'air', true) : null
            isPixelAt(x, y - 1) ? changePixel(x, y - 1, 'air', true) : null
            isPixelAt(x, y + 1) ? changePixel(x, y + 1, 'air', true) : null
        }
    },
}

const pixelSize = (() => {
    const numSquares = 10_000
    let bestFit = Number.MAX_VALUE
    let bestSize = 0
    for (let rows = 1; rows <= numSquares; rows++) {
        let cols = Math.ceil(numSquares / rows)
        let sizeByWidth = Math.floor(canvas.width / cols)
        let sizeByHeight = Math.floor(canvas.height / rows)
        let squareSize = Math.min(sizeByWidth, sizeByHeight)
        let totalSquares = Math.floor(canvas.width / squareSize) * Math.floor(canvas.height / squareSize)
        let fitDiff = Math.abs(numSquares - totalSquares)
        if (fitDiff < bestFit) {
            bestFit = fitDiff
            bestSize = squareSize
        }
    }

    return bestSize
})()
const gridX = Math.floor(canvas.width / pixelSize)
const gridY = Math.floor(canvas.height / pixelSize)
const offsetX = canvas.width % pixelSize / 2
const offsetY = canvas.height % pixelSize / 2

const twoPageStartX = canvas.width / 2
const twoPageStartY = 0
const twoPagePixelSize = pixelSize / 2
const twoPageOffsetX = (canvas.width - gridX * twoPagePixelSize * 2) / 4
const twoPageOffsetY = (canvas.height - gridY * twoPagePixelSize) / 2

const renderMode = {
    normal: true,
    heat: false,
}

let grid = new Array(gridX).fill(0).map(() => new Array(gridY).fill(0).map(() => ({ type: 'air', heat: 0, hasMoved: false })))

let paused = false
let oneTick = false

const heatTransferFunctions = [
    (x, y) => { x > 0 ? shareHeat(x, y, x - 1, y) : null },
    (x, y) => { y > 0 ? shareHeat(x, y, x, y - 1) : null },
    (x, y) => { x < gridX - 1 ? shareHeat(x, y, x + 1, y) : null },
    (x, y) => { y < gridY - 1 ? shareHeat(x, y, x, y + 1) : null },
]

const heatTransfersPerTick = 5

let seasonCounter = 0
let seasonTime = 2500
let seasonStrength = 200

const start = Date.now()
let count = 0

setInterval(() => {
    count++
    if (count == 100) {
        console.log(`${(Date.now() - start) / count} ms per tick`)
    }

    let dirt = 0
    let average = 0
    grid.forEach((colum, x) => colum.forEach((pixel, y) => {
        average += pixel.heat
        pixel.type == 'dirt' ? dirt++ : null
    }))
    average = average / (gridX * gridY)

    if (dirt > gridX * gridY / 2)
        changePixel(Math.floor(Math.random() * gridX), gridY - 1, 'air')

    let heat = 0
    seasonCounter++
    if (seasonCounter % seasonTime < seasonTime / 2) {
        heat = (seasonStrength - average) / gridX * 2
    } else {
        heat = (-seasonStrength - average) / gridX * 2
    }
    for (let x = 0; x < gridX; x++)
        grid[x][0].heat += heat


    let pixels = []
    if (!paused || oneTick) {
        //1: remove the 'hasMoved' tag from all pixels
        grid.forEach(colum => colum.forEach(pixel => pixel.hasMoved = false))

        //2: share heat
        for (let i = 0; i < heatTransfersPerTick; i++) {
            pixels = []
            heatTransferFunctions.sort(() => Math.random() * 2 - 1)
            grid.forEach((colum, x) => colum.forEach((pixel, y) => pixels.push({ x, y, pixel })))
            pixels.sort(() => Math.random() * 2 - 1)
            pixels.forEach((item) => {
                const x = item.x
                const y = item.y
                heatTransferFunctions.forEach(func => func(x, y))
            })
        }

        //3: check for self change (eg: lava ran out of heat)
        pixels = []
        grid.forEach((colum, x) => colum.forEach((pixel, y) => pixels.push({ x, y, pixel })))
        pixels.sort(() => Math.random() * 2 - 1)
        pixels.forEach((item) => {
            const x = item.x
            const y = item.y
            const pixel = item.pixel
            const pixelType = pixelTypes[pixel.type]
            pixelType.faze3 ? pixelType.faze3(x, y, pixel) : null
        })

        //4: move
        pixels = []
        grid.forEach((colum, x) => colum.forEach((pixel, y) => pixels.push({ x, y, pixel })))
        pixels.sort(() => Math.random() * 2 - 1)
        pixels.forEach((item) => {
            const x = item.x
            const y = item.y
            const pixel = item.pixel
            const pixelType = pixel.color ?? pixelTypes[pixel.type]
            pixelType.faze4 ? pixelType.faze4(x, y, pixel) : null
        })
        oneTick = false
    }

    //5: render
    const ceilPixelSize = Math.ceil(pixelSize)

    if (renderMode.normal && !renderMode.heat) {
        grid.forEach((colum, x) => colum.forEach((pixel, y) => {
            if (pixel.hasMoved) {
                ctx.fillStyle = pixel.color ?? pixelTypes[pixel.type].color.hex
                ctx.fillRect(
                    Math.floor(offsetX + x * pixelSize),
                    Math.floor(offsetY + y * pixelSize),
                    ceilPixelSize,
                    ceilPixelSize
                )
            }
        }))

    } else if (renderMode.heat && !renderMode.normal) {
        grid.forEach((colum, x) => colum.forEach((pixel, y) => {
            ctx.fillStyle = Colors.multiLerp([
                colorList['heat-200'],
                colorList['heat-100'],
                colorList['heat0'],
                colorList['heat100'],
                colorList['heat200']
            ], Math.max(0, Math.min(1, (pixel.heat + 200) / 400))).hex
            ctx.fillRect(
                Math.floor(offsetX + x * pixelSize),
                Math.floor(offsetY + y * pixelSize),
                ceilPixelSize,
                ceilPixelSize
            )
        }))
    } else if (renderMode.normal && renderMode.heat) {

        const twoPageCeilPixelSize = Math.ceil(twoPagePixelSize)

        grid.forEach((colum, x) => colum.forEach((pixel, y) => {
            ctx.fillStyle = pixel.color ?? pixelTypes[pixel.type].color.hex
            // ctx.fillStyle = '#00f6'
            ctx.fillRect(
                Math.floor(twoPageOffsetX + x * twoPageCeilPixelSize),
                Math.floor(twoPageOffsetY + y * twoPageCeilPixelSize),
                twoPageCeilPixelSize,
                twoPageCeilPixelSize
            )
        }))

        grid.forEach((colum, x) => colum.forEach((pixel, y) => {
            ctx.fillStyle = Colors.multiLerp([
                colorList['heat-200'],
                colorList['heat-100'],
                colorList['heat0'],
                colorList['heat100'],
                colorList['heat200']
            ], Math.max(0, Math.min(1, (pixel.heat + 200) / 400))).hex
            // ctx.fillStyle = '#0f06'
            ctx.fillRect(
                Math.floor(twoPageOffsetX + twoPageStartX + x * twoPageCeilPixelSize),
                Math.floor(twoPageOffsetY + twoPageStartY + y * twoPageCeilPixelSize),
                twoPageCeilPixelSize,
                twoPageCeilPixelSize
            )
        }))

        // ctx.fillStyle = '#0f06'
        // ctx.fillRect(twoPageOffsetX, twoPageOffsetY, gridX * twoPagePixelSize, gridY * twoPagePixelSize)
        // ctx.fillStyle = '#00f6'
        // ctx.fillRect(twoPageOffsetX + twoPageStartX, twoPageOffsetY + twoPageStartY, gridX * twoPagePixelSize, gridY * twoPagePixelSize)

    }

    if (renderMode.normal && renderMode.heat) {
        const gx = Math.floor((mouse.x - twoPageOffsetX) / twoPagePixelSize) % gridX
        const gy = Math.floor((mouse.y - twoPageOffsetY) / twoPagePixelSize) % gridY
        ctx.fillStyle = brush.overlayColor
        runFunctionInCircle(gx, gy, brush.r, (x, y) => {
            if (x >= 0 && y >= 0 && x < gridX && y < gridY) {
                ctx.fillRect(twoPageOffsetX + x * twoPagePixelSize, twoPageOffsetY + y * twoPagePixelSize, twoPagePixelSize, twoPagePixelSize)
                ctx.fillRect(twoPageStartX + twoPageOffsetX + x * twoPagePixelSize, twoPageStartY + twoPageOffsetY + y * twoPagePixelSize, twoPagePixelSize, twoPagePixelSize)
            }
        })
    } else {
        const gx = Math.floor((mouse.x - offsetX) / pixelSize)
        const gy = Math.floor((mouse.y - offsetY) / pixelSize)
        runFunctionInCircle(gx, gy, brush.r, (x, y) => {
            if (x >= 0 && y >= 0 && x < gridX && y < gridY) {
                ctx.fillStyle = grid[x][y].color ?? pixelTypes[grid[x][y].type].color.hex
                ctx.fillRect(offsetX + x * pixelSize, offsetY + y * pixelSize, pixelSize, pixelSize)
            }
        })
        ctx.fillStyle = brush.overlayColor
        runFunctionInCircle(gx, gy, brush.r, (x, y) => {
            if (x >= 0 && y >= 0 && x < gridX && y < gridY) {
                ctx.fillRect(offsetX + x * pixelSize, offsetY + y * pixelSize, pixelSize, pixelSize)
            }
        })
    }
}, 1000 / 50)

const mouse = {
    leftButton: false,
    middleButton: false,
    rightButton: false,
    x: 0,
    y: 0
}

const brush = {
    type: 'air',
    ctrlType: 'reset',
    ctrlMode: false,
    r: 0,
    overlayColor: 'ffffff00'
}

const brushCtrlFunctions = {
    reset: {
        color: '#00ff00',
        func(x, y) { changePixel(x, y, grid[x][y].type) }
    },
    hot: {
        color: '#ff0000',
        func(x, y) { grid[x][y].heat += 100 }
    },
    cold: {
        color: '#0000ff',
        func(x, y) { grid[x][y].heat -= 100 }
    },
    heatMode() { renderMode.heat = !renderMode.heat },
    normalMode() { renderMode.normal = !renderMode.normal }

}

function runFunctionInCircle(centerX, centerY, R, X) {
    let startX = Math.floor(centerX - R)
    let endX = Math.ceil(centerX + R)
    let startY = Math.floor(centerY - R)
    let endY = Math.ceil(centerY + R)

    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            let distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))

            if (distanceFromCenter <= R) {
                X(x, y)
            }
        }
    }
}

const updateMouse = (event) => {
    mouse.x = event.pageX
    mouse.y = event.pageY
    mouse.buttons = event.buttons

    const buttonsInBi = (event.buttons + 8).toString(2).split('')
    mouse.leftPressed = buttonsInBi[3] == 1
    mouse.middlePressed = buttonsInBi[1] == 1
    mouse.rightPressed = buttonsInBi[2] == 1
    mouse.x = event.pageX
    mouse.y = event.pageY

    let gx, gy

    if (renderMode.normal && renderMode.heat) {
        gx = Math.floor((mouse.x - twoPageOffsetX) / twoPagePixelSize) % gridX
        gy = Math.floor((mouse.y - twoPageOffsetY) / twoPagePixelSize) % gridY
    } else {
        gx = Math.floor((mouse.x - offsetX) / pixelSize)
        gy = Math.floor((mouse.y - offsetY) / pixelSize)
    }
    if (mouse.leftPressed) {
        runFunctionInCircle(gx, gy, brush.r, (x, y) => {
            if (x >= 0 && y >= 0 && x < gridX && y < gridY) {
                if (brush.ctrlMode)
                    brushCtrlFunctions[brush.ctrlType].func(x, y)
                else
                    changePixel(x, y, brush.type, event.altKey)
            }
        })
    }
}
window.addEventListener('mousemove', event => updateMouse(event))
window.addEventListener('mousedown', event => updateMouse(event))
window.addEventListener('mouseup', event => updateMouse(event))
window.addEventListener('mouseout', () => mouse.x = canvas.width + mouse.r * pixelSize)
let keyCode = ''

window.addEventListener('keypress', event => {
    const key = event.key
    if (key == '-' || key == '_') brush.r = Math.max(0, brush.r - .5)
    else if (key == '=' || key == '+') brush.r += .5
    else if (key == ' ') paused = !paused
    else if (key == '`' || key == '~') oneTick = true
    else if (event.code == 'Enter') {
        if (event.ctrlKey) {
            if (brushCtrlFunctions[keyCode]) {
                if (typeof brushCtrlFunctions[keyCode] == 'function') {
                    brushCtrlFunctions[keyCode]()
                } else {
                    brush.ctrlType = keyCode
                    brush.overlayColor = Colors.createColor([['hex', brushCtrlFunctions[keyCode].color], ['alpha', 25]]).hex
                    brush.ctrlMode = true
                }
            }
        }
        else {
            if (pixelTypes[keyCode]) {
                brush.ctrlMode = false
                brush.type = keyCode
                brush.overlayColor = Colors.createColor([['hex', pixelTypes[brush.type].color.hex], ['alpha', 25]]).hex
            }
        }
        keyCode = ''
    }
    else keyCode += key
})

/**
 * The fazes are as follows
 * 1: remove the 'hasMoved' tag from all pixels
 * 2: share heat
 * 3: check for self change (eg: lava ran out of heat)
 * 4: move
 * 5: render
 */

runFunctionInCircle(Math.round(gridX / 2), Math.floor(gridX, gridY) / 4, Math.floor(gridX, gridY) / 4, (x, y) => {
    changePixel(x, y, 'deadPlant')
})
