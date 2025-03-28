import React, { useEffect, useRef } from 'react';
import { Engine, GameObj, Point, Polygon, range, Scene, Vector } from '@metal-pony/bucket-js';
import Page from '../page/Page';

const width = (Math.trunc(window.innerWidth / 64) - 1) * 64;
const height = Math.trunc(window.innerHeight / 64)*64;
const scene = new Scene({
  name: 'main',
  dims: {
    width,
    height,
    viewWidth: width,
    viewHeight: height
  },
  bgColorCode: '#33bb33'
});

const createGameObj = (numPoints=(3 + Math.trunc(Math.random() * 9))) => {
  return new GameObj({
    poly: new Polygon(
      range(numPoints).map(() => Math.random()*2*Math.PI).sort().map(angle => {
        const radius = Math.random()*32 + 32;
        return new Point({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
      })
    ),
    location: new Point({
      x: Math.random() * width,
      y: Math.random() * height
    }),
    velocity: new Vector({
      x: Math.random()*125*2-125,
      y: Math.random()*125*2-125
    }),
    angularVelocity: Math.random() * 2*Math.PI - Math.PI,
    acceleration: new Vector({ x: 0, y: 200 }),
  });
};

const numObjs = 10;
const addObjsToScene = (n) => {
  for (let n = 0; n < numObjs; n++) {
    scene.addObj(createGameObj());
  }
};

scene.load = () => addObjsToScene(numObjs);

const engine = new Engine();
engine.addScene(scene);

/**
 *
 * @param {object} props
 * @returns
 */
export function Home({}) {
  /**
   * @type {React.RefObject<HTMLCanvasElement>}
   */
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) throw new Error('Canvas not found. Cannot initialize engine.');

    /** @type {Map<string,(ev: MouseEvent) => void>}*/
    const listeners = new Map();
    listeners.set('+', () => {
      addObjsToScene(numObjs);
      engine.render();
    });
    listeners.set('-', () => {
      scene.objs.filter(obj => obj.stationary).forEach(obj => scene.removeObj(obj));
      engine.render();
    });
    listeners.set(' ', () => {
      if (engine.status === Engine.STATUS.IN_PROGRESS) {
        engine.stop();
      } else {
        engine.start(true);
      }
    });
    listeners.set('Escape', () => {
      engine.stop();
    });
    listeners.set('r', () => {
      engine.resetScene();
    });

    /**
     * @param {KeyboardEvent} ev
     */
    const keyListener = (ev) => {
      console.log(`key: ${ev.key}`);
      if (listeners.has(ev.key)) {
        listeners.get(ev.key)();
      }
    };
    canvas.addEventListener('keydown', keyListener);

    // Prevent context menu from appearing
    canvas.oncontextmenu = (ev) => {
      ev.preventDefault();
    };
    engine.connect(canvas);
    engine.switchToScene('main');

    return () => {
      engine.stop();
      engine.shutdown();
      canvas.removeEventListener('keydown', keyListener);
    };
  }, []);

  window.onload = () => {
    console.log('Window loaded');
    canvasRef.current.focus();
  };

  return (
    <Page includeGoats={false} includeNav={false}>
      <div className='vertical'>
        <canvas
          id="engine-canvas"
          ref={canvasRef}
          width="100"
          height="100"
          tabIndex={1}
        />
      </div>
    </Page>
  );
}

export default Home;
