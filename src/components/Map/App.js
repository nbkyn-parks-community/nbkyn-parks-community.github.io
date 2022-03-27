import React, { Component } from 'react';
import { loadImage } from './utils/image-loader';
import createCanvas from './utils/create-canvas';
import get from './utils/ajax';
import * as Path from './utils/path';
import { mult, sub, add } from './utils/vector';
import { clamp, interpolate, easing } from './utils/math2';
import './App.css';
import './css/style.css';
import './css/normalize.css';
import {
  arrayNum,
  getScroll,
  setCompositeOperation,
  drawCanvasSlice,
} from './utils/map';
import {
  setupBreakpoints,
  getMapBufferSize,
  calculateSections,
} from './utils/map';
import Sections from './sections';

export default class App extends Component {
  trailColor = () => {
    const { trailColor } = this.props;
    const { trailPath } = this.state;
    if (trailColor !== null) return trailColor;
    if (trailPath === null) return '#ccc';
  };
  trailWidth = () => {
    const { trailWidth } = this.props;
    const { trailPath } = this.state;
    if (trailWidth !== null) return trailWidth;
    if (trailPath === null) return 2;
  };

  state = {
    width: window.innerHeight,
    height: window.innerWidth,
    sectionIndex: 0,
    section: null,
    sectionBounds: {
      top: 0,
      height: 0,
    },
    cameraSegment: {
      start: 0,
    },
    trailSegment: {
      start: 0,
      end: 0,
      length: 0,
    },
    pos: 0,
    zoom: 1,
    ready: false,

    canvas: null,

    map: null,
    mapScale: 1,
    mapScales: 2,
    mapMaxScale: 2.5,
    mapCache: null,
    mapBuffer: null,
    mapBufferCtx: null,
    mapBufferScale: 0,
    mapBufferSize: { x: 2048, y: 2048 },
    mapBufferMargin: 400,
    mapBufferOffset: null,
    mapBufferLast: null,
    mapSVG: null,
    mapWidth: null,
    mapHeight: null,

    points: null,
    pointsPos: null,
    cameraPath: null,
    cameraBreakpoints: null,
    cameraSubdivisions: null,
    cameraSubdivisionSize: 1,
    cameraLength: 0,
    trailPath: null,
    trailPathData: null,
    trailBreakpoints: null,
    trailSubdivisions: null,
    trailSubdivisionSize: 1,
    trailLength: 0,

    labels: null,

    sections: null,
    sectionsBounds: null,
    sectionsIcons: null,
    imagesBounds: null,

    lastScroll: 0,
    scrollAnim: null,

    textWidth: 0,
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
  }

  componentDidMount() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const textContainer = document.querySelector('.text');
    const { canvas } = this.refs;
    canvas.style.position = 'absolute';
    canvas.style.top = 1;
    canvas.style.left = 0;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, this.state.width, this.state.height);

    this.setState({ canvas, ctx, textContainer }, () => {
      const { scroll, sections, sectionsIcons, imagesBounds, sectionsBounds } =
        calculateSections(
          this.state.textContainer.querySelectorAll('.js-section')
        );
      this.setState({
        scroll,
        sections,
        sectionsBounds,
        sectionsIcons,
        imagesBounds,
      });
      Array.from(this.state.textContainer.querySelectorAll('img')).forEach(
        (img) => {
          img.addEventListener('load', (event) => {
            this.renderMap();
          });
        }
      );
      const scrollAnim = { value: 0 };
      get(this.props.mapSrc).then((response) => {
        const mapSVG = Array.from(
          new DOMParser().parseFromString(response, 'image/svg+xml').childNodes
        ).filter((node) => {
          let tag = node.tagName;
          if (typeof tag === 'undefined') return false;
          return tag.toLowerCase() === 'svg';
        })[0];

        const cameraPath = mapSVG.querySelector('#camera-path path');
        const trailPath = mapSVG.querySelector('#trail-path path');

        const points = Array.from(mapSVG.querySelectorAll('#points ellipse'))
          .map((point) => {
            let [x, y] = [
              parseFloat(point.getAttribute('cx')),
              parseFloat(point.getAttribute('cy')),
            ];
            return {
              x,
              y,
              length: Path.getLengthAtPoint(trailPath, { x, y }),
              label: (point.getAttribute('id') || '').replace(/_/g, ' '),
              color: point.getAttribute('fill') || 'black',
              radius: parseFloat(point.getAttribute('r')),
            };
          })
          .sort((a, b) => a.length - b.length);

        this.setState(
          { mapSVG, cameraPath, trailPath, points, scrollAnim },
          () => {
            const cameraSubdivisions = Path.subdividePath(
              this.state.cameraPath,
              this.state.cameraSubdivisionSize,
              true
            );
            const cameraLength = Path.getLength(this.state.cameraPath);
            const cameraBreakpoints = setupBreakpoints(
              this.state.cameraPath,
              this.state.points,
              this.state.sections
            );

            const trailSubdivisions = Path.subdividePath(
              this.state.trailPath,
              this.state.trailSubdivisionSize,
              true
            );
            const trailBreakpoints = setupBreakpoints(
              this.state.trailPath,
              this.state.points,
              this.state.sections
            );
            const trailLength = Path.getLength(this.state.trailPath);

            loadImage(this.props.mapSrc).then((img) => {
              let mapWidth = img.width;
              let mapHeight = img.height;
              // quick IE fix for #27
              if (mapHeight === 0) {
                mapWidth = 2040;
                mapHeight = 1178;
              }
              const map = arrayNum(this.state.mapScales).map((v, i) => {
                let scale =
                  1 +
                  ((this.state.mapMaxScale - 1) / (this.state.mapScales - 1)) *
                  i;

                let map = createCanvas(mapWidth * scale, mapHeight * scale);
                let mapCtx = map.getContext('2d', { alpha: false });
                mapCtx.fillStyle = 'white';
                mapCtx.fillRect(0, 0, mapWidth * scale, mapHeight * scale);
                mapCtx.drawImage(
                  img,
                  0,
                  0,
                  mapWidth * scale,
                  mapHeight * scale
                );
                return { map, scale };
              });

              const mapBuffer = createCanvas(1, 1);
              const mapBufferCtx = mapBuffer.getContext('2d', { alpha: false });
              this.setState(
                {
                  mapBuffer,
                  mapBufferCtx,
                  map,
                },
                () => {
                  this.updateMapBufferSize();
                  mapBufferCtx.fillStyle = 'white';
                  mapBufferCtx.fillRect(
                    0,
                    0,
                    this.state.mapBufferSize.x,
                    this.state.mapBufferSize.y
                  );
                  const mapBufferOffset = { x: 0, y: 0 };
                  const mapBufferScale = this.state.mapScale;

                  const ready = true;
                  document.addEventListener('scroll', this.onScroll);

                  this.setState(
                    {
                      cameraSubdivisions,
                      cameraLength,
                      cameraBreakpoints,
                      trailSubdivisions,
                      trailBreakpoints,
                      trailLength,
                      mapWidth,
                      mapHeight,
                      mapBufferOffset,
                      mapBufferScale,
                      ready,
                    },
                    () => {
                      this.onResize();
                      window.addEventListener('resize', this.onResize);
                    }
                  );
                }
              );
            });
          }
        );
      });
    });
  }

  componentDidCatch(e) {
    console.error(e);
  }

  updateMapBufferSize = () => {
    const mapBufferSize = getMapBufferSize(
      this.state.width,
      this.state.height,
      this.state.mapBufferMargin
    );
    const { mapBuffer } = this.state;

    mapBuffer.setAttribute('width', mapBufferSize.x);
    mapBuffer.setAttribute('height', mapBufferSize.y);
    const mapBufferLast = {
      zoom: -1,
      pos: { x: -1, y: -1 },
    };
    this.setState({
      mapBuffer,
      mapBufferLast,
      mapBufferSize,
    });
  };

  onScroll = () => {
    let scroll = getScroll();
    this.updateScroll(scroll);
    this.renderMap();
  };

  updateScroll(scroll) {
    let sectionIndex = this.state.sectionsBounds.findIndex(
      (curSection, i, sections) => {
        let isLast = i === sections.length - 1;
        if (isLast) return true;

        let nextSection = sections[i + 1];
        let isBeforeNextTop =
          typeof nextSection !== 'undefined' ? scroll < nextSection.top : false;
        let isBeforeCurBottom = scroll < curSection.bottom;
        return isBeforeCurBottom || isBeforeNextTop;
      }
    );

    let sectionBounds = this.state.sectionsBounds[sectionIndex];
    let section = this.state.sections[sectionIndex];
    let pos = clamp((scroll - sectionBounds.top) / sectionBounds.height, 0, 1);

    let cameraSegment = {
      start: this.state.cameraBreakpoints[sectionIndex],
      end: this.state.cameraBreakpoints[
        clamp(sectionIndex + 1, this.state.cameraBreakpoints.length - 1)
      ],
    };
    cameraSegment.length = cameraSegment.end - cameraSegment.start;

    let trailSegment = {
      start: this.state.trailBreakpoints[sectionIndex],
      end: this.state.trailBreakpoints[
        clamp(sectionIndex + 1, this.state.trailBreakpoints.length - 1)
      ],
    };
    trailSegment.length = trailSegment.end - trailSegment.start;

    this.setState({
      sectionIndex,
      section,
      sectionBounds,
      pos,
      cameraSegment,
      trailSegment,
    });
  }
  onResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.updateMapBufferSize();
    const { scroll, sections, sectionsIcons, imagesBounds, sectionsBounds } =
      calculateSections(
        this.state.textContainer.querySelectorAll('.js-section')
      );
    this.setState({
      scroll,
      sections,
      sectionsBounds,
      sectionsIcons,
      imagesBounds,
    });
    this.onScroll();
  };
  getZoom() {
    return this.getZoomAtPercent(this.state.pos);
  }
  drawMapBuffer(ctx, pos, zoom) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.state.mapBufferSize.x, this.state.mapBufferSize.y);
    let mapIndex = 0;
    while (
      zoom > this.state.map[mapIndex].scale &&
      mapIndex < this.state.map.length - 1
    ) {
      mapIndex++;
    }
    let map = this.state.map[mapIndex];

    let offset = sub(mult(pos, map.scale), this.state.mapBufferMargin);
    let scale = map.scale / zoom;
    drawCanvasSlice(
      ctx,
      map.map,
      Object.assign({}, offset, {
        width: this.state.mapBufferSize.x * scale,
        height: this.state.mapBufferSize.y * scale,
      }),
      {
        x: 0,
        y: 0,
        width: this.state.mapBufferSize.x,
        height: this.state.mapBufferSize.y,
      }
    );
    return { offset, scale, mapScale: map.scale };
  }
  getCameraPosAtPercent(percent) {
    return Path.getPointAtPercent(this.state.cameraSubdivisions, percent);
  }
  getMapSliceAtPercent(percent) {
    //quick fix bug #20
    if (isNaN(percent)) percent = 1;
    let cameraPos = this.getCameraPosAtPercent(percent);
    let zoom = this.getZoomAtPercent(percent);
    let [width, height] = [this.state.width / zoom, this.state.height / zoom];
    let center = {
      x: this.state.width > 720 ? 0.66 : 0.5,
      y: 0.33,
    };
    return {
      x: cameraPos.x - width * center.x,
      y: cameraPos.y - height * center.y,
      width,
      height,
      zoom,
      cameraPos,
    };
  }
  getPosAtPercent(percent) {
    return this.state.pos;
  }
  getZoomAtPercent(percent) {
    let sectionIndex = this.state.sectionIndex;
    let pos = this.getPosAtPercent();

    let section = this.state.sections[sectionIndex];
    let nextSection =
      this.state.sections[
      clamp(sectionIndex + 1, this.state.sections.length - 1)
      ];

    let getNumericAttr = (el, attr, def = 1) => {
      let v = el.getAttribute(attr);
      return v == null ? def : parseFloat(v);
    };
    let getMiddleZoom = (section) =>
      getNumericAttr(section, 'data-zoom-middle', getStartZoom(section));
    let getStartZoom = (section) =>
      getNumericAttr(section, 'data-zoom-start', 1);

    let zoom1 = pos <= 0.5 ? getStartZoom(section) : getMiddleZoom(section);
    let zoom2 = pos <= 0.5 ? getMiddleZoom(section) : getStartZoom(nextSection);

    return interpolate(
      pos === 1 ? 1 : pos / 0.5 - Math.floor(pos / 0.5),
      zoom1,
      zoom2,
      easing.cubic.inOut
    );
  }
  renderMap() {
    if (!this.state.ready) return;
    let trailSegment = this.state.trailSegment;
    let drawImagePointer = (image) => {
      let scroll = getScroll();

      let imageMapPos = Path.getPointAtPercent(
        this.state.trailSubdivisions,
        interpolate(image.mapPos, trailSegment.start, trailSegment.end) /
        this.state.trailLength
      );

      let halfWindowHeight = window.innerHeight / 2;
      let falloff = halfWindowHeight * 1.2;
      let imageMiddle = image.top + image.height / 2 - scroll;
      let imageVisibility =
        (falloff - Math.abs(halfWindowHeight - imageMiddle)) / falloff;

      imageVisibility = easing.quad.out(clamp(imageVisibility));

      if (imageVisibility <= 0) return;

      let origin = canvasPos(imageMapPos);
      origin = {
        x: origin[0],
        y: origin[1],
      };

      let transformCoords = (x, y) => [x, y];
      let drawTriangle = (corner1, corner2) => {
        corner1 = transformCoords(...corner1);
        corner2 = transformCoords(...corner2);

        let getAngle = (x, y) => Math.atan2(y - origin.y, x - origin.x);

        const PI = Math.PI;
        const PI2 = PI * 2;
        let angle1 = getAngle(...corner1) + PI2;
        let angle2 = getAngle(...corner2) + PI2;
        let angleDelta = Math.atan2(
          Math.sin(angle1 - angle2),
          Math.cos(angle1 - angle2)
        );
        let angleMiddle = angle1 - angleDelta / 2;

        let radius = 2 * imageVisibility;

        let angleOrigin = angleMiddle + PI / 2;
        let originOffset = {
          x: (radius + 1) * Math.cos(angleOrigin),
          y: (radius + 1) * Math.sin(angleOrigin),
        };
        let colorValue = imageVisibility * 0.3;
        const { canvas } = this.refs;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = `rgba(220,220,202,${colorValue})`;
        setCompositeOperation(ctx, 'darken', 'source-over');

        ctx.beginPath();
        ctx.moveTo(origin.x + originOffset.x, origin.y + originOffset.y);
        ctx.lineTo(...corner1);
        ctx.lineTo(...corner2);
        ctx.lineTo(origin.x - originOffset.x, origin.y - originOffset.y);

        ctx.lineWidth = 5 * imageVisibility;
        ctx.arc(origin.x, origin.y, radius, angleOrigin + PI, angleOrigin);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(origin.x, origin.y, radius, angleOrigin, angleOrigin + PI2);
        //this.ctx.strokeStyle=`#aaa`
        // this.ctx.stroke()
        ctx.fill();
        setCompositeOperation(ctx);

        ctx.fillStyle = `#405b54`;
        let imagePointRadius = 4 * imageVisibility;
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, imagePointRadius, 0, PI2);
        ctx.fill();
      };

      let corner1 = [
        image.top - scroll < origin.y ? image.right : image.left,
        image.top - scroll,
      ];
      let corner2 = [
        image.bottom - scroll < origin.y ? image.left : image.right,
        image.right < origin.x ? image.bottom - scroll : image.top - scroll,
      ];

      drawTriangle(corner1, corner2);
    };

    let drawImagePointers = () => {
      this.state.imagesBounds[this.state.sectionIndex].forEach(
        drawImagePointer
      );
    };

    let drawSubdividedPath = (path, interval = 1, end = -1) => {
      const { canvas } = this.refs;
      const ctx = canvas.getContext('2d');

      ctx.beginPath();
      ctx.moveTo(...canvasPos(path[0]));
      let brokenPath = false;
      for (
        let i = 1;
        i < (end === -1 ? path.length : clamp(end, path.length));
        i += interval
      ) {
        let f = brokenPath ? ctx.moveTo : ctx.lineTo;
        let p = canvasPos(path[i]);
        if (
          p[0] >= 0 &&
          p[1] >= 0 &&
          p[0] < this.state.width &&
          p[1] < this.state.height
        ) {
          brokenPath = false;
          f.call(ctx, ...p);
        } else {
          brokenPath = true;
        }
      }
      ctx.stroke();
    };

    let drawTrail = () => {
      const { canvas } = this.refs;
      const ctx = canvas.getContext('2d');

      ctx.lineWidth = this.state.trailWidth;
      ctx.strokeStyle = this.state.trailColor;
      ctx.lineCap = 'round';
      ctx.setLineDash(this.props.trailDash);
      drawSubdividedPath(this.state.trailSubdivisions, 4);

      ctx.lineWidth = this.props.trailVisitedWidth;
      ctx.setLineDash([]);
      ctx.strokeStyle = this.props.trailVisitedColor;
      ctx.lineCap = 'butt';
      drawSubdividedPath(this.state.trailSubdivisions, 2, trailTipIndex);
    };

    let isVisited = (point) => trailPos >= point.length;

    // sets a value if the point has been visited, is being visited, or hasnt been visited yet
    let setByStatus = (i, past, present, future = null) => {
      if (future == null) future = past;
      let point = this.state.points[i];
      let nextPoint = this.state.points[i + 1] || null;
      if (!isVisited(point)) return future;
      if (nextPoint == null) return present;
      if (isVisited(nextPoint)) return past;
      return present;
    };

    let drawPoint = (point, i) => {
      const { canvas } = this.refs;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = setByStatus(
        i,
        this.props.pointPastColor || point.color,
        this.props.pointPresentColor || point.color,
        this.props.pointFutureColor
      );
      ctx.beginPath();
      ctx.arc(
        ...canvasPos(point),
        this.props.pointRadius || point.radius,
        0,
        2 * Math.PI
      );
      ctx.fill();
    };

    let drawPoints = () => this.state.points.forEach(drawPoint);

    let drawLabel = (point, i) => {
      let fontSize = 15;
      const { canvas } = this.refs;
      const ctx = canvas.getContext('2d');
      ctx.font = `${setByStatus(i, 'normal', 'bold')} ${setByStatus(
        i,
        fontSize,
        fontSize * 1.2
      )}px Arial`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = setByStatus(
        i,
        this.props.fontPastColor,
        this.props.fontPresentColor,
        this.props.fontFutureColor
      );
      ctx.strokeStyle = '#FDFCEC';
      ctx.lineWidth = 6;
      let pos = add(point, { x: 20 * inverseZoom, y: 0 });
      ctx.strokeText(point.label, ...canvasPos(pos));
      ctx.fillText(point.label, ...canvasPos(pos));
    };

    let drawLabels = () => this.state.points.forEach(drawLabel);

    let drawIcon = () => {
      const { canvas } = this.refs;
      const ctx = canvas.getContext('2d');

      if (icon == null) return;

      let iconCenter = {
        x: icon.width / 2,
        y: icon.height / 2,
      };
      let angle = Math.atan2(
        trailTip?.y - trailTip2?.y,
        trailTip?.x - trailTip2.x
      );
      ctx.save();
      ctx.translate(...canvasPos(trailTip?.x, trailTip?.y));
      ctx.rotate(angle);
      let p = pos * 1.2;
      let scale = clamp(
        p < 0.5
          ? interpolate(p * 2, 0, 1, easing.quad.out)
          : interpolate(p * 2 - 1, 1, 0, easing.quad.in)
      );
      scale *= 0.7;
      ctx.scale(scale, scale);
      ctx.drawImage(icon, -iconCenter.x, -iconCenter.y);
      ctx.restore();
    };
    let checkForBufferUpdate = () => {
      let zoomDelta = Math.abs(zoom - this.state.mapBufferLast.zoom);
      let dx = Math.abs(mapSlice.x - this.state.mapBufferLast.pos.x);
      let dy = Math.abs(mapSlice.y - this.state.mapBufferLast.pos.y);
      let mapIndex = 0;
      while (
        zoom > this.state.map[mapIndex].scale &&
        mapIndex < this.state.map.length - 1
      ) {
        mapIndex++;
      }
      let optimalScale = this.state.map[mapIndex].scale;

      if (
        dx < this.state.mapBufferMargin / 3 &&
        dy < this.state.mapBufferMargin / 3 &&
        zoomDelta < 1 &&
        !(
          zoom === optimalScale &&
          this.state.mapBufferLast.zoom !== optimalScale
        )
      )
        return;

      const mapBufferLast = {
        zoom,
        pos: { x: mapSlice.x, y: mapSlice.y },
      };
      this.setState({
        mapBufferLast,
      });
      updateMapBuffer();
    };

    let updatedBufferThisFrame = false;
    let updateMapBuffer = () => {
      updatedBufferThisFrame = true;
      let buffer = this.drawMapBuffer(this.state.mapBufferCtx, mapSlice, zoom);
      const mapBufferScale = buffer.scale;
      const mapBufferOffset = buffer.offset;
      const mapScale = buffer.mapScale;
      this.setState({
        mapBufferScale,
        mapBufferOffset,
        mapScale,
      });
    };
    let drawMap = () => {
      checkForBufferUpdate();
      const { canvas } = this.refs;
      const ctx = canvas.getContext('2d');

      if (!updatedBufferThisFrame) {
        let slice = {
          x:
            (mapSlice.x * this.state.mapScale - this.state.mapBufferOffset.x) /
            this.state.mapBufferScale,
          y:
            (mapSlice.y * this.state.mapScale - this.state.mapBufferOffset.y) /
            this.state.mapBufferScale,
          width:
            (mapSlice.width * this.state.mapScale) / this.state.mapBufferScale,
          height:
            (mapSlice.height * this.state.mapScale) / this.state.mapBufferScale,
        };
        let target = {
          x: 0,
          y: 0,
          width: this.state.width,
          height: this.state.height,
        };
        drawCanvasSlice(ctx, this.state.mapBuffer, slice, target);
      } else {
        ctx.drawImage(
          this.state.mapBuffer,
          Math.round(-this.state.mapBufferMargin / this.state.mapBufferScale),
          Math.round(-this.state.mapBufferMargin / this.state.mapBufferScale)
        );
      }
    };

    let pos = this.state.pos;
    let sectionIndex = this.state.sectionIndex;
    let cameraSegment = this.state.cameraSegment;

    let trailPos = interpolate(pos, trailSegment.start, trailSegment.end, (v) =>
      clamp(v * 1.2)
    );
    let trailTipIndex = Math.round(trailPos / this.state.trailSubdivisionSize);
    let trailTip =
      this.state.trailSubdivisions[
      clamp(trailTipIndex, this.state.trailSubdivisions.length - 1)
      ];
    let trailTip2 =
      this.state.trailSubdivisions[
      clamp(trailTipIndex - 1, this.state.trailSubdivisions.length - 1)
      ];
    let icon = this.state.sectionsIcons[sectionIndex];

    let mapSlice = this.getMapSliceAtPercent(
      interpolate(pos, cameraSegment.start, cameraSegment.end) /
      this.state.cameraLength
    );
    let zoom = mapSlice.zoom;
    let inverseZoom = 1 / zoom;

    let dpi = 1; //window.devicePixelRatio

    let canvasPos = (x, y) =>
      typeof x === 'object'
        ? canvasPos(x.x, x.y)
        : [(x - mapSlice.x) * zoom, (y - mapSlice.y) * zoom];

    // Clear canvas
    const { canvas } = this.refs;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(
      0,
      0,
      this.state.canvas.width * dpi,
      this.state.canvas.height * dpi
    );

    drawMap();
    drawTrail();
    drawIcon();
    drawPoints();
    drawLabels();
    drawImagePointers();

    let blendWorks = setCompositeOperation(ctx, 'screen');

    let gradient = ctx.createLinearGradient(
      this.state.sectionsBounds[0].right,
      0,
      this.state.sectionsBounds[0].right + 200,
      0
    );
    if (blendWorks) {
      gradient.addColorStop(0, 'rgba(185, 217, 151, 1)');
      gradient.addColorStop(1, 'rgba(185, 217, 151, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }
    ctx.fillStyle = gradient;

    ctx.fillRect(
      0,
      0,
      this.state.sectionsBounds[0].right + 200,
      this.state.height
    );

    if (blendWorks) setCompositeOperation(ctx);
  }

  render() {
    const { width, height } = this.state;
    return (
      <div className="main">
        {!this.state.mapBuffer &&
          <div>
            <div class="snippet" data-title=".dot-collision">
              <h2> Loading Image
                <br/>
                <div class="dot-collision"></div>
              </h2>
            </div>
          </div>
        }
        <div className="container-map">
          <canvas ref="canvas" width={width} height={height}></canvas>
        </div>
        <Sections children={this.props.children} />
      </div>
    );
  }
}