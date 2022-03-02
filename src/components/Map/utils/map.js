import * as Path from './path'

export const setupBreakpoints = (path,points,sections) => {
    return points.map(point => Path.getLengthAtPoint(path, point))
      .map((point, i) =>
        sections[i].getAttribute('data-stay') === 'true' ? [point, point] : [point]
      )
      .reduce((flattened, cur) => flattened.concat(cur), [])
  }

export const getMapBufferSize = (width,height,mapBufferMargin) => {
    return {
      x: width + (mapBufferMargin * 2),
      y: height + (mapBufferMargin * 2)
    }
  }



  export let arrayNum = v => Array.from(Array(v))
  export let getScroll = () => window.pageYOffset
  export let setCompositeOperation = (ctx, mode = 'source-over', fallback = null) => {
    ctx.globalCompositeOperation = mode
    let worked = (ctx.globalCompositeOperation === mode)
    if (!worked && fallback !== null)
      ctx.globalCompositeOperation = fallback
    return worked
  }
  
  export let drawCanvasSlice = (ctx, img, slice, target) => {
    let sliceScale = {
      x: img.width / slice.width,
      y: img.height / slice.height,
    }
    let targetSize = {
      width: target.width * sliceScale.x,
      height: target.height * sliceScale.y
    }
    let targetScale = {
      x: targetSize.width / img.width,
      y: targetSize.height / img.height
    }
  
    ctx.drawImage(
      img,
      Math.round(-slice.x * targetScale.x),
      Math.round(-slice.y * targetScale.y),
      Math.round(targetSize.width),
      Math.round(targetSize.height)
    )
  }

  export const calculateSections = (jssection) => {
    let scroll = getScroll()
    const sections = Array.from(jssection)

    const sectionsBounds = sections.map(section => {
      let bounds = section.getBoundingClientRect()
      return {
        top: bounds.top + scroll,
        bottom: bounds.bottom + scroll,
        left: bounds.left,
        right: bounds.right,
        height: bounds.height,
        width: bounds.width,
      }
    })
    const sectionsIcons = sections.map(section => {
      let icon = section.getAttribute('data-icon')
      if (icon != null) {
        let iconImg = document.createElement('img')
        iconImg.setAttribute('src', icon)
        return iconImg
      }
      return null
    })

    const imagesBounds = sections.map(section =>
      Array.from(section.querySelectorAll('.js-image')).map(image => {
        let bounds = image.getBoundingClientRect()
        return {
          top: bounds.top + scroll,
          bottom: bounds.bottom + scroll,
          left: bounds.left,
          right: bounds.right,
          height: bounds.height,
          mapPos: parseFloat(image.getAttribute('data-pos'))
        }
      })
    )
  return ({
      scroll,
      sections,
      sectionsIcons,
      imagesBounds,
      sectionsBounds
    })
  }