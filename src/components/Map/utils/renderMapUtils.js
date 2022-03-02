import { clamp, interpolate, easing } from './utils/math2'
import { arrayNum, getScroll, setCompositeOperation, drawCanvasSlice} from './utils/map'
import * as Path from './utils/path'

export const canvasPos = (x, y) => typeof x === 'object' ?
canvasPos(x.x, x.y) : [
  (x - mapSlice.x) * zoom,
  (y - mapSlice.y) * zoom
]


export const drawImagePointer = (image,trailSegment,trailSubdivisions,trailLength) => {
    let scroll = getScroll()

    let imageMapPos = Path.getPointAtPercent(
      trailSubdivisions,
      interpolate(
        image.mapPos,
        trailSegment.start,
        trailSegment.end
      ) / trailLength
    )


    let halfWindowHeight = window.innerHeight / 2
    let falloff = halfWindowHeight * 1.2
    let imageMiddle = image.top + (image.height / 2) - scroll
    let imageVisibility = (
      falloff - Math.abs(halfWindowHeight - imageMiddle)
    ) / falloff

    imageVisibility = easing.quad.out(clamp(imageVisibility))

    if (imageVisibility <= 0) return

    let origin = canvasPos(imageMapPos)
    origin = {
      x: origin[0],
      y: origin[1]
    }

    let transformCoords = (x, y) => [x, y]
    let drawTriangle = (corner1, corner2) => {
      corner1 = transformCoords(...corner1)
      corner2 = transformCoords(...corner2)

      let getAngle = (x, y) =>
        Math.atan2(y - origin.y, x - origin.x)

      const PI = Math.PI
      const PI2 = PI * 2
      let angle1 = getAngle(...corner1) + PI2
      let angle2 = getAngle(...corner2) + PI2
      let angleDelta = Math.atan2(Math.sin(angle1 - angle2), Math.cos(angle1 - angle2))
      let angleMiddle = angle1 - (angleDelta / 2)

      let radius = 2 * imageVisibility

      let angleOrigin = angleMiddle + (PI / 2)
      let originOffset = {
        x: (radius + 1) * Math.cos(angleOrigin),
        y: (radius + 1) * Math.sin(angleOrigin)
      }
      let colorValue = imageVisibility * 0.3
      const { canvas } = this.refs;
      const ctx = canvas.getContext("2d")

      ctx.fillStyle = `rgba(220,220,202,${colorValue})`
      setCompositeOperation(ctx, 'darken', 'source-over')


      ctx.beginPath()
      ctx.moveTo(
        origin.x + originOffset.x,
        origin.y + originOffset.y
      )
      ctx.lineTo(...corner1)
      ctx.lineTo(...corner2)
      ctx.lineTo(
        origin.x - originOffset.x,
        origin.y - originOffset.y
      )

      ctx.lineWidth = 5 * imageVisibility
      ctx.arc(origin.x, origin.y, radius, angleOrigin + PI, angleOrigin)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(origin.x, origin.y, radius, angleOrigin, angleOrigin + PI2)
      //this.ctx.strokeStyle=`#aaa`
      // this.ctx.stroke()
      ctx.fill()
      setCompositeOperation(ctx)

      ctx.fillStyle = `#405b54`
      let imagePointRadius = 4 * imageVisibility
      ctx.beginPath()
      ctx.arc(origin.x, origin.y, imagePointRadius, 0, PI2)
      ctx.fill()
    }

    let corner1 = [
      image.top - scroll < origin.y ? image.right : image.left,
      image.top - scroll
    ]
    let corner2 = [
      image.bottom - scroll < origin.y ? image.left : image.right,
      image.right < origin.x ? image.bottom - scroll : image.top - scroll
    ]

    drawTriangle(
      corner1,
      corner2
    )

  }

const  getZoomAtPercent = (percent) => {
    let sectionIndex = this.state.sectionIndex
    let pos = this.getPosAtPercent()

    let section = this.state.sections[sectionIndex]
    let nextSection = this.state.sections[clamp(sectionIndex + 1, this.state.sections.length - 1)]

    let getNumericAttr = (el, attr, def = 1) => {
      let v = el.getAttribute(attr)
      return (v == null) ? def : parseFloat(v)
    }
    let getMiddleZoom = (section) => getNumericAttr(section, 'data-zoom-middle', getStartZoom(section))
    let getStartZoom = (section) => getNumericAttr(section, 'data-zoom-start', 1)

    let zoom1 = pos <= 0.5 ? getStartZoom(section) : getMiddleZoom(section)
    let zoom2 = pos <= 0.5 ? getMiddleZoom(section) : getStartZoom(nextSection)

    return interpolate(
      pos === 1 ? 1 : ((pos / 0.5) - Math.floor(pos / 0.5)),
      zoom1,
      zoom2,
      easing.cubic.inOut
    )
  }